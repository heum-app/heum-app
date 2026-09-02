import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { TabView } from 'react-native-tab-view';

import SegmentedControl from '@/components/common/SegmentedControl';
import AllTimeRankScreen from './all';
import WeeklyRankScreen from './index';

export default function RankLayout() {
  const layout = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();

  const [routes] = useState([
    { key: 'weekly', title: 'Weekly', path: '/rank' as const },
    { key: 'all', title: 'All Time', path: '/rank/all' as const },
  ]);

  const initialIndex = routes.findIndex((r) => r.path === pathname) || 0;
  const [sheetIndex, setSheetIndex] = useState(initialIndex);

  useEffect(() => {
    const current = routes.findIndex((r) => r.path === pathname);
    if (current !== -1 && sheetIndex !== current) {
      setSheetIndex(current);
    }
  }, [pathname, routes, sheetIndex]);

  const renderScene = ({ route }: { route: any }) => {
    switch (route.key) {
      case 'weekly':
        return <WeeklyRankScreen />;
      case 'all':
        return <AllTimeRankScreen />;
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
      navigationState={{ index: sheetIndex, routes }}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <View style={styles.segmentedControlWrapper}>
          <SegmentedControl
            options={routes.map((r) => r.title)}
            selectedIndex={sheetIndex}
            position={props.position}
            alphaValue={0.3}
            activeTextColor={'#4285EA'}
            inactiveTextColor={'#FFFFFF'}
            onSelect={handleIndexChange}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  segmentedControlWrapper: {
    padding: 16,
    backgroundColor: '#4285EA',
  },
});
