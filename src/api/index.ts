import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import Constants from 'expo-constants';
import snakecaseKeys from 'snakecase-keys';

import { resolveBaseUrl } from '@/lib/resolveBaseUrl';
import { useAuthStore } from '@/store/authStore';

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(Constants.expoConfig.extra.apiBaseUrl || 'https://api.example.com'),
  timeout: 10000,
  withCredentials: true,
});

// 단일 refresh 진행 상태 공유
let refreshInFlight: Promise<boolean> | null = null;

const REFRESH_URL = `${resolveBaseUrl(Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.example.com')}/auth/refresh`;

const runRefresh = async (): Promise<boolean> => {
  const { isLoggedIn, logout } = useAuthStore.getState();
  if (!isLoggedIn) {
    return false;
  }
  try {
    // 인터셉터 비적용용 생 axios 사용
    await axios.post(
      REFRESH_URL,
      {},
      {
        timeout: 10000,
        withCredentials: true,
      },
    );
    return true;
  } catch {
    useAuthStore.getState().logout();
    return false;
  }
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    if (config.data && !(config.data instanceof FormData)) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 - 토큰 재발급 로직
apiClient.interceptors.response.use(
  (response) => {
    response.data = camelcaseKeys(response.data, { deep: true });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshInFlight) {
        refreshInFlight = runRefresh().finally(() => {
          refreshInFlight = null;
        });
      }
      const isRefreshed = await refreshInFlight;
      if (isRefreshed) {
        // 쿠키가 교체되었으므로 동일한 요청 다시 실행
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
