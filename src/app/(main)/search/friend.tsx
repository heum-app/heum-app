import { EmptyResult } from '@/components';
import { RecentSearchList, UserListItem, UserListSkeleton } from '@/features/search';
import { useSearchStore } from '@/store/commonStore';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SearchFriend() {
  const keyword = useSearchStore((s) => s.keyword);

  const [debounced, setDebounced] = useState(keyword);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  /** Debounce */
  useEffect(() => {
    const trimmed = keyword.trim();

    // keyword가 비었으면 -> 로딩 초기화
    if (!trimmed) {
      setLoading(false);
      setDebounced('');
      return;
    }

    // keyword가 존재하면 -> 검색 시작을 위한 로딩 true
    setLoading(true);

    // debounce 시작
    const timer = setTimeout(() => {
      setDebounced(trimmed);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  /** 사용자 (친구) 검색 API */
  useEffect(() => {
    if (!debounced.trim()) {
      setUsers([]);
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/users?keyword=${debounced}&following=true`);
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        console.error('검색 오류: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debounced]);

  /** 검색어 없음 -> 최근 검색 기록 표시 */
  if (!keyword.trim()) return <RecentSearchList />;

  /** 검색 중 -> 스켈레톤 표사 */
  if (loading) return <UserListSkeleton />;

  /** 검색어 있는데 결과 없음 -> 검색 결과 없음 표시 */
  if (!loading && users.length === 0) return <EmptyResult />;

  /** 검색 결과 */
  return (
    <View style={styles.container}>
      <FlashList
        data={users}
        renderItem={({ item }) => <UserListItem user={item} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
});
