import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const SEARCH_TABS = [
  { path: '/search', label: '전체' },
  { path: '/search/friend', label: '친구' },
  { path: '/search/pool', label: '수영장' },
] as const;

export const SearchTabs = React.memo(function SearchTabs() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {SEARCH_TABS.map((t) => {
        const selected = pathname === t.path;
        return (
          <Pressable
            key={t.path}
            style={styles.tabButton}
            onPress={() => {
              if (!selected) router.replace(t.path);
            }}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>{t.label}</Text>
            {selected && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: 15,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  labelActive: {
    color: '#4285EA',
    fontWeight: '700',
  },
  indicator: {
    marginTop: 6,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#4285EA',
  },
});
