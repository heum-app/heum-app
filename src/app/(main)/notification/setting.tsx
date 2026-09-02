import { ScreenContainer, Switch } from '@/components';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const unstable_settings = {
  title: '알림 설정',
};

const SettingItem = ({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: () => void;
}) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingLabel}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

export default function NotificationSettingScreen() {
  const [settings, setSettings] = useState({
    follow: true,
    feed: true,
    comment: true,
    like: false,
    rank: false,
    goal: true,
    badge: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>친구 알림</Text>
          <SettingItem
            label="팔로우 알림"
            value={settings.follow}
            onValueChange={() => toggleSetting('follow')}
          />
          <SettingItem
            label="피드 알림"
            value={settings.feed}
            onValueChange={() => toggleSetting('feed')}
          />
          <SettingItem
            label="댓글 알림"
            value={settings.comment}
            onValueChange={() => toggleSetting('comment')}
          />
          <SettingItem
            label="좋아요 알림"
            value={settings.like}
            onValueChange={() => toggleSetting('like')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>랭킹 알림</Text>
          <SettingItem
            label="등수 알림"
            value={settings.rank}
            onValueChange={() => toggleSetting('rank')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>도전 알림</Text>
          <SettingItem
            label="목표 달성 알림"
            value={settings.goal}
            onValueChange={() => toggleSetting('goal')}
          />
          <SettingItem
            label="뱃지 획득 알림"
            value={settings.badge}
            onValueChange={() => toggleSetting('badge')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#222222',
  },
});
