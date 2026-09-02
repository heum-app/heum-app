export type SwimRecordRank = {
  id: number;
  totalDistance: number;
  totalSeconds: number;
  calories: number;
  averageHeartRate: number;
  pace: string;
  poolLength: number;
  source: 'auto' | 'manual';
  user: {
    id: number;
    nickname: string;
    profileImageUrl: string;
  };
};
