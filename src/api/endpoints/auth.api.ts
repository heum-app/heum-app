import { apiClient } from '@/api';
import type {
  AuthLoginRequestDto,
  AuthLoginResponseDto,
  AuthLogoutResponseDto,
} from '@/api/types/auth.types';

/**
 * 로그인 (POST /auth/login)
 */
export const postLogin = async (data: AuthLoginRequestDto) => {
  const response = await apiClient.post<AuthLoginResponseDto>('/auth/login', data);
  return response.data;
};

/**
 * 로그아웃 (POST /auth/logout)
 */
export const postLogout = async () => {
  const response = await apiClient.post<AuthLogoutResponseDto>('/auth/logout');
  return response.data;
};
