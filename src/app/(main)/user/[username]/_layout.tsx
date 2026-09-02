import { ActionSheet, Header } from '@/components';
import { Profile } from '@/features/my/type';
import { useToastStore } from '@/store/commonStore';

import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { useEffect, useState } from 'react';
import { Pressable, Share } from 'react-native';

export default function UserLayout() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const { show } = useToastStore();

  const DUMMY_PROFILE: Profile = {
    user: {
      id: 1,
      email: 'test@example.com',
      profile: {
        id: 1,
        nickname: '테스트 유저',
        profileImageUrl: 'https://picsum.photos/200',
        bio: '테스트 bio',
      },
    },
    postCount: 12,
    followers: 52,
    following: 34,
    isFollowing: false,
    postIds: [1, 2, 3],
    commentIds: [10, 11, 12],
  };

  /** 사용자 프로필 정보 불러오기 */
  useEffect(() => {
    setProfile(DUMMY_PROFILE);
  }, [userId]);

  /** 프로필 링크 공유 */
  const handleShare = async (nickname: string) => {
    const shareUrl = `heumapp://users/${nickname}`;
    try {
      await Share.share({
        message: shareUrl,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  /** 특정 유저 헤더 오른쪽 버튼 */
  const renderRightItems = () => {
    if (!profile) return [];

    if (userId === String(1)) {
      return [
        <Pressable key="settings" onPress={() => router.replace('/my')}>
          <Ionicons name="settings-outline" size={26} />
        </Pressable>,
      ];
    }

    return [
      <Pressable key="more" onPress={() => setShowActionSheet(true)}>
        <Ionicons name="ellipsis-horizontal" size={26} />
      </Pressable>,
    ];
  };

  return (
    <>
      <Stack>
        {/* 특정 유저 프로필 화면 */}
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerTransparent: true,
            headerShown: true,
            headerBackVisible: true,
            header: ({ navigation }) => (
              <Header
                title=""
                onBack={() => navigation.goBack()}
                rightItems={renderRightItems()}
                bgColor="transparent"
              />
            ),
          }}
        />

        {/* 특정 유저 게시글 화면 */}
        <Stack.Screen
          name="post"
          options={{
            title: '알림 설정',
            headerShown: true,
            header: ({ navigation, options }) => (
              <Header title={options.title} onBack={() => navigation.goBack()} />
            ),
          }}
        />
      </Stack>

      {/* 액션 시트 */}
      {profile && (
        <ActionSheet
          visible={showActionSheet}
          onClose={() => setShowActionSheet(false)}
          actions={[
            {
              label: '프로필 공유하기',
              onPress: () => {
                setShowActionSheet(false);
                setTimeout(() => handleShare(profile.user.profile.nickname), 200);
              },
            },
            {
              label: `피드에서 ${profile.user.profile.nickname} 숨기기`,
              onPress: () =>
                show({
                  message: `전체 게시물이 숨겨졌어요`,
                  undoText: '취소',
                  onUndo: () => console.log('숨김 취소됨'),
                }),
            },
          ]}
        />
      )}
    </>
  );
}
