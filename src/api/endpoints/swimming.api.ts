// src/api/endpoints/swimming.api.ts
import { apiClient } from '../index';
import { SwimmingSyncRequest } from '../types/swimming.types';

/**
 * 수영 데이터 동기화 (POST /swimming/sync)
 */
export const syncSwimmingData = async (data: SwimmingSyncRequest) => {
  const response = await apiClient.post('/swimming/sync', data);
  return response.data;
};
