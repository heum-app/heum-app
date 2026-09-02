import {
  acceptFollowRequest,
  deleteComment,
  deleteFollow,
  deleteFollowRequest,
  deleteLike,
  getCommentList,
  getPost,
  getPostList,
  patchComment,
  postComment,
  postFollowRequest,
  postLike,
  rejectFollowRequest,
} from '@/api/endpoints';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * 게시물 리스트 조회 쿼리 (GET /feed/posts) - 무한 스크롤 (useInfiniteQuery)
 */
export const usePostListQuery = () => {
  return useInfiniteQuery({
    queryKey: ['feed', 'posts'],
    queryFn: async ({ pageParam = null }) => getPostList(pageParam),
    getNextPageParam: (lastPage) => {
      const lastPost = lastPage.at(-1);
      return lastPost ? lastPost.id : undefined;
    },
    initialPageParam: null,
    staleTime: 1000 * 30, // 30초
  });
};

/**
 * 단일 게시물 조회 쿼리 (GET /feed/posts/:postId)
 */
export const usePostQuery = (postId: number) => {
  return useQuery({
    queryKey: ['feed', 'post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 30,
  });
};

/**
 * 댓글 리스트 조회 쿼리 (GET /feed/posts/:postId/comments)
 */
export const useCommentListQuery = (postId: number) => {
  return useQuery({
    queryKey: ['feed', 'post', postId, 'comments'],
    queryFn: () => getCommentList(postId),
    enabled: !!postId,
    staleTime: 1000 * 10,
  });
};

/**
 * 댓글 생성 뮤테이션 (POST /feed/posts/:postId/comments)
 */
export const useCreateCommentMutation = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string }) => postComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'post', postId, 'comments'] });
    },
  });
};

/**
 * 댓글 수정 뮤테이션 (PATCH /feed/posts/:postId/comments/:commentId)
 */
export const useUpdateCommentMutation = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string }) => patchComment(postId, commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'post', postId, 'comments'] });
    },
  });
};

/**
 * 댓글 삭제 뮤테이션 (DELETE /feed/posts/:postId/comments/:commentId)
 */
export const useDeleteCommentMutation = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'post', postId, 'comments'] });
    },
  });
};

/**
 * 좋아요 추가 뮤테이션 (POST /feed/posts/:postId/like)
 */
export const useCreateLikeMutation = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed', 'post', postId] });
    },
  });
};

/**
 * 좋아요 취소 뮤테이션 (DELETE /feed/posts/:postId/like)
 */
export const useDeleteLikeMutation = (postId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['feed', 'post', postId] });
    },
  });
};

/**
 * 팔로우 요청 뮤테이션 (POST /feed/users/:userId/follow-request)
 */
export const useRequestFollowMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postFollowRequest(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
    },
  });
};

/**
 * 팔로우 요청 취소 뮤테이션 (DELETE /feed/users/:userId/follow-request)
 */
export const useCancelFollowRequestMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFollowRequest(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
    },
  });
};

/**
 * 팔로우 요청 수락 (PATCH /feed/follow-requests/:requestId/accept)
 */
export const useAcceptFollowRequestMutation = (requestId: number, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => acceptFollowRequest(requestId),

    onSuccess: () => {
      // 상대방 프로필 or 팔로우 리스트 갱신
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'followRequests'] });
    },
  });
};

/**
 * 팔로우 요청 거절 (PATCH /feed/follow-requests/:requestId/reject)
 */
export const useRejectFollowRequestMutation = (requestId: number, userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectFollowRequest(requestId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'followRequests'] });
    },
  });
};

/**
 * 언팔로우 (DELETE /feed/users/:userId/follow)
 */
export const useUnfollowMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFollow(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'profile'] });
    },
  });
};
