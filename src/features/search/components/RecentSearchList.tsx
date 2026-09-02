import { useSearchStore } from '@/store/commonStore';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

export const RecentSearchList = React.memo(function RecentSearchList() {
  const { recent, setKeyword, removeRecent } = useSearchStore(
    useShallow((s) => ({
      recent: s.recent,
      setKeyword: s.setKeyword,
      removeRecent: s.removeRecent,
    })),
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={recent}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => {
              setKeyword(item);
            }}
          >
            <Entypo name="back-in-time" size={18} style={{ marginRight: 10 }} />
            {/* 검색어 */}
            <Text style={styles.keyword}>{item}</Text>
            {/* 검색어 삭제 버튼 */}
            <Pressable onPress={() => removeRecent(item)} hitSlop={10}>
              <Ionicons name="close-outline" size={18} />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ padding: 16, color: '#777' }}>최근 검색어가 없습니다.</Text>
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  keyword: { flex: 1, fontSize: 15 },
});
