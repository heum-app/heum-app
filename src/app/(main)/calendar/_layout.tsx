import { Header } from '@/components';
import { Stack } from 'expo-router';

export default function CalendarLayout() {
  return (
    <Stack>
      {/* 캘린더 화면 */}
      <Stack.Screen
        name="index"
        options={{
          title: '수영 캘린더',
          header: ({ options, navigation }) => (
            <Header title={options.title} onBack={() => navigation.goBack()} />
          ),
          headerShown: true,
        }}
      />

      {/* 수영 기록 수정 화면 */}
      <Stack.Screen
        name="edit"
        options={{
          title: '',
          header: ({ options, navigation }) => (
            <Header title={options.title} onBack={() => navigation.goBack()} />
          ),
          headerShown: true,
        }}
      />
    </Stack>
  );
}
