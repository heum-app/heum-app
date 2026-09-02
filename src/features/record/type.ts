export type Badge = {
  badgeId: number;
  condition: string;
  description: string;
  name: string;
};

export type Goal = {
  goalId: number;
  endDate: string;
  startDate: string;
  isAchieved: boolean;
  currentValue: number;
  targetValue: number;
  goalType: string;
  userId: number;
};

export type Record = {
  recordId: number;
  backDistance: number;
  backTime: string;
  breastDistance: number;
  breastTime: string;
  flyDistance: number;
  flyTime: string;
  freeDistance: number;
  freeTime: string;
};

export type SwimDiary = {
  recordId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type SwimHeartRate = {
  recordId: number;
  measuredAt: string;
  bpm: number;
};

export type SwimRecord = {
  id: number;
  date: string;
  totalDistance: number;
  totalSeconds: number;
  startTime: string;
  endTime: string;
  calories: number;
  averageHeartRate: number;
  pace: string;
  poolLength: number;
  source: 'auto' | 'manual';
  pool: {
    id: number;
    name: string;
  };
  user: {
    id: number;
  };
};
