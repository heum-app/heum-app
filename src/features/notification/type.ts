import { Ionicons } from '@expo/vector-icons';

export interface IconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

export type NotificationItem = {
  id: number;
  type: 'follow' | 'like' | 'comment' | 'wakeup' | 'goal' | 'badge';
  content: string;
  targetId: number;
  isRead: boolean;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
};

export type NotificationSetting = {
  settingId: number;
  userId: number;
  followAlert: boolean;
  commentAlert: boolean;
  likeAlert: boolean;
  rankingAlert: boolean;
  goalAlert: boolean;
  badgeAlert: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotifyHistory = {
  historyId: number;
  noticeId: number;
  userId: number;
  title: string;
  content: string;
  deepLink: string;
  readAt: string;
  createdAt: string;
  updatedAt: string;
};

export type NotifyTemplate = {
  templateId: number;
  key: string;
  title: string;
  content: string;
  deepLink: string;
};

export type NotifyToken = {
  tokenId: number;
  userId: number;
  deviceType: string;
  isActive: boolean;
  token: string;
  createdAt: string;
  updatedAt: string;
};
