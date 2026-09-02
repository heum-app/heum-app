import POOLS from '@/assets/data/pools.json';
import { Button, EmptyResult } from '@/components';
import { PoolListSkeleton } from '@/features/search';
import { useAlertStore, useBottomSheetStore, useToastStore } from '@/store/commonStore';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function EditSwimRecordScreen() {
  const router = useRouter();
  const { show } = useToastStore();

  // state
  const { swimRecord } = useLocalSearchParams<{ swimRecord: string }>();
  const swimRecordData = swimRecord ? JSON.parse(swimRecord) : null;
  const [pool, setPool] = useState(swimRecordData?.swimPool || '');
  const [startTime, setStartTime] = useState(swimRecordData?.startTime || '');
  const [endTime, setEndTime] = useState(swimRecordData?.endTime || '');
  const [totalTime, setTotalTime] = useState(swimRecordData?.swimTime || '');
  const [pace, setPace] = useState(swimRecordData?.avrgPace || '');
  const [totalDistance, setTotalDistance] = useState(
    swimRecordData?.swimDistance ? String(swimRecordData.swimDistance) : '',
  );
  const [poolLength, setPoolLength] = useState(
    swimRecordData?.poolLength ? String(swimRecordData.poolLength) : '',
  );
  const [heartRate, setHeartRate] = useState(
    swimRecordData?.avrgHeartRate ? String(swimRecordData.avrgHeartRate) : '',
  );
  const [calories, setCalories] = useState(
    swimRecordData?.calories ? String(swimRecordData.calories) : '',
  );
  const [diary, setDiary] = useState(swimRecordData?.swimDiary?.content || '');

  // 영법별 거리
  const [freeDistance, setFreeDistance] = useState(
    swimRecordData?.imRecord?.freeDistance ? String(swimRecordData.imRecord.freeDistance) : '',
  );
  const [backDistance, setBackDistance] = useState(
    swimRecordData?.imRecord?.backDistance ? String(swimRecordData.imRecord.backDistance) : '',
  );
  const [breastDistance, setBreastDistance] = useState(
    swimRecordData?.imRecord?.breastDistance ? String(swimRecordData.imRecord.breastDistance) : '',
  );
  const [flyDistance, setFlyDistance] = useState(
    swimRecordData?.imRecord?.flyDistance ? String(swimRecordData.imRecord.flyDistance) : '',
  );

  // actions
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  /** 수영장 선택 바텀 시트 */
  const handleOpenPoolSearch = () => {
    openBottomSheet(
      <PoolSearchSheet
        onSelect={(selectedPool) => {
          setPool(selectedPool);
          closeBottomSheet();
        }}
      />,
    );
  };

  const isDirty = useMemo(() => {
    return (
      pool !== (swimRecordData?.swimPool || '') ||
      startTime !== (swimRecordData?.startTime || '') ||
      endTime !== (swimRecordData?.endTime || '') ||
      totalTime !== (swimRecordData?.swimTime || '') ||
      pace !== (swimRecordData?.avrgPace || '') ||
      totalDistance !== (swimRecordData?.swimDistance ? String(swimRecordData.swimDistance) : '') ||
      poolLength !== (swimRecordData?.poolLength ? String(swimRecordData.poolLength) : '') ||
      heartRate !== (swimRecordData?.avrgHeartRate ? String(swimRecordData.avrgHeartRate) : '') ||
      calories !== (swimRecordData?.calories ? String(swimRecordData.calories) : '') ||
      diary !== (swimRecordData?.swimDiary?.content || '') ||
      freeDistance !==
        (swimRecordData?.imRecord?.freeDistance
          ? String(swimRecordData.imRecord.freeDistance)
          : '') ||
      backDistance !==
        (swimRecordData?.imRecord?.backDistance
          ? String(swimRecordData.imRecord.backDistance)
          : '') ||
      breastDistance !==
        (swimRecordData?.imRecord?.breastDistance
          ? String(swimRecordData.imRecord.breastDistance)
          : '') ||
      flyDistance !==
        (swimRecordData?.imRecord?.flyDistance ? String(swimRecordData.imRecord.flyDistance) : '')
    );
  }, [
    pool,
    startTime,
    endTime,
    totalTime,
    pace,
    totalDistance,
    poolLength,
    heartRate,
    calories,
    diary,
    freeDistance,
    backDistance,
    breastDistance,
    flyDistance,
    swimRecordData,
  ]);

  const navigation = useNavigation();
  const { open, close } = useAlertStore();
  const isSavedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!isDirty || isSavedRef.current) {
        return;
      }

      e.preventDefault();

      open({
        type: 'warning',
        title: '저장하지 않고 이동할까요?',
        message: '작성 중인 내용이 지워지게 됩니다.',
        confirmText: '이동',
        cancelText: '취소',
        onConfirm: () => {
          close();
          navigation.dispatch(e.data.action);
        },
        onCancel: () => close(),
      });
    });

    return unsubscribe;
  }, [navigation, isDirty, open, close]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <Text style={styles.poolName}>Pool Swim 🏊</Text>
        </View>

        {/* 수영장 선택 */}
        <Pressable style={styles.fullWidthInput} onPress={handleOpenPoolSearch}>
          <Ionicons name="location" size={16} color="#111827" style={{ marginRight: 8 }} />
          {pool ? (
            <Text style={styles.inputText}>{pool}</Text>
          ) : (
            <Text style={[styles.inputText, { color: '#9CA3AF' }]}>수영장 선택</Text>
          )}
        </Pressable>

        {/* 시작 / 종료 시간 */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>시작 시간</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.inputText} value={startTime} onChangeText={setStartTime} />
            </View>
          </View>
          <Text style={styles.tilde}>~</Text>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>종료 시간</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.inputText} value={endTime} onChangeText={setEndTime} />
            </View>
          </View>
        </View>

        {/* 총 시간 / 총 거리 */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={[styles.inputLabel, { color: '#D1D5DB' }]}>총 시간</Text>
            <View style={[styles.inputBox, { backgroundColor: '#F9FAFB' }]}>
              <TextInput
                style={[styles.inputText, { color: '#D1D5DB' }]}
                value={totalTime}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.tildePlaceholder} />
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>총 거리</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={totalDistance}
                onChangeText={setTotalDistance}
              />
            </View>
          </View>
        </View>

        {/* 영법별 거리 */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>자유형 거리</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={freeDistance}
                onChangeText={setFreeDistance}
                placeholder="예: 200m"
              />
            </View>
          </View>
          <View style={styles.tildePlaceholder} />
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>배영 거리</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={backDistance}
                onChangeText={setBackDistance}
                placeholder="예: 100m"
              />
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>평영 거리</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={breastDistance}
                onChangeText={setBreastDistance}
                placeholder="예: 50m"
              />
            </View>
          </View>
          <View style={styles.tildePlaceholder} />
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>접영 거리</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputText}
                value={flyDistance}
                onChangeText={setFlyDistance}
                placeholder="예: 50m"
              />
            </View>
          </View>
        </View>

        {/* 레인 길이 / 페이스 */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>레인 길이</Text>
            <View
              style={[styles.inputBox, { flexDirection: 'row', justifyContent: 'space-between' }]}
            >
              <TextInput
                style={[styles.inputText, { flex: 1 }]}
                value={poolLength}
                onChangeText={setPoolLength}
              />
              <Ionicons name="chevron-down" size={16} color="#4B5563" />
            </View>
          </View>
          <View style={styles.tildePlaceholder} />
          <View style={styles.halfInputContainer}>
            <Text style={[styles.inputLabel, { color: '#D1D5DB' }]}>페이스</Text>
            <View style={[styles.inputBox, { backgroundColor: '#F9FAFB' }]}>
              <TextInput
                style={[styles.inputText, { color: '#D1D5DB' }]}
                value={pace}
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* 평균 심박수 / 평균 칼로리 */}
        <View style={styles.row}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>평균 심박수</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.inputText} value={heartRate} onChangeText={setHeartRate} />
            </View>
          </View>
          <View style={styles.tildePlaceholder} />
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>평균 칼로리</Text>
            <View style={styles.inputBox}>
              <TextInput style={styles.inputText} value={calories} onChangeText={setCalories} />
            </View>
          </View>
        </View>

        {/* 수영 일지 */}
        <View style={styles.diaryContainer}>
          <Text style={styles.inputLabel}>수영 일지</Text>
          <TextInput
            style={styles.diaryInput}
            value={diary}
            onChangeText={setDiary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 안내 메시지 */}
        <Text style={styles.warningText}>수동으로 작성된 기록은 랭킹 집계에서 제외됩니다.</Text>

        {/* 저장 버튼 */}
        <Button
          title="저장하기"
          onPress={() => {
            isSavedRef.current = true;
            // TODO: 저장 로직 추가
            console.log('저장하기 버튼 클릭됨');
            show({
              message: '저장이 완료되었어요',
              duration: 2000,
            });
            router.back();
          }}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface PoolSearchSheetProps {
  onSelect: (poolName: string) => void;
}

function PoolSearchSheet({ onSelect }: PoolSearchSheetProps) {
  const [keyword, setKeyword] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);

  // 검색어 debounce
  useEffect(() => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setDebounced('');
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setDebounced(trimmed);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // POOLS 검색
  useEffect(() => {
    if (!debounced) {
      setSearchList([]);
      setLoading(false);
      return;
    }
    const kw = debounced.toLowerCase();
    const result = POOLS.filter(
      (p) => p.name.toLowerCase().includes(kw) || p.address.toLowerCase().includes(kw),
    );
    setSearchList(result);
    setLoading(false);
  }, [debounced]);

  // 즐겨찾기 추가/삭제
  const onToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favId) => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const hasKeyword = keyword.trim().length > 0;

  // 수영장 리스트
  const displayPools = useMemo(() => {
    if (hasKeyword) {
      return searchList.map((pool) => ({
        ...pool,
        isFavorite: favorites.includes(String(pool.id)),
      }));
    } else {
      // 즐겨찾기만 표시
      return POOLS.filter((pool) => favorites.includes(String(pool.id))).map((pool) => ({
        ...pool,
        isFavorite: true,
      }));
    }
  }, [hasKeyword, searchList, favorites]);

  return (
    <View style={sheetStyles.container}>
      {/* 상단 바 */}
      <View style={sheetStyles.topBarContainer}>
        <View style={sheetStyles.handleBar} />
      </View>

      {/* 제목 */}
      <Text style={sheetStyles.title}>검색</Text>

      {/* 검색창 */}
      <View style={sheetStyles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          style={sheetStyles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {keyword.length > 0 && (
          <Pressable onPress={() => setKeyword('')} style={{ padding: 4 }}>
            <Ionicons name="close-circle" size={18} color="#A3A3A3" />
          </Pressable>
        )}
      </View>

      {/* 검색 결과 */}
      <View style={sheetStyles.resultContainer}>
        {loading ? (
          <PoolListSkeleton />
        ) : hasKeyword && displayPools.length === 0 ? (
          <EmptyResult />
        ) : (
          <BottomSheetFlatList
            data={displayPools}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={sheetStyles.listContent}
            renderItem={({ item }) => (
              <Pressable style={sheetStyles.itemContainer} onPress={() => onSelect(item.name)}>
                <View style={sheetStyles.itemLeft}>
                  <Ionicons name="location-sharp" size={20} color="#000" />
                  <View style={sheetStyles.textContainer}>
                    <Text style={sheetStyles.itemName}>{item.name}</Text>
                    <Text style={sheetStyles.itemAddress}>{item.address}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => onToggleFavorite(String(item.id))}
                  style={sheetStyles.pinButton}
                >
                  <AntDesign
                    name="pushpin"
                    size={20}
                    color={item.isFavorite ? '#000000' : '#E5E7EB'}
                  />
                </Pressable>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  );
}

const sheetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  topBarContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultContainer: {
    flex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  listContent: {
    paddingBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemAddress: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  pinButton: {
    padding: 4,
  },
});

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
  headerBackButton: {
    padding: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  calendarCard: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#F1F1F1',
    alignItems: 'center',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 0,
    marginBottom: 15,
  },
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
  },
  monthText: { fontSize: 16, fontWeight: '600' },
  weekLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    width: '100%',
  },
  weekLabel: { fontSize: 12, color: '#5D5D5B', width: 40, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  dayCell: {
    width: (SCREEN_WIDTH - 43) / 7,
    alignItems: 'center',
    marginBottom: 5,
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
  dot: { width: 8, height: 8, borderRadius: 4 },
  todayBtn: { backgroundColor: '#4285EA', borderRadius: 16 },
  selectedBtn: { borderRadius: 16, backgroundColor: '#4285EA' },
  dateText: { fontSize: 14, color: '#595959' },
  selectedText: { color: 'white', fontWeight: 'bold' },
  todayText: { color: 'white', fontWeight: 'bold' },
  handleBarContainer: { marginTop: 15, height: 4, justifyContent: 'center', alignItems: 'center' },
  handleBar: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },

  formContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContentContainer: {
    padding: 20,
  },
  titleRow: {
    marginBottom: 16,
  },
  poolName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  fullWidthInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  halfInputContainer: {
    flex: 1,
  },
  tilde: {
    fontSize: 16,
    color: '#111827',
    marginHorizontal: 8,
    marginBottom: 14,
  },
  tildePlaceholder: {
    width: 24, // spacing between two inputs if no tilde
  },
  inputLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputText: {
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },
  diaryContainer: {
    marginBottom: 16,
  },
  diaryInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 180,
    fontSize: 15,
    color: '#111827',
  },
  warningText: {
    fontSize: 10,
    color: '#EF4444',
    marginBottom: 16,
    marginTop: -4,
  },
  saveButton: {
    width: '100%',
    borderRadius: 12,
  },
});
