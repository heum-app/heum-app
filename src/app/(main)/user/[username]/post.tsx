import { PostCard } from '@/features/feed/components/PostCard';
import { PostData } from '@/features/feed/type';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function UserFeedScreen() {
  const { username, userId } = useLocalSearchParams<{ username: string; userId: string }>();

  const [posts, setPosts] = useState<PostData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /** 사용자 게시글 목록 불러오기 */
  useEffect(() => {
    const fetchUserPosts = async () => {
      const res = await fetch(`/users/${userId}/posts`);
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchUserPosts();
  }, [userId]);

  /** 새로고침 */
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await fetch(`/users/${userId}/posts`);
      const data = await res.json();
      setPosts(data.posts);
    } catch (err) {
      console.error('err: ', err);
    } finally {
      setRefreshing(false);
      console.log('onRefresh 요청 완료');
    }
  };

  /** 로드된 데이터 마지막 인덱스가 되면, 다시 데이터 호출 */
  const onEndReached = useCallback(async () => {
    try {
      const cursor = posts.at(-1)?.id;
      const res = await fetch(`/users/${userId}/posts?cursor=${cursor}`);
      const data = await res.json();

      if (!data.posts.length) {
        return;
      }
      setPosts((prev) => [...prev, ...data.posts]);
    } catch (err) {
      console.error(err);
    } finally {
      console.log('onEndReached 요청 완료');
    }
  }, [posts]);

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        onEndReached={onEndReached}
        renderItem={({ item }) => <PostCard item={item} disableProfileLink />}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9CA3AF" />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  loadingContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
});
