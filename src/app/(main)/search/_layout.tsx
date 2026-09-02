import { Header, SearchInput } from '@/components';
import { SearchTabs } from '@/features/search';
import { useSearchStore } from '@/store/commonStore';
import { Slot, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

export default function SearchLayout() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { keyword, setKeyword, addRecent } = useSearchStore(
    useShallow((s) => ({
      keyword: s.keyword,
      setKeyword: s.setKeyword,
      addRecent: s.addRecent,
    })),
  );

  /** 확인 눌렀을 때 최근 검색어 목록에 추가 */
  const handleSubmitKeyword = useCallback(() => {
    const current = useSearchStore.getState().keyword;

    if (current.trim()) {
      addRecent(current);
    }
  }, [addRecent]);

  /** 검색 화면을 떠날 때 keyword 초기화 */
  useEffect(() => {
    return () => useSearchStore.getState().setKeyword('');
  }, []);

  return (
    <>
      <Header title="검색" onBack={() => navigation.goBack()} />
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* 검색창 */}
        <SearchInput
          value={keyword}
          onChange={setKeyword}
          onClear={() => setKeyword('')}
          onSubmit={handleSubmitKeyword}
        />

        {/* 상단 탭 */}
        <SearchTabs />

        {/* 각 페이지 영역 */}
        <Slot />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
