import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  onboardingCompleted: boolean;
  setOnboardingCompleted: () => void;
  isWatchConnected: boolean;
  setIsWatchConnected: (connected: boolean) => void;
  syncedWorkoutIds: string[];
  addSyncedWorkoutId: (id: string) => void;
}

/**
 * 앱 전역 설정을 관리하는 Zustand 스토어 훅
 * - 스토리지 키: `app-storage`
 *
 * 상태:
 * - `onboardingCompleted` - 온보딩 완료 여부.
 * - `isWatchConnected` - 애플워치(건강 데이터) 연동 여부.
 * - `syncedWorkoutIds` - 이미 동기화가 완료된 워크아웃 UUID 목록.
 *
 * 액션:
 * - `setOnboardingCompleted()` - 온보딩을 완료로 표시.
 * - `setIsWatchConnected(connected)` - 워치 연동 활성화 상태 설정.
 * - `addSyncedWorkoutId(id)` - 완료된 워크아웃 UUID 추가.
 *
 * 사용 예:
 * ```ts
 * const { onboardingCompleted, setOnboardingCompleted } = useAppStore();
 * if (!onboardingCompleted) setOnboardingCompleted();
 */
export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      onboardingCompleted: false, // 앱소개 온보딩 상태(최소 설치 시 로그인 성공 후 온보딩 안보이게)
      setOnboardingCompleted: () => set({ onboardingCompleted: true }),
      isWatchConnected: false,
      setIsWatchConnected: (connected) => set({ isWatchConnected: connected }),
      syncedWorkoutIds: [],
      addSyncedWorkoutId: (id) => {
        const current = get().syncedWorkoutIds || [];
        if (!current.includes(id)) {
          set({ syncedWorkoutIds: [...current, id] });
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
