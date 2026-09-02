// src/api/types/swimming.types.ts
/**
 * 수영 데이터 동기화 요청 (POST /swimming/sync)
 */
export interface SwimmingSyncRequest {
  date: string; // ISO 8601 (YYYY-MM-DD)
  distance: number; // meters
  duration: number; // minutes
  pace: string; // MM:SS
  averageHeartRate: number; // bpm
  platform: 'ios' | 'android';
}

/**
 * 수영 데이터 동기화 응답 (POST /swimming/sync)
 */
export interface SwimmingSyncResponse {
  success: boolean;
  message: string;
}

/**
 * 수영 데이터 조회 응답 (GET /swimming/calendar)
 */
export interface SwimmingRecordResponse {
  id: number;
  swimDate: string; // "YYYY-MM-DD"
  swimDistance: number;
  swimTime: string;
  startTime: string;
  endTime: string;
  calories: number;
  poolLength: number;
  avrgPace: string;
  avrgHeartRate: number;
  swimPool: string;
  imRecord?: {
    backDistance?: number;
    breastDistance?: number;
    flyDistance?: number;
    freeDistance?: number;
  };
  swimDiary: {
    content: string;
  };
}
