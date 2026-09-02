import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { User } from '../type';

export const UserListItem = React.memo(
  function UserListItem({ user }: { user: User }) {
    const router = useRouter();

    /** 팔로우 수락 핸들러 */
    const handleAcceptFollow = () => {};
    /** 팔로우 거절 핸들러 */
    const handleRejectFollow = () => {};
    /** 팔로우 요청 핸들러 */
    const handleRequestFollow = () => {};
    /** 팔로우 취소 핸들러 */
    const handleCancelFollow = () => {};

    return (
      <Pressable
        style={styles.container}
        onPress={() =>
          router.push({
            pathname: '/user/[username]',
            params: { username: user.nickname, userId: user.id },
          })
        }
      >
        {/* 프로필 이미지 */}
        <Image source={{ uri: user.profileImageUrl }} style={styles.avatar} />

        {/* 텍스트 영역 */}
        <View style={styles.infoBox}>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.bio}>{user.bio || '소개글이 없습니다.'}</Text>
        </View>

        {/* 버튼 영역 */}
        {user.isRequestedToMe ? (
          // 1. 상대가 나에게 요청함 -> 수락/거절
          <View style={{ flexDirection: 'row' }}>
            <Pressable
              style={[styles.outlilnButton, { marginRight: 5 }]}
              onPress={handleRejectFollow}
            >
              <Text style={styles.outlineButtonText}>거절</Text>
            </Pressable>

            <Pressable style={styles.filledButton} onPress={handleAcceptFollow}>
              <Text style={styles.filledButtonText}>수락</Text>
            </Pressable>
          </View>
        ) : user.isRequestedByMe ? (
          // 2. 내가 보낸 요청 -> 요청됨
          <Pressable style={styles.outlilnButton} onPress={handleCancelFollow}>
            <Text style={styles.outlineButtonText}>요청중</Text>
          </Pressable>
        ) : user.isFollowing ? (
          // 3. 이미 팔로우 상태
          <Pressable style={styles.outlilnButton} onPress={handleRequestFollow}>
            <Text style={styles.outlineButtonText}>팔로잉</Text>
          </Pressable>
        ) : (
          // 4. 아무 관계 없음 -> 팔로우
          <Pressable style={styles.filledButton} onPress={handleRequestFollow}>
            <Text style={styles.filledButtonText}>팔로우</Text>
          </Pressable>
        )}
      </Pressable>
    );
  },
  (prev, next) => prev.user.id === next.user.id,
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 50,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  infoBox: {
    flex: 1,
  },
  nickname: {
    fontSize: 15,
    fontWeight: '600',
  },
  bio: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  filledButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: '#4285EA',
  },
  filledButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  outlilnButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4285EA',
  },
  outlineButtonText: {
    color: '#4285EA',
    fontWeight: '600',
    fontSize: 13,
  },
});
