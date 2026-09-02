import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface BottomSheetState {
  index: number;
  contentStack: ReactNode[];
}

interface BottomSheetActions {
  open: (node) => void;
  goBack: () => void;
  close: () => void;
}
/**
 * 전역 BottomSheet 상태 관리용 Zustand 스토어 훅
 *
 * 목적:
 * - 앱 전체에서 공통으로 BottomSheet 모달을 제어하기 위함
 * - 각 화면에서 독립적으로 BottomSheet를 만들지 않고,
 *   하나의 전역 시트를 재사용할 수 있도록 함
 *
 * 상태:
 * - `index`: 현재 시트 위치 인덱스 (-1 = 닫힘, 0 이상 = 열림)
 * - `content`: 시트 내부에 렌더링할 컴포넌트(ReactNode)
 *
 * 액션:
 * - `open(content, index?)`: 지정한 컴포넌트를 시트에 렌더링하며 열기
 *    └ `index` 기본값은 0 (snapPoints[0])
 * - `close()`: 시트를 닫고, 내용(`content`)을 초기화
 */
export const useBottomSheetStore = create<BottomSheetState & BottomSheetActions>((set, get) => ({
  index: -1,
  contentStack: [],

  open: (node, index = 0) => {
    const prev = get().contentStack;
    set({
      contentStack: [...prev, node],
      index,
    });
  },

  goBack: () => {
    const prev = get().contentStack;
    // 1개 남으면 그냥 닫기
    if (prev.length <= 1) {
      set({ index: -1, contentStack: [] });
      return;
    }

    // 맨 마지막만 제거하고 이전 화면으로 돌아감
    const newStack = prev.slice(0, prev.length - 1);
    set({ contentStack: newStack });
  },

  close: () => set({ index: -1, contentStack: [] }),
}));

interface AlertState {
  isOpen: boolean;
  type: 'alert' | 'success' | 'warning';
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
interface AlertActions {
  open: (params: Omit<AlertState, 'isOpen' | 'open' | 'close'>) => void;
  close: () => void;
}

/**
 * 전역 Alert 상태 관리용 Zustand 스토어 훅
 *
 * 목적:
 * - 앱 전체에서 공통으로 Alert 모달을 제어하기 위함
 * - 각 화면에서 개별 Alert 컴포넌트를 만들지 않고,
 *   하나의 전역 Alert 컴포넌트를 재사용할 수 있도록 함
 *
 * 상태:
 * - `isOpen`: 알럿 열림 여부 (true = 열림, false = 닫힘)
 * - `type`: 알럿 종류 ('alert' | 'success' | 'warning')
 * - `title`: 알럿 제목 (예: "로그아웃하시겠어요?")
 * - `message`: 알럿 내용 (예: "현재 계정에서 로그아웃됩니다.")
 * - `confirmText`: 확인 버튼 텍스트 (기본값: "확인")
 * - `cancelText`: 취소 버튼 텍스트 (필요 없는 경우 빈 문자열)
 * - `onConfirm`: 확인 버튼 클릭 시 실행할 콜백
 * - `onCancel`: 취소 버튼 클릭 시 실행할 콜백
 *
 * 액션:
 * - `open(params)`: 지정한 설정으로 알럿을 열기
 *    └ `params`에는 제목, 메시지, 타입, 콜백 등을 전달
 * - `close()`: 알럿 닫기 (isOpen = false)
 *
 * 사용 예시:
 * open({
 *   type: 'warning',
 *   title: '댓글을 삭제하시겠어요?',
 *   message: '이 작업은 되돌릴 수 없습니다.',
 *   confirmText: '삭제',
 *   cancelText: '취소',
 *   onConfirm: () => console.log('삭제됨'),
 *   onCancel: () => console.log('취소됨'),
 * });
 */
export const useAlertStore = create<AlertState & AlertActions>((set) => ({
  isOpen: false,
  type: 'alert',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '',
  onConfirm: undefined,
  onCancel: undefined,
  open: (params) => set({ ...params, isOpen: true }),
  close: () => set({ isOpen: false }),
}));

interface ToastState {
  id?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  undoText?: string;
  onUndo?: () => void;
}

interface ToastActions {
  show: (params: ToastState) => void;
  hide: () => void;
}

/**
 * 전역 Toast 상태 관리용 Zustand 스토어 훅
 *
 * 목적:
 * - 앱 전체에서 공통적으로 사용하는 Toast/Undo를 전역으로 관리
 * - SnackBar, Undo Toast 같은 UI를 어디에서든 쉽게 표시
 *
 * 사용 예시:
 * useToastStore.getState().show({
 *   message: '게시물이 숨겨졌어요',
 *   undoText: '취소',
 *   onUndo: () => console.log('되돌리기!'),
 * });
 */
export const useToastStore = create<ToastState & { visible: boolean } & ToastActions>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 2500,
  undoText: undefined,
  onUndo: undefined,

  show: (params) => {
    set({
      ...params,
      visible: true,
    });

    // duration 지나면 자동 hide (Undo 누르면 취소 가능)
    const duration = params.duration ?? 2500;
    setTimeout(() => {
      set({ visible: false });
    }, duration);
  },

  hide: () => set({ visible: false }),
}));

interface SearchState {
  keyword: string;
  recent: string[];
}

interface SearchActions {
  setKeyword: (k: string) => void;
  addRecent: (k: string) => void;
  removeRecent: (k: string) => void;
  clearRecent: () => void;
}

/**
 * 전역 Search 상태 관리용 Zustand 스토어 훅
 *
 * 목적:
 * - 검색어를 검색 레이아웃과 탭별 페이지(예: index/friend/pool)에서
 * - 공통으로 공유하기 위한 전역 상태
 *
 * 사용 예시:
 * 1) 검색창 컴포넌트에서 검색어 업데이트
 *    const setKeyword = useSearchStore(s => s.setKeyword);
 *    <TextInput onChangeText={setKeyword} />
 *
 * 2) 검색 성공 시 최근 검색어 저장
 *    const addRecent = useSearchStore(s => s.addRecent);
 *    addRecent(keyword);
 *
 * 3) 검색어가 없으면 최근 검색어 화면 표시
 *    const keyword = useSearchStore(s => s.keyword);
 *    if (!keyword) return <RecentSearchList />;
 *
 * 4) 최근 검색어 삭제
 *    const removeRecent = useSearchStore(s => s.removeRecent);
 *    removeRecent('수영장');
 *
 * 5) 전체 삭제
 *    const clearRecent = useSearchStore(s => s.clearRecent);
 *    clearRecent();
 */
export const useSearchStore = create<SearchState & SearchActions>()(
  persist(
    (set, get) => ({
      keyword: '',
      recent: [],

      setKeyword: (k: string) => set({ keyword: k }),

      addRecent: (k: string) => {
        if (!k.trim()) return;
        const updated = [k, ...get().recent.filter((v) => v !== k)].slice(0, 20);
        set({ recent: updated });
      },

      removeRecent: (k: string) =>
        set((state) => ({
          recent: state.recent.filter((v) => v !== k),
        })),

      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: 'recent-search-storage',
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        // recent만 저장됨
        recent: state.recent,
      }),
    },
  ),
);
