import { Button } from '@/components';
import { Profile } from '@/features/my/type';
import { useUserInfoQuery } from '@/hooks/queries/user.queries';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function UserProfilePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { username, userId } = useLocalSearchParams<{ username: string; userId: string }>();

  const [profile, setProfile] = useState<Profile>(null);

  const { data, isLoading, error } = useUserInfoQuery();

  /** 사용자 프로필 정보 불러오기 */
  useEffect(() => {
    if (!data) return; // 1. data 로딩 전이면 아무것도 안 함

    const profileData: Profile = {
      user: {
        id: data.id,
        email: data.email,
        profile: data.profile,
      },
      postCount: 12,
      followers: 52,
      following: 34,
      isFollowing: false,
      postIds: [1, 2, 3],
      commentIds: [10, 11, 12],
    };

    setProfile(profileData); // 2. profile 설정

    console.log('data.profile', data.profile);
  }, [data]); // 4. data 변경될 때만 실행

  /** 팔로우 신청/취소 */
  const handleToggleFollow = () => {
    if (profile.isFollowing) {
      console.log('언팔로우 요청');
      setProfile((prev) => ({ ...prev, isFollowing: false }));
    } else {
      console.log('팔로우 요청');
      setProfile((prev) => ({ ...prev, isFollowing: true }));
    }
  };

  if (isLoading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {/* 프로필 이미지 */}
        <Image
          source={{ uri: data.profile.profileImageUrl.replace(/^http:/, 'https:') }}
          style={styles.backgroundImage}
        />

        {/* 카드 전체가 스크롤되는 영역 */}
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          {/* 흰색 카드 */}
          <View style={styles.card}>
            {/* 상단 둥근 바 영역 */}
            <View style={styles.topBarContainer}>
              <View style={styles.handleBar} />
            </View>

            <Text style={styles.name}>{data.profile.nickname}</Text>
            <Text style={styles.nickname}>{data.email}</Text>

            <View style={styles.statsContainer}>
              <Pressable
                style={styles.statBox}
                onPress={() =>
                  router.push({
                    pathname: '/user/[username]/post',
                    params: { username: data.profile.nickname, userId: data.id },
                  })
                }
              >
                <Text style={styles.statNumber}>{profile.postCount}</Text>
                <Text style={styles.statLabel}>게시물</Text>
              </Pressable>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>팔로워</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>팔로잉</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 하단 고정 버튼 */}

        <View style={[styles.bottomFixed, { bottom: insets.bottom }]}>
          {userId === String(profile.user.id) ? (
            <Button
              title="프로필 편집"
              variant="outline"
              onPress={() => console.log('사용자 프로필 편집 페이지로 이동')}
            />
          ) : (
            <Button
              title={profile.isFollowing ? '팔로잉' : '팔로우'}
              variant={profile.isFollowing ? 'outline' : 'filled'}
              onPress={handleToggleFollow}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '80%',
  },
  scrollArea: {
    flex: 1,
    marginTop: '60%', // 여기서 카드가 시작됨 (원하면 조절)
  },
  card: {
    backgroundColor: '#FFF',
    marginTop: '60%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: '100%', // 카드가 전체 화면을 덮도록
  },
  topBarContainer: {
    alignItems: 'center',
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  name: {
    paddingTop: 16,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nickname: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 130,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { marginTop: 3, fontSize: 14, color: '#777' },
  bottomFixed: {
    position: 'absolute',
    left: 20,
    right: 20,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#4285EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
