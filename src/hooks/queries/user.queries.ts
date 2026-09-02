import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getUserInfo,
  getUserPostList,
  getUserProfile,
  postWithdrawUser,
  putUpdateUser,
  putUpdateUserProfile,
} from '@/api/endpoints/user.api';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/commonStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'expo-router';

/**
 * 내 정보 조회 쿼리 (GET /users/me)
 */
export const useUserInfoQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: getUserInfo,
    enabled: isLoggedIn, // 로그인 상태일 때만 API 호출
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

/**
 * 내 정보 수정 뮤테이션 (PUT /users/me)
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);

  return useMutation({
    mutationFn: putUpdateUser,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['user', 'info'] });

      showToast({ message: '수정이 완료되었어요.' });
    },
    onError: (error: any) => {
      console.log(error);
      showToast({ message: '수정에 실패했어요.' });
    },
  });
};

/**
 * 회원 탈퇴 뮤테이션 (POST /users/me/withdraw)
 */
export const useDeleteUserMutation = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.show);
  const router = useRouter();

  return useMutation({
    mutationFn: postWithdrawUser,
    onSuccess: () => {
      // 클라이언트 데이터 초기화
      queryClient.clear();
      logout();

      showToast({ message: '회원탈퇴가 완료되었습니다.' });

      // 로그인 화면으로 이동
      router.replace('/(auth)');
    },
    onError: (error: any) => {
      console.error('탈퇴 에러:', error);
      showToast({ message: '회원탈퇴에 실패했습니다. 다시 시도해 주세요.' });
    },
  });
};

/**
 * 특정 사용자 게시물 리스트 조회 쿼리 (GET /users/:nickname/posts)
 */
export const useUserPostsQuery = (nickname: string) => {
  return useQuery({
    queryKey: ['user', nickname, 'posts'],
    queryFn: () => getUserPostList(nickname),
    enabled: !!nickname,
    staleTime: 1000 * 60,
  });
};

/**
 * 내 프로필 조회 쿼리 (GET /users/me/profile)
 */
export const useMyProfileQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUserProfile,
    enabled: isLoggedIn, // 로그인 상태일 때만 API 호출
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
};

/**
 * 유저 프로필 수정 뮤테이션 (PUT /users/me/profile)
 */
export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: putUpdateUserProfile,
    onSuccess: (updatedProfile) => {
      // Zustand 스토어 즉시 업데이트
      useUserStore.getState().updateUser({
        nickname: updatedProfile.nickname || null,
        bio: updatedProfile.bio || null,
        profileImageUrl: updatedProfile.profileImageUrl || null,
      });

      // React Query 캐시 업데이트
      queryClient.setQueryData(['user', 'info'], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          profile: {
            ...oldData.profile,
            ...updatedProfile,
          },
        };
      });

      // 백그라운드 리패치 유발
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'info'] });
      if (updatedProfile.nickname) {
        queryClient.invalidateQueries({
          queryKey: ['user', updatedProfile.nickname, 'posts'],
        });
      }

      // 토스트 띄우기
    },
    onError: () => {
      // 토스트 띄우기
    },
    onSettled: () => {
      router.back();
    },
  });
};
