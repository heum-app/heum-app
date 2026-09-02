import { ActionSheet } from '@/components';
import { useAlertStore, useToastStore } from '@/store/commonStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SwimmingRecordResponse } from '../../../api/types/swimming.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 더미 데이터
const swimRecords: { [key: string]: SwimmingRecordResponse } = {
  '2026-04-14': {
    id: 1,
    swimDate: '2026-04-14',
    swimDistance: 500,
    swimTime: '00:30:00',
    startTime: '오전 08:00',
    endTime: '오전 08:30',
    calories: 90,
    poolLength: 25,
    avrgPace: '2:40',
    avrgHeartRate: 130,
    swimPool: '용암 체육센터',
    imRecord: { freeDistance: 300, backDistance: 200 },
    swimDiary: {
      content:
        '오늘은 배영을 집중적으로 연습했다. 특히 발차기 동작을 개선하려고 노력했는데, 생각보다 쉽지 않았다. 그래도 코치님께서 잘하고 있다고 격려해주셔서 힘이 났다. 다음 주에는 접영을 시작할 예정이다. 기대된다!',
    },
  },
  '2026-04-17': {
    id: 2,
    swimDate: '2026-04-17',
    swimDistance: 700,
    swimTime: '00:46:25',
    startTime: '오전 09:00',
    endTime: '오전 09:55',
    calories: 120,
    poolLength: 25,
    avrgPace: '2:27',
    avrgHeartRate: 139,
    swimPool: '용암 체육센터',
    imRecord: { flyDistance: 100, backDistance: 200, freeDistance: 400 },
    swimDiary: {
      content:
        '오늘은 배영을 집중적으로 연습했다. 특히 발차기 동작을 개선하려고 노력했는데, 생각보다 쉽지 않았다. 그래도 코치님께서 잘하고 있다고 격려해주셔서 힘이 났다. 다음 주에는 접영을 시작할 예정이다. 기대된다!',
    },
  },
  '2026-04-29': {
    id: 3,
    swimDate: '2026-04-29',
    swimDistance: 1000,
    swimTime: '00:46:25',
    startTime: '오전 09:00',
    endTime: '오전 09:55',
    calories: 120,
    poolLength: 25,
    avrgPace: '2:27',
    avrgHeartRate: 139,
    swimPool: '용암 체육센터',
    imRecord: { flyDistance: 100, backDistance: 200, freeDistance: 400, breastDistance: 300 },
    swimDiary: {
      content:
        '오늘은 배영을 집중적으로 연습했다. 특히 발차기 동작을 개선하려고 노력했는데, 생각보다 쉽지 않았다. 그래도 코치님께서 잘하고 있다고 격려해주셔서 힘이 났다. 다음 주에는 접영을 시작할 예정이다. 기대된다!',
    },
  },
};

const STROKE_COLORS: { [key: string]: string } = {
  fly: '#C6DCFF', // 접영
  free: '#FFF6B6', // 자유형
  back: '#ADF0C7', // 배영
  breast: '#DEDAFF', // 평영
};

export default function SwimCalendarScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false); // 상세 기록 확장 여부
  const [animatedHeight] = useState(new Animated.Value(400)); // 적절한 월간 높이
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showActionSheet, setShowActionSheet] = useState(false);

  const { show } = useToastStore();
  const { open, close } = useAlertStore();

  // 오늘 정보
  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  // 선택한 날짜의 요일 계산
  const selectedFullDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    selectedDate,
  );
  const formattedSelectedDate = `${selectedFullDate.getFullYear()}-${String(selectedFullDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
  const dayOfWeek = selectedFullDate
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();

  const weekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // 영법별 점 컬러 매핑
  const strokeColors: { [key: string]: string } = {
    free: '#FFF6B6',
    back: '#ADF0C7',
    breast: '#DEDAFF',
    fly: '#C6DCFF',
  };

  // 선택한 날짜의 기록
  const currentRecord = swimRecords[formattedSelectedDate];

  /** 해당 날짜의 영법 점 */
  const getDotsForDate = (dateNum: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
    const record = swimRecords[dateStr];
    if (!record || !record.imRecord) return [];

    const dots = [];
    if (record.imRecord.freeDistance) dots.push(strokeColors.free);
    if (record.imRecord.backDistance) dots.push(strokeColors.back);
    if (record.imRecord.breastDistance) dots.push(strokeColors.breast);
    if (record.imRecord.flyDistance) dots.push(strokeColors.fly);
    return dots;
  };

  /** 월 변경 */
  const changeMonth = (offset: number) => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    if (nextMonth > today) return;
    setCurrentDate(nextMonth);
  };

  /** 달력 생성 */
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendar();

  /** 선택된 날짜가 포함된 주차의 인덱스 범위 계산 */
  const getSelectedWeekRange = () => {
    const selectedIndex = calendarDays.findIndex((d) => d === selectedDate);
    if (selectedIndex === -1) return { start: 0, end: 6 };

    const start = Math.floor(selectedIndex / 7) * 7;
    const end = start + 6;
    return { start, end };
  };

  const { start: weekStart, end: weekEnd } = getSelectedWeekRange();

  /** 달력 접기/펴기 */
  const toggleCalendar = (targetState: boolean) => {
    setIsExpanded(targetState);
    Animated.spring(animatedHeight, {
      toValue: targetState ? 160 : 400, // 축소/확장 높이
      friction: 8,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  /** 게시물 옵션 메뉴 */
  const actionSheetActions = useMemo(() => {
    return [
      {
        label: '기록 수정',
        onPress: () => {
          setShowActionSheet(false);

          open({
            type: 'warning',
            title: '기록을 수정할까요?',
            message: '수동으로 작성된 기록은 랭킹 집계에서 제외됩니다.',
            confirmText: '수정',
            cancelText: '취소',

            onConfirm: () => {
              close();
              router.push({
                pathname: '/(main)/calendar/edit',
                // 기존 데이터 전달
                params: { date: formattedSelectedDate, swimRecord: JSON.stringify(currentRecord) },
              });
            },
            onCancel: () => close(),
          });
        },
      },
      {
        label: '기록 추가',
        onPress: () => {
          setShowActionSheet(false);
          console.log('추가하기');
        },
      },
      {
        label: '기록 삭제',
        destructive: true,
        onPress: () => {
          setShowActionSheet(false);

          open({
            type: 'warning',
            title: '기록을 삭제할까요?',
            message: '삭제한 기록은 되돌릴 수 없어요.',
            confirmText: '삭제',
            cancelText: '취소',

            onConfirm: () => {
              console.log('삭제 요청');
              close();

              show({
                message: '기록이 삭제되었어요',
                duration: 2000,
              });
            },
            onCancel: () => close(),
          });
        },
      },
    ];
  }, []);

  // 제스처 감지
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 수직 이동 거리가 5 이상일 때 제스처 시작
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          // 위로 밀었을 때 -> 접기
          toggleCalendar(true);
        } else if (gestureState.dy > 50) {
          // 아래로 당겼을 때 -> 펴기
          toggleCalendar(false);
        }
      },
    }),
  ).current;

  return (
    <>
      <View style={[styles.container, isExpanded && { backgroundColor: 'white' }]}>
        {/* 캘린더 카드 영역 */}
        <Animated.View
          style={[styles.calendarCard, { height: animatedHeight }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.monthSelector}>
            <Pressable onPress={() => changeMonth(-1)} style={styles.iconBox}>
              <Ionicons name="chevron-back" size={14} color="#111827" />
            </Pressable>
            <Text style={styles.monthText}>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </Text>
            <Pressable
              onPress={() => changeMonth(1)}
              disabled={isCurrentMonth} //
              style={styles.iconBox}
            >
              <Ionicons
                name="chevron-forward"
                size={14}
                color={isCurrentMonth ? '#E5E7EB' : '#111827'}
              />
            </Pressable>
          </View>

          {/* 요일 라벨 */}
          <View style={styles.weekLabelsRow}>
            {weekLabels.map((label, i) => (
              <Text
                key={i}
                style={[
                  styles.weekLabel,
                  i === 0 && { color: '#EF4444' },
                  i === 6 && { color: '#3B82F6' },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.daysGrid}>
            {calendarDays.map((date, i) => {
              const dateValue = date as number;
              const isDateToday = dateValue === today.getDate() && isCurrentMonth;
              const isSelected = dateValue === selectedDate;

              if (isExpanded && (i < weekStart || i > weekEnd)) return null;

              return (
                <Pressable
                  key={i}
                  style={styles.dayCell}
                  onPress={() => dateValue && setSelectedDate(dateValue)}
                >
                  {dateValue && (
                    <>
                      <View
                        style={[
                          styles.dateNumBtn,
                          isSelected && isDateToday && styles.todayBtn,
                          isSelected && !isDateToday && styles.selectedBtn,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateText,
                            isSelected && isDateToday && styles.todayText,
                            isSelected && !isDateToday && styles.selectedText,
                          ]}
                        >
                          {dateValue}
                        </Text>
                      </View>
                      <View style={styles.dotRow}>
                        {getDotsForDate(dateValue).map((color, idx) => (
                          <View key={idx} style={[styles.dot, { backgroundColor: color }]} />
                        ))}
                      </View>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.handleBarContainer} onPress={() => toggleCalendar(!isExpanded)}>
            <View style={styles.handleBar} />
          </Pressable>
        </Animated.View>

        {/* 수영 기록 카드 섹션 */}
        <ScrollView
          style={[
            styles.recordSection,
            isExpanded && { backgroundColor: 'white', padding: 10 }, // 상세 모드 시 배경 화이트
          ]}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {!isExpanded && (
            <View style={styles.dateRow}>
              <Text style={styles.selectedDateTitle}>{selectedDate}</Text>
              <Text style={styles.selectedDayLabel}>{dayOfWeek}</Text>
            </View>
          )}
          {currentRecord ? (
            <Pressable
              style={[styles.swimRecordCard, isExpanded && styles.expandedCardShadow]}
              onPress={() => toggleCalendar(true)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.blueIndicator} />
                <View>
                  <View style={styles.headerInfo}>
                    <Text style={styles.poolName}>Pool Swim 🏊</Text>
                    {/* 2. 옵션 메뉴 버튼 */}
                    {isExpanded && (
                      <Pressable
                        style={styles.optionButton}
                        onPress={() => {
                          setShowActionSheet(true);
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
                      </Pressable>
                    )}
                  </View>
                  <Text style={styles.poolLocation}>
                    <Ionicons name="location" size={12} color="#6B7280" /> {currentRecord.swimPool}
                  </Text>
                  <Text style={styles.poolTime}>
                    {currentRecord.startTime} ~ {currentRecord.endTime}
                  </Text>
                </View>
              </View>

              {isExpanded ? (
                <View style={styles.expandedContent}>
                  {/* 3. 영법 비율 바 */}
                  <View style={styles.strokeBarContainer}>
                    {Object.entries(currentRecord.imRecord).map(([key, distance]) => {
                      const strokeKey = key.replace('Distance', '') as keyof typeof STROKE_COLORS;
                      const widthPercent = (distance / currentRecord.swimDistance) * 100;
                      if (!distance) return null;

                      return (
                        <View
                          key={key}
                          style={{
                            width: `${widthPercent}%`,
                            height: 12,
                            backgroundColor: STROKE_COLORS[strokeKey],
                            borderRadius: 4,
                            marginRight: 2,
                          }}
                        />
                      );
                    })}
                  </View>
                  {/* 영법 라벨 표시 */}
                  <View style={styles.strokeLabelRow}>
                    {Object.entries(currentRecord.imRecord).map(([key, distance]) => {
                      if (!distance) return null;
                      const labelMap: { [key: string]: string } = {
                        freeDistance: '자유형',
                        backDistance: '배영',
                        flyDistance: '접영',
                        breastDistance: '평영',
                      };
                      const strokeKey = key.replace('Distance', '') as keyof typeof STROKE_COLORS;
                      return (
                        <View key={key} style={styles.labelItem}>
                          <View
                            style={[styles.labelDot, { backgroundColor: STROKE_COLORS[strokeKey] }]}
                          />
                          <Text style={styles.labelText}>{labelMap[key]}</Text>
                        </View>
                      );
                    })}
                  </View>
                  <View style={styles.chartPlaceholder}>
                    <Text style={{ color: '#9CA3AF' }}>페이스 분석 차트 영역</Text>
                  </View>
                  <View style={styles.detailList}>
                    <DetailRow label="총 거리" value={`${currentRecord.swimDistance}m`} />
                    <DetailRow label="총 시간" value={currentRecord.swimTime} />
                    <DetailRow label="평균 페이스" value={`${currentRecord.avrgPace}/100m`} />
                    <DetailRow label="평균 심박수" value={`${currentRecord.avrgHeartRate}bpm`} />
                    <DetailRow label="소비 칼로리" value={`${currentRecord.calories}kcal`} />
                  </View>
                  <View style={styles.swimDiary}>
                    <Text style={styles.swimDiaryContent}>{currentRecord.swimDiary.content}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.miniStatsRow}>
                  <MiniStat label="총 거리" value={`${currentRecord.swimDistance}m`} />
                  <MiniStat label="총 시간" value={currentRecord.swimTime} />
                  <MiniStat label="평균 페이스" value={`${currentRecord.avrgPace}/100m`} />
                  <MiniStat label="평균 심박수" value={`${currentRecord.avrgHeartRate}bpm`} />
                  <MiniStat label="소비 칼로리" value={`${currentRecord.calories}kcal`} />
                </View>
              )}
            </Pressable>
          ) : (
            <View style={styles.noDataBox}>
              <Text style={styles.noDataText}>기록된 수영 데이터가 없습니다.</Text>
            </View>
          )}
        </ScrollView>

        {!isExpanded && (
          <Pressable style={styles.fab}>
            <Ionicons name="add" size={32} color="white" />
          </Pressable>
        )}
      </View>

      {/* 액션 시트 */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={actionSheetActions}
      />
    </>
  );
}

// 하위 컴포넌트
const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.miniStatItem}>
    <Text style={styles.miniStatLabel}>{label}</Text>
    <Text style={styles.miniStatValue}>{value}</Text>
  </View>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  calendarCard: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#F1F1F1',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 15,
    marginBottom: 20,
  },
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
  },
  monthText: { fontSize: 16, fontWeight: 'semibold' },
  weekLabelsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  weekLabel: { fontSize: 12, color: '#5D5D5B', width: 40, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: (SCREEN_WIDTH - 43) / 7,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  dateNumBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
    height: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  todayBtn: { backgroundColor: '#4285EA', borderRadius: 16 },
  selectedBtn: {
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
  },
  dateText: { fontSize: 14, color: '#595959' },
  selectedText: {
    color: '#4285EA',
    fontWeight: 'bold',
  },
  todayText: { color: 'white', fontWeight: 'bold' },
  handleBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },

  recordSection: { flex: 1, padding: 16 },
  contentContainerStyle: {
    paddingBottom: 20,
  },
  dateRow: { paddingVertical: 10, paddingHorizontal: 4 },
  selectedDateTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  selectedDayLabel: { fontSize: 12, color: '#1A1A1A' },
  swimRecordCard: { backgroundColor: 'white', borderRadius: 24, padding: 20 },
  expandedCardShadow: {
    elevation: 0,
    borderWidth: 0,
  },
  cardTopRow: { flexDirection: 'row', gap: 12 },
  headerInfo: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blueIndicator: { width: 4, backgroundColor: '#3B82F6', borderRadius: 2 },
  poolName: { fontSize: 16, fontWeight: 'bold' },
  poolLocation: { fontSize: 12, color: '#6B7280', marginVertical: 4 },
  poolTime: { fontSize: 12, color: '#9CA3AF' },

  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  miniStatItem: { alignItems: 'center' },
  miniStatLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  miniStatValue: { fontSize: 14, fontWeight: 'bold' },

  expandedContent: { marginTop: 10 },
  strokeBarContainer: {
    flexDirection: 'row',
    height: 12,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginTop: 20,
    overflow: 'hidden',
  },
  strokeLabelRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 10,
  },
  optionButton: {
    padding: 4,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  detailList: { gap: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  swimDiary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    elevation: 1,
    marginTop: 20,
  },
  swimDiaryContent: {
    fontSize: 14,
    color: '#030303',
    lineHeight: 20,
  },
  detailLabel: { color: '#6B7280' },
  detailValue: { fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    right: 25,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  noDataBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 40,
    elevation: 1,
  },
  noDataText: { color: '#9CA3AF' },
});
