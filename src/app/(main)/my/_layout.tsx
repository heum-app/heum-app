import { Header } from '@/components';
import { Stack } from 'expo-router';

export default function MyPageLayout() {
  return (
    <Stack>
      {/* 프로필 수정 화면 */}
      <Stack.Screen
        name="profile"
        options={{
          title: '프로필 수정',
          header: ({ options, navigation }) => (
            <Header title={options.title} onBack={() => navigation.goBack()} />
          ),
          headerShown: true,
        }}
      />

      {/* 내 정보 화면 */}
      <Stack.Screen
        name="info"
        options={{
          title: '내 정보',
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

      {/* 내 목표 화면 */}
      <Stack.Screen
        name="goals"
        options={{
          title: '내 목표',
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
      {/* 자주 묻는 질문 화면 */}
      <Stack.Screen
        name="faq"
        options={{
          title: '자주 묻는 질문',
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
      {/* 문의하기 화면 */}
      <Stack.Screen
        name="contact"
        options={{
          title: '문의하기',
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

      {/* 문의 완료 모달 */}
      <Stack.Screen
        name="contact-complete-modal"
        options={{
          presentation: 'transparentModal',
          headerShown: false,
          animation: 'fade',
        }}
      />
    </Stack>
  );
}
