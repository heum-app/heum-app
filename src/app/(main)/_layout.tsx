import { Stack, useRouter } from 'expo-router';

export default function MainLayout() {
  const router = useRouter();
  return (
    <Stack>
      {/* <Stack.Screen name="record" options={{ headerShown: false }} /> */}
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="user/[username]" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="post" options={{ headerShown: false }} />
      <Stack.Screen name="my" options={{ headerShown: false }} />
      <Stack.Screen name="calendar" options={{ headerShown: false }} />
    </Stack>
  );
}
