export type Token = {
  tokenId: number;
  userId: number;
  refreshToken: string;
  deviceType: string;
  isValid: boolean;
  createdAt: string;
  expiredAt: string;
};

export type Profile = {
  user: {
    id: number;
    email: string;
    profile: {
      id: number;
      nickname: string;
      profileImageUrl: string;
      bio: string;
    };
  };
  postCount: number;
  followers: number;
  following: number;
  isFollowing: boolean;
  postIds: number[];
  commentIds: number[];
};

export type Suggestion = {
  suggestionId: number;
  userId: number;
  name: string;
  phone: string;
  email: string;
  content: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
};

export type UserBadge = {
  userId: number;
  badgeId: number;
  acquiredAt: string;
};

export type UserPool = {
  userPoolId: number;
  poolId: number;
  userId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  addedAt: string;
  updatedAt: string;
};

export type User = {
  userId: number;
  socialProvider: 'KAKAO' | 'NAVER' | 'GOOGLE';
  socialId: string;
  email: string;
  isPublic: boolean;
  birthDate: string;
  gender: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type WatchDevice = {
  watchId: number;
  userId: number;
  deviceType: string;
  connectedAt: string;
  isActive: boolean;
};
