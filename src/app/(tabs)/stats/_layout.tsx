import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';

import SegmentedControl from '@/components/common/SegmentedControl';
import WeekStatsScreen from './index';
import MonthStatsScreen from './month';
import YearStatsScreen from './year';

export default function StatsLayout() {
  const layout = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const [routes] = useState([
    { key: 'week', title: 'Week', path: '/stats' as const },
    { key: 'month', title: 'Month', path: '/stats/month' as const },
    { key: 'year', title: 'Year', path: '/stats/year' as const },
  ]);

  const initialIndex = routes.findIndex((r) => r.path === pathname) || 0;
  const [index, setIndex] = useState(initialIndex);

  // 현재 경로를 보고 index 조정
  useEffect(() => {
    const current = routes.findIndex((r) => r.path === pathname);
    if (current !== -1 && index !== current) {
      setIndex(current);
    }
  }, [pathname, routes, index]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'week':
        return <WeekStatsScreen />;
      case 'month':
        return <MonthStatsScreen />;
      case 'year':
        return <YearStatsScreen />;
      default:
        return null;
    }
  };

  // 스와이프 or 클릭 → URL도 함께 변경
  const handleIndexChange = (i: number) => {
    router.replace(routes[i].path);
  };

  return (
    <TabView
      lazy
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <View style={styles.segmentedControlWrapper}>
          <SegmentedControl
            options={routes.map((r) => r.title)}
            selectedIndex={index}
            position={props.position}
            onSelect={handleIndexChange}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  segmentedControlWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
});
