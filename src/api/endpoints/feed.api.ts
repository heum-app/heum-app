import { apiClient } from '..';
import {
  CommentCreateRequestDto,
  CommentListResponseDto,
  CommentUpdateRequestDto,
  FeedPostListResponseDto,
  FollowRequestResponseDto,
  LikeResponseDto,
  PostResponseDto,
} from '../types/feed.types';

/**
 * 게시물 리스트 조회 (GET /feed/posts?cursor=)
 */
export const getPostList = async (cursor?: number | null) => {
  const response = await apiClient.get<FeedPostListResponseDto>('/feed/posts', {
    params: cursor ? { cursor } : {},
  });
  return response.data;
};

/**
 * 단일 게시물 조회 (GET /feed/posts/:postId)
 */
export const getPost = async (postId: number) => {
  const response = await apiClient.get<PostResponseDto>(`/feed/posts/${postId}`);
  return response.data;
};

/**
 * 전체 게시물 숨기기 (POST /feed/posts/:postId/hide)
 */

/**
 * 단일 게시물 숨기기 (POST /feed/posts/:postId/hide)
 */

/**
 * 댓글 리스트 조회 (GET /feed/posts/:postId/comments)
 */
export const getCommentList = async (postId: number) => {
  const response = await apiClient.get<CommentListResponseDto>(`/feed/posts/${postId}/comments`);
  return response.data;
};

/**
 * 댓글 작성 (POST /feed/posts/:postId/comments)
 */
export const postComment = async (postId: number, data: CommentCreateRequestDto) => {
  const response = await apiClient.post<CommentListResponseDto>(
    `/feed/posts/${postId}/comments`,
    data,
  );
  return response.data;
};

/**
 * 댓글 수정 (PATCH /feed/posts/:postId/comments/:commentId)
 */
export const patchComment = async (
  postId: number,
  commentId: number,
  data: CommentUpdateRequestDto,
) => {
  const response = await apiClient.patch<CommentListResponseDto>(
    `/feed/posts/${postId}/comments/${commentId}`,
    data,
  );
  return response.data;
};

/**
 * 댓글 삭제 (DELETE /feed/posts/:postId/comments/:commentId)
 */
export const deleteComment = async (postId: number, commentId: number) => {
  const response = await apiClient.delete<CommentListResponseDto>(
    `/feed/posts/${postId}/comments/${commentId}`,
  );
  return response.data;
};

/**
 * 좋아요 추가 (POST /feed/posts/:postId/like)
 */
export const postLike = async (postId: number) => {
  const response = await apiClient.post<LikeResponseDto>(`/feed/posts/${postId}/like`);
  return response.data;
};

/**
 * 좋아요 취소 (DELETE /feed/posts/:postId/like)
 */
export const deleteLike = async (postId: number) => {
  const response = await apiClient.delete(`/feed/posts/${postId}/like`);
  return response.data;
};

/**
 * 팔로우 요청 (POST /feed/users/:userId/follow-request)
 */
export const postFollowRequest = async (userId: number) => {
  const res = await apiClient.post<FollowRequestResponseDto>(
    `/feed/users/${userId}/follow-request`,
  );
  return res.data;
};

/**
 * 팔로우 요청 취소 (DELETE /feed/users/:userId/follow-request)
 */
export const deleteFollowRequest = async (userId: number) => {
  const res = await apiClient.delete<FollowRequestResponseDto>(
    `/feed/users/${userId}/follow-request`,
  );
  return res.data;
};

/**
 * 팔로우 요청 수락 (PATCH /feed/follow-requests/:requestId/accept)
 */
export const acceptFollowRequest = async (requestId: number) => {
  const res = await apiClient.patch<FollowRequestResponseDto>(
    `/feed/follow-requests/${requestId}/accept`,
  );
  return res.data;
};

/**
 * 팔로우 요청 거절 (PATCH /feed/follow-requests/:requestId/reject)
 */
export const rejectFollowRequest = async (requestId: number) => {
  const res = await apiClient.patch<FollowRequestResponseDto>(
    `/feed/follow-requests/${requestId}/reject`,
  );
  return res.data;
};

/**
 * 언팔로우 (DELETE /feed/users/:userId/follow)
 */
export const deleteFollow = async (userId: number) => {
  const res = await apiClient.delete<FollowRequestResponseDto>(`/feed/users/${userId}/follow`);
  return res.data;
};
