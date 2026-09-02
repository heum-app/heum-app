import { Header } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';

export default function NotificationLayout() {
  const router = useRouter();
  return (
    <Stack>
      {/* 알림 목록 화면 */}
      <Stack.Screen
        name="index"
        options={{
          title: '알림',
          header: ({ options, navigation }) => (
            <Header
              title={options.title}
              onBack={() => navigation.goBack()}
              rightItems={[
                <Pressable onPress={() => router.push('/(main)/notification/setting')} hitSlop={10}>
                  <Ionicons name="settings-outline" size={26} color="black" />
                </Pressable>,
              ]}
            />
          ),
          headerShown: true,
        }}
      />

      {/* 알림 설정 화면 */}
      <Stack.Screen
        name="setting"
        options={{
          title: '알림 설정',
          header: ({ options, navigation }) => (
            <Header
              title={options.title}
              onBack={() => {
                navigation.goBack();
              }}
            />
          ),
          headerShown: true,
        }}
      />
    </Stack>
  );
}
