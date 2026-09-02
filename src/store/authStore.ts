import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
}

interface AuthActions {
  setLoggedIn: (status: boolean) => void;
  logout: () => void;
}

const secureStorage = {
  getItem: async (key: string) => SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: async (key: string) => SecureStore.deleteItemAsync(key),
};

/**
 * 인증 토큰을 관리하는 Zustand 스토어 훅
 *
 * 지속성:
 * - 스토리지: `expo-secure-store`(JSON)
 * - 키: `auth-secure`
 *
 * 상태:
 * - `isLoggedIn`: 로그인 상태
 *
 * 액션:
 * - `setLoggedIn(status)`: 로그인 상태 변경
 * - `logout()`: 로그아웃
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'auth-secure',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    },
  ),
);
