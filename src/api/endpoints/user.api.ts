import { apiClient } from '@/api';
import { CommonResponseDto } from '@/api/types/common.types';
import type {
  UserPostListResponseDto,
  UserProfileResponseDto,
  UserProfileUpdateRequestDto,
  UserResponseDto,
  UserUpdateRequestDto,
} from '@/api/types/user.types';

/**
 * 내 정보 조회 (GET /users/me)
 */
export const getUserInfo = async () => {
  const response = await apiClient.get<UserResponseDto>('/users/me');
  return response.data;
};

/**
 * 내 정보 수정 (PUT /users/me)
 */
export const putUpdateUser = async (data: UserUpdateRequestDto) => {
  console.log('putUpdateUser', data);
  const response = await apiClient.put<UserResponseDto>('/users/me', data);
  return response.data;
};

/**
 * 회원 탈퇴 (POST /users/me/withdraw)
 */
export const postWithdrawUser = async () => {
  const response = await apiClient.post<CommonResponseDto>('/users/me/withdraw');
  return response.data;
};

/**
 * 특정 사용자 게시물 리스트 조회 (GET /users/:nickname/posts)
 */
export const getUserPostList = async (nickname: string) => {
  const response = await apiClient.get<UserPostListResponseDto>(`/users/${nickname}/posts`);
  return response.data;
};

/**
 * 내 프로필 조회 (GET /users/me/profile)
 */
export const getUserProfile = async () => {
  const response = await apiClient.get<UserProfileResponseDto>('/users/me/profile');
  return response.data;
};

/**
 * 내 프로필 수정 (PUT /users/me/profile)
 */
export const putUpdateUserProfile = async (formData: FormData) => {
  const response = await apiClient.put<UserProfileUpdateRequestDto>('/users/me/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
