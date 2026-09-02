import { Avatar, Card } from '@/components';
import { ActionSheet } from '@/components/common/ActionSheet';
import { useAlertStore, useToastStore } from '@/store/commonStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { PostData } from '../type';

export const PostCard = React.memo(function PostCard({
  item,
  disableProfileLink = false,
}: {
  item: PostData;
  disableProfileLink?: boolean;
}) {
  const router = useRouter();

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [liked, setLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.likes);

  const { show } = useToastStore();
  const { open, close } = useAlertStore();

  /** 작성 시간 계산 */
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return date.toLocaleDateString('ko-KR');
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}달 전`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}일 전`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}시간 전`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}분 전`;
    return '방금 전';
  };

  /** 링크 공유 핸들러 */
  const handleShareLink = async (username: string, postId: string) => {
    const shareUrl = `heumapp://users/${username}/posts/${postId}`;
    try {
      await Share.share({
        message: shareUrl,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  //** 좋아요 토글 핸들러 */
  const handleToggleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;

    // UI 먼저 업데이트
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch(`/posts/${item.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
      });

      if (!res.ok) throw new Error('Server failed');
    } catch (err) {
      console.log('서버 오류');

      // 실패 시 원래 상태 복구
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  /** 게시물 옵션 메뉴 (권한에 따른 분기) */
  const actionSheetActions = useMemo(() => {
    // 내 게시물일 때
    if (item.user.id === 1234) {
      return [
        {
          label: '수정하기',
          onPress: () => {
            setShowActionSheet(false);
            console.log('수정하기');
          },
        },
        {
          label: '게시물 비공개 처리',
          onPress: () => {
            show({
              message: '게시물이 비공개로 전환되었어요.',
              undoText: '취소',
              onUndo: () => console.log('취소됨'),
            });
          },
        },
        {
          label: '삭제하기',
          destructive: true,
          onPress: () => {
            setShowActionSheet(false);

            open({
              type: 'warning',
              title: '게시물을 삭제할까요?',
              message: '삭제한 게시물은 되돌릴 수 없어요.',
              confirmText: '삭제',
              cancelText: '취소',

              onConfirm: () => {
                console.log('삭제 요청');
                close();

                show({
                  message: '게시물이 삭제되었어요',
                  duration: 2000,
                });
              },
              onCancel: () => close(),
            });
          },
        },
      ];
    }

    // 다른 사람 게시물일 때
    return [
      {
        label: '이 게시물 숨기기',
        onPress: () =>
          show({
            message: '게시물이 숨겨졌어요.',
            undoText: '취소',
            onUndo: () => console.log('게시물 숨김 취소됨'),
          }),
      },
      {
        label: '전체 게시물 숨기기',
        onPress: () =>
          show({
            message: '전체 게시물이 숨겨졌어요',
            undoText: '취소',
            onUndo: () => console.log('전체 게시물 숨김 취소됨'),
          }),
      },
      {
        label: '신고하기',
        destructive: true,
        onPress: () => console.log('신고하기'),
      },
    ];
  }, [item.user.id]);

  useEffect(() => {
    setLiked(item.isLiked);
    setLikeCount(item.likes);
  }, [item.isLiked, item.likes]);

  return (
    <>
      <Card>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (disableProfileLink) return;
              router.push({
                pathname: '/user/[username]',
                params: { username: item.user.nickname, userId: item.user.id },
              });
            }}
            style={styles.headerLeft}
          >
            {/* 사용자 정보 */}
            <Avatar src={item.user.profileImageUrl} size="sm" />
            <View style={styles.userInfo}>
              <View style={styles.userMetaRow}>
                <Text style={styles.nickname}>{item.user.nickname}</Text>
                <Text style={styles.timeAgo}>
                  {timeAgo(new Date(item.createdAt))}
                  {item.updatedAt && ' (수정됨)'}
                </Text>
              </View>
              <Text style={styles.email}>{item.user.email}</Text>
            </View>
          </Pressable>

          {/* 게시물 옵션 버튼 */}
          <Pressable onPress={() => setShowActionSheet(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#888" />
          </Pressable>
        </View>

        {/* 피드 내용 */}
        <View style={styles.content}>
          <Text style={styles.bodyText} numberOfLines={undefined}>
            {item.content}
          </Text>
          {item.imageUrls &&
            item.imageUrls.length > 0 &&
            item.imageUrls.map((item, Index) => {
              return (
                <Image
                  key={Index}
                  source={{ uri: item }}
                  resizeMode="cover"
                  style={styles.postImage}
                />
              );
            })}
        </View>

        <View style={styles.postActions}>
          {/* 좋아요 버튼 */}
          <Pressable style={styles.actionButton} onPress={handleToggleLike}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? '#EE685A' : '#111827'}
            />
            <Text style={[styles.likesCount, liked && { color: '#EE685A' }]}>
              {likeCount > 0 ? likeCount : null}
            </Text>
          </Pressable>

          {/* 댓글 버튼 */}
          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.navigate({
                pathname: '/(modal)/comment',
                params: { postId: item.id, postUserId: item.user.id },
              })
            }
          >
            <Ionicons name="chatbubble-outline" size={20} color="#111827" />
            <Text style={styles.commentsCount}>
              {item.comments.length > 0 ? item.comments.length : null}
            </Text>
          </Pressable>

          {/* 공유 버튼 */}
          <Pressable
            style={styles.actionButton}
            onPress={() => handleShareLink(item.user.nickname, String(item.id))}
          >
            <Ionicons name="send-outline" size={20} color="#111827" />
          </Pressable>
        </View>
      </Card>

      {/* 액션 시트 */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        actions={actionSheetActions}
      />
    </>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    marginBottom: 15,
  },
  bodyText: {
    lineHeight: 22,
    color: '#111827',
  },
  postActions: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 12,
    marginLeft: 5,
    color: '#111827',
  },
  commentsCount: {
    fontSize: 12,
    marginLeft: 5,
    minWidth: 15,
    color: '#111827',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 8,
  },
  timeAgo: {
    fontSize: 12,
    color: '#888',
  },
});
