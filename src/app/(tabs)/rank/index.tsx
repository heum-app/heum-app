import { Avatar } from '@/components';
import { PodiumTop3 } from '@/features/rank/components/PodiumTop3';
import { SwimRecordRank } from '@/features/rank/components/type';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

const rankingWeekly: SwimRecordRank[] = [
  {
    id: 1,
    totalDistance: 7000,
    totalSeconds: 3600,
    calories: 480,
    averageHeartRate: 120,
    pace: '1\'45"',
    poolLength: 25,
    source: 'auto',
    user: {
      id: 101,
      nickname: '장의동 거북이',
      profileImageUrl: 'https://i.pinimg.com/736x/df/a0/47/dfa0473803e06a8725ee85491b0dc4ad.jpg',
    },
  },
  {
    id: 2,
    totalDistance: 6900,
    totalSeconds: 3540,
    calories: 470,
    averageHeartRate: 118,
    pace: '1\'47"',
    poolLength: 25,
    source: 'auto',
    user: {
      id: 102,
      nickname: '은행동 돌고래',
      profileImageUrl: 'https://i.pinimg.com/736x/1d/c2/e3/1dc2e380a7d0de12a8c12ba74c14a7bf.jpg',
    },
  },
  {
    id: 3,
    totalDistance: 6700,
    totalSeconds: 3520,
    calories: 460,
    averageHeartRate: 116,
    pace: '1\'48"',
    poolLength: 25,
    source: 'auto',
    user: {
      id: 103,
      nickname: '초록마을 물개',
      profileImageUrl: 'https://i.pinimg.com/736x/23/b5/c7/23b5c7d072219559a686e2ec09b748ac.jpg',
    },
  },
  {
    id: 4,
    totalDistance: 6680,
    totalSeconds: 3500,
    calories: 450,
    averageHeartRate: 115,
    pace: '1\'49"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 104,
      nickname: '사용자_1',
      profileImageUrl: null,
    },
  },
  {
    id: 5,
    totalDistance: 6200,
    totalSeconds: 3400,
    calories: 430,
    averageHeartRate: 112,
    pace: '1\'52"',
    poolLength: 25,
    source: 'auto',
    user: {
      id: 1234,
      nickname: '청학동 수달',
      profileImageUrl: 'https://i.pinimg.com/1200x/31/9b/21/319b21b0bcaacf7bb8a8307998c3a46e.jpg',
    },
  },
  {
    id: 6,
    totalDistance: 6020,
    totalSeconds: 3300,
    calories: 420,
    averageHeartRate: 110,
    pace: '1\'55"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 106,
      nickname: '사용자_2',
      profileImageUrl: null,
    },
  },
  {
    id: 7,
    totalDistance: 6000,
    totalSeconds: 3280,
    calories: 415,
    averageHeartRate: 109,
    pace: '1\'56"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 107,
      nickname: '사용자_3',
      profileImageUrl: null,
    },
  },
  {
    id: 8,
    totalDistance: 6000,
    totalSeconds: 3280,
    calories: 415,
    averageHeartRate: 109,
    pace: '1\'56"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 107,
      nickname: '사용자_3',
      profileImageUrl: null,
    },
  },
  {
    id: 9,
    totalDistance: 6000,
    totalSeconds: 3280,
    calories: 415,
    averageHeartRate: 109,
    pace: '1\'56"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 107,
      nickname: '사용자_3',
      profileImageUrl: null,
    },
  },
  {
    id: 10,
    totalDistance: 6000,
    totalSeconds: 3280,
    calories: 415,
    averageHeartRate: 109,
    pace: '1\'56"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 107,
      nickname: '사용자_3',
      profileImageUrl: null,
    },
  },
  {
    id: 11,
    totalDistance: 6000,
    totalSeconds: 3280,
    calories: 415,
    averageHeartRate: 109,
    pace: '1\'56"',
    poolLength: 25,
    source: 'manual',
    user: {
      id: 107,
      nickname: '사용자_3',
      profileImageUrl: null,
    },
  },
];

export default function WeeklyRankScreen() {
  const [isLoading, setIsLoading] = useState(true);

  const top3 = rankingWeekly.slice(0, 3);
  const rest = rankingWeekly.slice(3);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1400);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TOP 3 */}
      <View style={styles.topWrapper}>
        <PodiumTop3 users={top3} />
      </View>

      {/* 리스트 */}
      <ScrollView style={styles.listWrapper} showsVerticalScrollIndicator={false}>
        {rest.map((record, idx) => (
          <View
            key={record.id}
            style={[
              styles.row,
              { backgroundColor: record.user.id === 1234 ? '#F0F7FD' : 'transparents' },
            ]}
          >
            <Text style={styles.rank}>{idx + 4}</Text>

            <View style={styles.avatarWrapper}>
              {record.user.profileImageUrl ? (
                <Avatar src={record.user.profileImageUrl} size="sm" />
              ) : (
                <Avatar
                  src="https://i.pinimg.com/736x/79/e8/9f/79e89fdc173fed118526a1d32e1aac61.jpg"
                  size="sm"
                />
              )}
            </View>

            {/* 닉네임 */}
            <Text style={styles.rowName}>{record.user.nickname}</Text>

            {/* 거리 */}
            <Text style={styles.rowDistance}>{record.totalDistance}m</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4285EA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#4285EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  listWrapper: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rank: { width: 36, textAlign: 'left', fontWeight: '700' },
  avatarWrapper: {
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowName: { flex: 1, color: '#333', marginLeft: 4 },
  rowDistance: { fontWeight: '700', color: '#333' },
});
