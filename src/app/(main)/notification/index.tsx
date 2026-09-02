import { NotificationCard } from '@/features/notification/components/NotificationCard';
import { NotificationItem } from '@/features/notification/type';
import React, { useEffect, useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 알림 목록 mock 데이터
const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'like',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
  {
    id: 2,
    type: 'comment',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
  {
    id: 3,
    type: 'follow',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
  {
    id: 4,
    type: 'wakeup',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
  {
    id: 5,
    type: 'goal',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
  {
    id: 6,
    type: 'badge',
    content: '오늘 수영 기록 1000m 달성! 🏊♂️',
    targetId: 1,
    isRead: false,
    createdAt: '2025-11-10T10:00:00Z',
    user: {
      id: 2,
      nickname: '김수영',
    },
  },
];

// 날짜별 그룹화 함수
const groupByDate = (notifications: NotificationItem[]) => {
  const grouped: Record<string, NotificationItem[]> = {};

  notifications.forEach((item) => {
    const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => ({
      title: date.replace(/-/g, '.'), // 화면엔 "2025.11.10" 으로 표시
      data: grouped[date],
    }));
};

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    setNotifications(DUMMY_NOTIFICATIONS);
  }, []);

  const sections = useMemo(() => groupByDate(notifications), [notifications]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <SectionList
        style={styles.sectionList}
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationCard item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionList: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 12,
    color: '#888',
    backgroundColor: '#FFF',
  },
});
