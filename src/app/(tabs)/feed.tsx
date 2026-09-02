import { ActionSheet } from '@/components';
import { FloatingButton } from '@/components/common/FloatingButton';
import { PostCard } from '@/features/feed/components/PostCard';
import { PostData } from '@/features/feed/type';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export const mockPosts: PostData[] = [
  {
    id: 1,
    content: '오늘도 수영 열심히! 🏊‍♀️\n50m × 20 세트 성공했다!',
    imageUrls: [
      'https://picsum.photos/seed/swim1/600/400',
      'https://picsum.photos/seed/swim2/600/400',
    ],
    likes: 12,
    isLiked: false,
    visibility: 'friends',
    createdAt: '2025-01-01T09:00:00',
    updatedAt: '2025-01-01T09:00:00',
    comments: [
      {
        id: 101,
        content: '대박… 진짜 열심히 한다 👍',
        createdAt: '2025-01-01T09:30:00',
        user: {
          id: 201,
          email: 'friend1@example.com',
          nickname: '주희',
          profileImageUrl: 'https://picsum.photos/seed/joo/200',
        },
      },
    ],
    user: {
      id: 1,
      email: 'jinhee@example.com',
      nickname: '진희',
      profileImageUrl: 'https://picsum.photos/seed/jin/200',
    },
  },

  {
    id: 2,
    content: '처음으로 1km 끊음 🏅\n기록 갱신해서 기분 최고!',
    imageUrls: [],
    likes: 30,
    isLiked: true,
    visibility: 'friends',
    createdAt: '2025-01-02T12:00:00',
    updatedAt: '2025-01-02T12:00:00',
    comments: [
      {
        id: 102,
        content: '와 진짜 대단하다…🔥',
        createdAt: '2025-01-02T12:10:00',
        user: {
          id: 202,
          email: 'friend2@example.com',
          nickname: '민서',
          profileImageUrl: 'https://picsum.photos/seed/min/200',
        },
      },
      {
        id: 103,
        content: '나도 분발해야겠다 😭',
        createdAt: '2025-01-02T12:20:00',
        user: {
          id: 203,
          email: 'friend3@example.com',
          nickname: '홍주',
          profileImageUrl: 'https://picsum.photos/seed/hong/200',
        },
      },
    ],
    user: {
      id: 2,
      email: 'junhee@example.com',
      nickname: '준희',
      profileImageUrl: 'https://picsum.photos/seed/jun/200',
    },
  },

  {
    id: 3,
    content: '오늘은 가볍게 스트레칭만 했어요 😊',
    imageUrls: ['https://picsum.photos/seed/swim3/600/400'],
    likes: 4,
    isLiked: false,
    visibility: 'private',
    createdAt: '2025-01-03T08:20:00',
    updatedAt: '2025-01-03T08:20:00',
    comments: [],
    user: {
      id: 1,
      email: 'jinhee@example.com',
      nickname: '진희',
      profileImageUrl: 'https://picsum.photos/seed/jin/200',
    },
  },
];

export const PAGE_SIZE = 2;

function getMockPosts(cursor?: number): PostData[] {
  if (!cursor) {
    // 첫 페이지
    return mockPosts.slice(0, PAGE_SIZE);
  }

  const index = mockPosts.findIndex((p) => p.id === cursor);
  if (index === -1) return [];

  return mockPosts.slice(index + 1, index + 1 + PAGE_SIZE);
}

export default function FeedScreen() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const router = useRouter();

  /** 게시글 목록 불러오기 */
  useEffect(() => {
    const firstPage = getMockPosts();
    setPosts(firstPage);
  }, []);

  /** 로드된 데이터 마지막 인덱스가 되면, 다시 데이터 호출 */
  // const onEndReached = useCallback(async () => {
  //   try {
  //     const cursor = posts.at(-1)?.id;
  //     const res = await fetch(`/posts?cursor=${cursor}`);
  //     const data = await res.json();

  //     if (!data.posts.length) {
  //       return;
  //     }

  //     setPosts((prev) => [...prev, ...data.posts]);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     console.log('onEndReached 요청 완료');
  //   }
  // }, [posts]);

  const onEndReached = useCallback(() => {
    try {
      const cursor = posts.at(-1)?.id;
      const next = getMockPosts(cursor);

      if (!next.length) return;

      setPosts((prev) => [...prev, ...next]);
    } catch (err) {
      console.error('err:', err);
    } finally {
      console.log('onEndReached 요청 완료 (dummy)');
    }
  }, [posts]);

  /** 새로고침 */
  // const onRefresh = async () => {
  //   try {
  //     setRefreshing(true);
  //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //     const res = await fetch('/posts');
  //     const data = await res.json();
  //     setPosts(data.posts);
  //   } catch (err) {
  //     console.error('err: ', err);
  //   } finally {
  //     setRefreshing(false);
  //     console.log('onRefresh 요청 완료');
  //   }
  // };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const firstPage = getMockPosts();
      setPosts(firstPage);
    } catch (err) {
      console.error('err:', err);
    } finally {
      setRefreshing(false);
      console.log('onRefresh 완료 (dummy)');
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={posts}
        onEndReached={onEndReached}
        renderItem={({ item }) => <PostCard item={item} />}
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
      <FloatingButton onPress={() => setShowActionSheet(true)} />

      {/* 액션 시트 */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={[
          {
            label: '기록 공유',
            onPress: () => router.navigate('/post'),
          },
          {
            label: '목표 달성률 공유',
            onPress: () => router.navigate('/post/progress'),
          },
          {
            label: '배지 공유',
            onPress: () => router.navigate('/post/badge'),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
});
