/**
 * 로그인 요청 (POST /auth/login)
 */
export interface AuthLoginRequestDto {
  provider: 'NAVER' | 'KAKAO' | 'GOOGLE';
  socialToken: string;
}

/**
 * 로그인 응답 (POST /auth/login)
 */
export interface AuthLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    id: number;
    profile: { nickname: string; profileImageUrl: string; bio: string };
    socialProvider: string;
  };
}

/**
 * 로그아웃 요청 (POST /auth/logout)
 */
export interface AuthLogoutRequestDto {
  fcmToken?: string; // 임시(esLint 에러 방지용)
}

/**
 * 로그아웃 응답 (POST /auth/logout)
 */
export interface AuthLogoutResponseDto {
  message: string;
}
