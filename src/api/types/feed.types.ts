/* ---------------------------------- Entity ---------------------------------- */
/**
 * Post 관련 응답 데이터
 */
export interface PostData {
  id: number;
  content: string;
  imageUrls?: string[];
  likes: number;
  comments: number;
  visibility: 'friends' | 'private';
  createdAt: string;
  updatedAt: string;
  idLiked: boolean;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
}

/**
 * Comment 관련 응답 데이터
 */
export interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
}

/* ---------------------------------- Request DTO ---------------------------------- */
/**
 * 댓글 작성 요청 (POST /feed/posts/:postId/comments)
 */
export interface CommentCreateRequestDto {
  content: string;
}

/**
 * 댓글 수정 요청 (PATCH /feed/posts/:postId/comments/:commentId)
 */
export interface CommentUpdateRequestDto {
  content: string;
}

/* ---------------------------------- Response DTO ---------------------------------- */
/**
 * 게시물 리스트 응답 (GET /feed/posts?cursor=)
 */
export type FeedPostListResponseDto = PostData[];

/**
 * 단일 게시물 응답 (GET /feed/posts/:postId)
 */
export type PostResponseDto = PostData;

/**
 * 댓글 리스트 응답 (GET /feed/posts/:postId/comments)
 */
export type CommentListResponseDto = CommentData[];

/**
 * 좋아요 추가 응답 (POST /feed/posts/:postId/like)
 */
export interface LikeResponseDto {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

/**
 * 팔로우 요청/취소/수락/거절/언팔로우 응답
 */
export interface FollowRequestResponseDto {
  id: number;
  requesterId: number;
  targetId: number;
  status: '0' | '1' | '2'; // 0=요청, 1=수락, 2=거절
  createdAt: string;
  updatedAt: string;
}

/**
 * 전체 사용자 목록 응답 (GET /feed/search/users)
 */
export interface AllUsersResponseDto {
  id: string;
  nickname: string;
  profileImageUrl: string;
  bio: string;

  isFollowing: true;
  isFollower: false;
  isRequestedByMe: false;
  isRequestedToMe: true;
}
