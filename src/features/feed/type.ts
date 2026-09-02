export interface PostData {
  id: number;
  content: string;
  imageUrls?: string[];
  likes: number;
  comments: CommentData[];
  visibility: 'friends' | 'private';
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  user: {
    id: number;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
}

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

export interface PostLike {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export type PostComment = {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
};

// export type PostPreference = {
//   id: number;
//   userId: number;
//   postId: number;
//   isHidden: boolean;
//   createdAt: string;
//   createdBy: number;
//   updatedAt: string;
//   updatedBy: number;
// };

export type UserFollowRequest = {
  id: number;
  requesterId: number;
  targetId: number;
  status: '0' | '1' | '2'; // 상태: 0=신청, 1=수락, 2=거절
  createdAt: string;
  updatedAt: string;
};

export interface CommentItemProps {
  item: CommentData;
  onLongPress: (item: CommentData) => void;
}
