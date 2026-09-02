import { Header } from '@/components';
import FilterSheet from '@/features/rank/components/FilterSheet';
import { useBottomSheetStore } from '@/store/commonStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Icon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={26} {...props} />;
}

export default function TabLayout() {
  const open = useBottomSheetStore((s) => s.open);
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: '#4285EA',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          header: () => (
            <Header
              title=""
              rightItems={[
                <Pressable onPress={() => router.push('/(main)/notification')}>
                  <Ionicons name="notifications-outline" size={26} color="black" />
                </Pressable>,
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: '통계',
          header: () => (
            <Header
              title="통계"
              rightItems={[
                <Pressable onPress={() => router.push('/(main)/notification')}>
                  <Ionicons name="notifications-outline" size={26} color="black" />
                </Pressable>,
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <Icon name="bar-chart" color={color} />,
        }}
      />

      <Tabs.Screen
        name="feed"
        options={{
          title: '피드',
          header: () => (
            <Header
              title="피드"
              rightItems={[
                <Pressable onPress={() => router.push('/(main)/notification')}>
                  <Ionicons name="notifications-outline" size={26} color="black" />
                </Pressable>,
                <Pressable onPress={() => router.push('/search')}>
                  <Ionicons name="search-outline" size={26} color="black" />
                </Pressable>,
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <Icon name="hashtag" color={color} />,
        }}
      />

      <Tabs.Screen
        name="rank"
        options={{
          title: '랭킹',
          header: () => (
            <Header
              title="랭킹"
              bgColor="#4285EA"
              titleColor="white"
              rightItems={[
                <Pressable onPress={() => router.push('/(main)/notification')}>
                  <Ionicons name="notifications-outline" size={26} color="white" />
                </Pressable>,
                <Pressable onPress={() => open(<FilterSheet />)}>
                  <Ionicons name="options-outline" size={26} color="white" />
                </Pressable>,
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <Icon name="trophy" color={color} />,
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: '마이',
          headerTransparent: true,
          header: () => <Header title="" bgColor="transparent" />,
          tabBarIcon: ({ color }) => <Icon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
