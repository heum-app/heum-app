import { create } from 'zustand';

interface UserProfile {
  id: number | null;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
  bio: string | null;
}

interface UserActions {
  setUser: (user: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  clearUser: () => void;
}

/**
 * 사용자 프로필 전역 상태(Zustand)
 *
 * 목적:
 * - 로그인 후 서버에서 받은 "내 정보(user)"를 앱 전역에서 사용하기 위한 스토어
 * - 마이페이지, 피드, 기록, 랭킹 등의 여러 화면에서 공통으로 필요
 * - React Query는 서버 상태(server state), Zustand는 클라이언트 상태(client state)
 *
 * 포함 정보:
 * - id: 사용자 고유 ID
 * - nickname: 닉네임
 * - profileImageUrl: 프로필 이미지 URL
 *
 * 특징:
 * - 인증 토큰과 분리된 독립적인 전역 상태
 * - 민감 정보가 아니므로 SecureStore 저장 필요 없음
 * - 앱 실행 시 자동 로그인 플로우에서 `/users/me` 조회 후 setUser() 호출
 *
 * 액션:
 * - setUser(user): 전체 프로필을 한 번에 설정
 * - updateUser(partial): 닉네임/이미지 등 일부 필드만 업데이트할 때 사용
 * - clearUser(): 로그아웃 시 유저 정보 초기화
 */
export const useUserStore = create<UserProfile & UserActions>((set) => ({
  id: null,
  email: null,
  nickname: null,
  profileImageUrl: null,
  bio: null,

  setUser: (user) => set(user),
  updateUser: (partial) => set((state) => ({ ...state, ...partial })),
  clearUser: () => set({ id: null, email: null, nickname: null, profileImageUrl: null }),
}));
