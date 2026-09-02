import { useRouter, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { NativeModules, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { syncSwimmingData } from '@/api/endpoints/swimming.api';
import { useAppStore } from '@/store';
import { badges } from '../(main)/post/badge';

const getRelativeDateStr = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00:00';
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const getAppleHealthKit = () => {
  return NativeModules.AppleHealthKit || NativeModules.RCTAppleHealthKit;
};

const getAverageHeartRate = (startDate: string, endDate: string): Promise<number> => {
  return new Promise((resolve) => {
    const AppleHealthKit = getAppleHealthKit();
    if (!AppleHealthKit || typeof AppleHealthKit.getHeartRateSamples !== 'function') {
      resolve(0);
      return;
    }
    AppleHealthKit.getHeartRateSamples(
      {
        startDate: startDate,
        endDate: endDate,
      },
      (err, results) => {
        if (err || !results || results.length === 0) {
          resolve(0);
          return;
        }
        const sum = results.reduce((acc, sample) => acc + sample.value, 0);
        resolve(Math.round(sum / results.length));
      },
    );
  });
};

const calculatePace = (distanceMeters: number, durationSeconds: number): string => {
  if (distanceMeters <= 0) return '00:00';
  const timePer100m = (durationSeconds / distanceMeters) * 100;
  const minutes = Math.floor(timePer100m / 60);
  const seconds = Math.round(timePer100m % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function DashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const isWatchConnected = useAppStore((s) => s.isWatchConnected);

  const [swimData, setSwimData] = useState<{ [key: string]: string[] }>(() => {
    return isWatchConnected
      ? {}
      : {
          [getRelativeDateStr(-2)]: ['breaststroke', 'backstroke'],
          [getRelativeDateStr(-1)]: ['butterfly', 'backstroke'],
          [getRelativeDateStr(0)]: ['backstroke', 'freestyle', 'mix'],
          [getRelativeDateStr(1)]: ['freestyle', 'backstroke', 'breaststroke'],
        };
  });

  const [todayStats, setTodayStats] = useState(() => {
    return isWatchConnected
      ? {
          distance: 0,
          duration: 0,
          pace: '--:--',
          avgHeartRate: 0,
        }
      : {
          distance: 750,
          duration: 2785, // 00:46:25
          pace: '2:27',
          avgHeartRate: 139,
        };
  });

  // 이번 주의 날짜들 계산 (일~토)
  const getWeekDaysObjects = () => {
    const current = new Date();
    const first = current.getDate() - current.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(current);
      d.setDate(first + i);
      return d;
    });
  };

  const weekDatesObjects = getWeekDaysObjects();
  const weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // 영법별 컬러 정의
  const strokesColor: { [key: string]: string } = {
    freestyle: '#FFF6B6', // 자유형
    backstroke: '#ADF0C7', // 배영
    breaststroke: '#DEDAFF', // 평영
    butterfly: '#C6DCFF', // 접영
    mix: '#FFC6C6', // 혼영
  };

  useEffect(() => {
    if (!isWatchConnected) return;
    const AppleHealthKit = getAppleHealthKit();
    if (!AppleHealthKit || typeof AppleHealthKit.isAvailable !== 'function') {
      console.log(
        '[Sync] AppleHealthKit native module is not available (Expo Go / unlinked / New Arch lazy)',
      );
      return;
    }

    const syncHealthData = async () => {
      console.log('[Sync] Starting Apple HealthKit sync...');
      AppleHealthKit.isAvailable((err, available) => {
        if (err || !available) {
          console.log('[Sync] HealthKit is not available on this device');
          return;
        }

        const current = new Date();
        const first = current.getDate() - current.getDay();
        const startOfWeek = new Date(current);
        startOfWeek.setDate(first);
        startOfWeek.setHours(0, 0, 0, 0);

        const options = {
          startDate: startOfWeek.toISOString(),
        };

        AppleHealthKit.getAnchoredWorkouts(options, async (queryErr, results) => {
          if (queryErr) {
            console.warn('[Sync] Failed to fetch anchored workouts:', queryErr);
            return;
          }

          const workouts = results?.data || [];
          const swimWorkouts = workouts.filter((w) => w.activityId === 37);

          // 주간 캘린더 데이터 가공
          const newSwimData: { [key: string]: string[] } = {};

          // 오늘 날짜 데이터 집계
          const todayStr = new Date().toISOString().split('T')[0];
          let todayDistance = 0;
          let todayDuration = 0;
          let todayHeartRateSum = 0;
          let todayHeartRateCount = 0;

          for (const workout of swimWorkouts) {
            const dateStr = workout.start.split('T')[0];

            // 영법 도트 생성 (아이디 해시 값을 이용해 다양하게 뿌려줌)
            const index = workout.id.charCodeAt(0) % 5;
            const strokes = [
              ['freestyle'],
              ['backstroke'],
              ['breaststroke'],
              ['butterfly'],
              ['mix'],
            ][index];

            if (!newSwimData[dateStr]) {
              newSwimData[dateStr] = [];
            }
            newSwimData[dateStr].push(...strokes);
            if (newSwimData[dateStr].length > 3) {
              newSwimData[dateStr] = newSwimData[dateStr].slice(0, 3);
            }

            if (dateStr === todayStr) {
              todayDistance += workout.distance || 0;
              todayDuration += workout.duration || 0;

              const avgHR = await getAverageHeartRate(workout.start, workout.end);
              if (avgHR > 0) {
                todayHeartRateSum += avgHR;
                todayHeartRateCount++;
              }
            }
          }

          setSwimData(newSwimData);

          const finalAvgHR =
            todayHeartRateCount > 0 ? Math.round(todayHeartRateSum / todayHeartRateCount) : 0;
          const finalPace = calculatePace(todayDistance, todayDuration);

          setTodayStats({
            distance: todayDistance,
            duration: todayDuration,
            pace: finalPace,
            avgHeartRate: finalAvgHR,
          });

          // 백엔드 서버 동기화 작업
          const currentSyncedIds = useAppStore.getState().syncedWorkoutIds || [];
          const unsyncedWorkouts = swimWorkouts.filter((w) => !currentSyncedIds.includes(w.id));

          for (const workout of unsyncedWorkouts) {
            try {
              const avgHeartRate = await getAverageHeartRate(workout.start, workout.end);
              const pace = calculatePace(workout.distance || 0, workout.duration || 0);

              const payload = {
                date: workout.start.split('T')[0],
                distance: workout.distance || 0,
                duration: Math.round((workout.duration || 0) / 60),
                pace: pace,
                averageHeartRate: avgHeartRate,
                platform: 'ios' as const,
              };

              console.log(`[Sync] Syncing workout ${workout.id}:`, payload);
              await syncSwimmingData(payload);
              useAppStore.getState().addSyncedWorkoutId(workout.id);
              console.log(`[Sync] Successfully synced workout ${workout.id}`);
            } catch (syncErr) {
              console.warn(`[Sync] Failed to sync workout ${workout.id}:`, syncErr);
            }
          }
        });
      });
    };

    const unsubscribe = navigation.addListener('focus', () => {
      syncHealthData();
    });

    syncHealthData();

    return unsubscribe;
  }, [navigation, isWatchConnected]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 환영 메시지 */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>안녕하세요,</Text>
          <Text style={styles.welcomeSubtitle}>청학동 수달님!</Text>
          <Text style={styles.welcomeMessage}>Time to make a splash!</Text>
        </View>

        {/* 오늘의 수영 기록 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>오늘의 수영 기록</Text>
          <Pressable
            onPress={() => {
              console.log('수영 기록 상세 페이지로 이동');
            }}
          >
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.box}>
          <Text style={styles.todaySwimLabel}>Today's Swim</Text>
          <Text style={styles.todaySwimDistance}>{todayStats.distance}m</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>총 시간</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>{formatDuration(todayStats.duration)}</Text>
              </View>
            </View>
            {/* 첫 번째 구분선 */}
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>평균 페이스</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>{todayStats.pace}</Text>
                <Text style={styles.statValueUnit}>/100m</Text>
              </View>
            </View>
            {/* 두 번째 구분선 */}
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>평균 심박수</Text>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>
                  {todayStats.avgHeartRate > 0 ? todayStats.avgHeartRate : '--'}
                </Text>
                <Text style={styles.statValueUnit}>bpm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 수영 캘린더 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>수영 캘린더</Text>
          <Pressable
            onPress={() => {
              console.log('수영 캘린더 페이지로 이동');
              router.push('/(main)/calendar');
            }}
          >
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.weekDaysRow}>
            {weekLabels.map((day, index) => (
              <Text
                key={index}
                style={[
                  styles.weekDayText,
                  index === 0 && { color: '#EF4444' },
                  index === 6 && { color: '#3B82F6' },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.datesRow}>
            {weekDatesObjects.map((dateObj, index) => {
              const dateVal = dateObj.getDate();
              const dateStr = dateObj.toISOString().split('T')[0];
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              return (
                <View key={index} style={styles.dateColumn}>
                  <View style={[styles.dateNumberContainer, isToday && styles.dateActiveContainer]}>
                    <Text style={[styles.dateText, isToday && styles.dateActiveText]}>
                      {dateVal}
                    </Text>
                  </View>

                  {/* 영법 점 표시 구역 */}
                  <View style={styles.dotContainer}>
                    {swimData[dateStr]?.map((stroke, i) => (
                      <View
                        key={i}
                        style={[styles.dot, { backgroundColor: strokesColor[stroke] || '#E5E7EB' }]}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* 목표 진행률 */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>목표 진행률</Text>
          <Pressable
            onPress={() => {
              console.log('목표 진행률 페이지로 이동');
            }}
          >
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
        <View style={styles.card}>
          <View style={styles.goals}>
            <View style={styles.goalItem}>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalLabel}>주간 목표 달성률</Text>
                <Text style={styles.goalValue}>75%</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressFill} />
              </View>
            </View>
            <View style={styles.goalItem}>
              <View style={styles.goalTextContainer}>
                <Text style={styles.goalLabel}>월간 목표 달성률</Text>
                <Text style={styles.goalValue}>61%</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressFill} />
              </View>
            </View>
          </View>
        </View>

        {/* 배지 현황 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>배지 현황</Text>
            <Pressable
              onPress={() => {
                console.log('배지 현황 페이지로 이동');
              }}
            >
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          </View>
          <View style={styles.badges}>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badges[0].emoji}</Text>
              </View>
              <Text style={styles.badgeLabel}>{badges[0].label}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badges[3].emoji}</Text>
              </View>
              <Text style={styles.badgeLabel}>{badges[3].label}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badges[5].emoji}</Text>
              </View>
              <Text style={styles.badgeLabel}>{badges[5].label}</Text>
            </View>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badges[6].emoji}</Text>
              </View>
              <Text style={styles.badgeLabel}>{badges[6].label}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  welcomeSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 28,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  welcomeSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#6B7280',
  },
  box: {
    borderWidth: 2,
    padding: 12,
    borderColor: '#F3F3F3',
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    paddingVertical: 10,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  arrow: {
    fontSize: 24,
    color: '#111827',
  },
  todaySwimLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  todaySwimDistance: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginVertical: 12,
  },
  statValueUnit: {
    fontSize: 16,
    fontWeight: '300',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 4,
  },
  statItem: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#090909',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E7E7E7',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  weekDayText: {
    fontSize: 12,
    color: '#5D5D5B',
    width: 40,
    textAlign: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  dateColumn: {
    alignItems: 'center',
    width: 36,
  },
  dateNumberContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateActiveContainer: {
    backgroundColor: '#4285EA',
    borderRadius: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#595959',
  },
  dateActiveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
    height: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  goals: {
    gap: 16,
  },
  goalItem: {
    gap: 8,
  },
  goalTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalProgress: {
    width: '100%',
    height: 8,
    backgroundColor: '#F6F6F6',
    borderRadius: 4,
  },
  goalProgressFill: {
    width: '75%',
    height: 8,
    backgroundColor: '#4285EA',
    borderRadius: 4,
  },
  goalLabel: {
    fontSize: 14,
    color: '#5E5E5E',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4285EA',
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  badgeContainer: {
    alignItems: 'center',
    width: '22%',
  },
  badgeItem: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 24,
    marginBottom: 8,
  },
  badgeIcon: {
    fontSize: 32,
  },
  badgeLabel: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: -0.5,
  },
});
