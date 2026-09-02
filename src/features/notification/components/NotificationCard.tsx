import { Card } from '@/components/common/Card';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NotificationItem } from '../type';

// 알림 타입별 아이콘 정의
const getNotificationIconProps = (type: string) => {
  switch (type) {
    case 'follow':
      return { name: 'person-add-outline', color: '#4285EA' } as const;
    case 'like':
      return { name: 'heart-outline', color: '#FF3B30' } as const;
    case 'goal':
      return { name: 'flag-outline', color: '#000000' } as const;
    case 'badge':
      return { name: 'medal-outline', color: '#FFD700' } as const;
    case 'comment':
      return { name: 'chatbox-outline', color: '#000000' } as const;
    case 'ranking':
      return { name: 'trophy-outline', color: '#FFD700' } as const;
    default:
      return { name: 'notifications-outline', color: '#B0B0B0' } as const;
  }
};

// 개별 알림 카드
export function NotificationCard({ item }: { item: NotificationItem }) {
  const { type, content, createdAt, user } = item;
  const iconProps = getNotificationIconProps(type);

  return (
    <Pressable onPress={() => {}}>
      <Card style={styles.card}>
        <Ionicons name={iconProps.name} size={24} color={iconProps.color} style={styles.icon} />
        <View style={styles.contentWrapper}>
          <Text style={styles.bodyText}>
            <Text style={styles.senderText}>{user.nickname}</Text>
            {content}
          </Text>
          <Text style={styles.timeText}>{dayjs(createdAt).format('hh:mm A')}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyText: {
    lineHeight: 20,
    color: '#111827',
    flexShrink: 1,
  },
  senderText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
});
