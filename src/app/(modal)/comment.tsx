import { ActionSheet } from '@/components/common/ActionSheet';
import { AnimatedButton } from '@/components/common/AnimatedButton';
import { CommentItem } from '@/features/feed/components/CommentItem';
import { CommentData } from '@/features/feed/type';
import { useAlertStore } from '@/store/commonStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const mockComments: Record<number, CommentData[]> = {
  1: [
    {
      id: 1,
      content: '와 기록 고생했다!',
      createdAt: '2024-06-01T10:00:00',
      user: {
        id: 2,
        email: 'test2@example.com',
        nickname: '장의동 거북이',
        profileImageUrl: 'https://i.pinimg.com/736x/df/a0/47/dfa0473803e06a8725ee85491b0dc4ad.jpg',
      },
    },
    {
      id: 2,
      content: '대박 👍',
      createdAt: '2024-06-01T10:30:00',
      user: {
        id: 3,
        email: 'test3@example.com',
        nickname: '은행동 돌고래',
        profileImageUrl: 'https://i.pinimg.com/736x/1d/c2/e3/1dc2e380a7d0de12a8c12ba74c14a7bf.jpg',
      },
    },
  ],

  2: [
    {
      id: 3,
      content: '이 수영장 좋아보여요!',
      createdAt: '2024-06-02T09:20:00',
      user: {
        id: 4,
        email: 'test4@example.com',
        nickname: '초록마을 물개',
        profileImageUrl: 'https://i.pinimg.com/736x/23/b5/c7/23b5c7d072219559a686e2ec09b748ac.jpg',
      },
    },
  ],
};

function getMockComments(postId: string) {
  return mockComments[postId] || [];
}

export default function CommentModal() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { postId, postUserId } = useLocalSearchParams<{ postId: string; postUserId: string }>();

  const [inputComment, setInputComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeType, setActiveType] = useState<'myComment' | 'myPost' | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const open = useAlertStore((state) => state.open);

  /** 댓글 블러오기 */
  // useEffect(() => {
  //   const getComments = async () => {
  //     try {
  //       const res = await fetch(`/posts/${postId}/comments`);
  //       if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
  //       const data = await res.json();
  //       setComments(data.comments);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   getComments();
  // }, [postId]);

  useEffect(() => {
    setIsLoading(true);

    const comments = getMockComments(postId);
    setComments(comments);

    setIsLoading(false);
  }, [postId]);

  /** 댓글 추가 핸들러 */
  const handleSendComment = () => {
    setInputComment('');
    console.log('댓글 추가', inputComment);
  };

  /** 댓글 수정 핸들러 */
  const handleEditComment = (commentId: number) => {
    console.log(`댓글 수정: ${commentId}`);
  };

  /** 댓글 삭제 핸들러 */
  const handleDeleteComment = (commentId: number) => {
    setActiveType(null); // 액션시트 닫기
    router.back(); // 댓글 모달 닫기

    open({
      type: 'warning',
      title: '댓글을 삭제할까요?',
      message: '삭제한 댓글은 되돌릴 수 없어요.',
      confirmText: '삭제',
      cancelText: '취소',

      // 삭제 확정
      onConfirm: () => {
        console.log(`댓글 삭제: ${commentId}`);
        setTimeout(() => {
          router.push({
            pathname: '/(modal)/comment',
            params: { postId, postUserId },
          });
        }, 200);
      },

      // 취소
      onCancel: () => {
        setTimeout(() => {
          router.push({
            pathname: '/(modal)/comment',
            params: { postId, postUserId },
          });
        }, 200);
      },
    });
  };

  /** 댓글 길게 누름 핸들러 */
  const onLongPress = useCallback(
    (item: CommentData) => {
      const isMyComment = item.user.id === 1234;
      const isMyPost = postUserId === String(1234);

      if (isMyComment) {
        setActiveType('myComment');
        setSelectedCommentId(item.id);
      } else if (isMyPost) {
        setActiveType('myPost');
        setSelectedCommentId(item.id);
      }
    },
    [postUserId],
  );

  /** 게시물 옵션 메뉴 (권한에 따른 분기) */
  const actionSheetActions = useMemo(() => {
    if (!activeType || !selectedCommentId) return [];

    const commonDelete = {
      label: '댓글 삭제',
      destructive: true,
      onPress: () => handleDeleteComment(selectedCommentId),
    };

    // 내 댓글일 때
    if (activeType === 'myComment') {
      return [
        {
          label: '댓글 수정',
          onPress: () => handleEditComment(selectedCommentId),
        },
        commonDelete,
      ];
    }

    // 내 게시물일 때
    if (activeType === 'myPost') {
      return [commonDelete];
    }

    return [];
  }, [activeType, selectedCommentId]);

  return (
    <>
      <View style={styles.container}>
        {/* 상단 둥근 바 영역 */}
        <View style={styles.topBarContainer}>
          <View style={styles.handleBar} />
        </View>

        {/* 헤더 텍스트 */}
        <View style={styles.header}>
          <Text style={styles.title}>댓글</Text>
        </View>

        {/* 댓글 목록 */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <CommentItem item={item} onLongPress={onLongPress} />}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>댓글이 없습니다.</Text>}
          />
        )}
        {/* 입력창 */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom : 0}
          style={styles.inputWrapper}
        >
          <View style={[styles.inputBox, { paddingBottom: insets.bottom + 8 }]}>
            <Image
              source={{
                uri: 'https://i.pinimg.com/1200x/31/9b/21/319b21b0bcaacf7bb8a8307998c3a46e.jpg',
              }}
              style={styles.inputAvatar}
            />
            <TextInput
              placeholder="댓글을 남겨보세요."
              style={styles.textInput}
              value={inputComment}
              onChangeText={setInputComment}
            />
            <AnimatedButton
              visible={inputComment.length > 0}
              icon="arrow-up"
              onPress={handleSendComment}
            />
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* 액션 시트 */}
      <ActionSheet
        visible={!!activeType}
        onClose={() => {
          setActiveType(null);
          setSelectedCommentId(null);
        }}
        actions={actionSheetActions}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 16,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    height: 36,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
