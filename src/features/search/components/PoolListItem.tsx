import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PoolListItemProps } from '../type';

export const PoolListItem = React.memo(
  function PoolListItem({ pool, isFavorite, onToggle, onSelect }: PoolListItemProps) {
    return (
      <Pressable style={styles.container} onPress={() => onSelect(pool.id)}>
        {/* 수영장 이름, 위치 정보 */}
        <View>
          <Text style={styles.name}>{pool.name}</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location-sharp" size={18} color="#aaa" />
            <Text style={styles.address}>{pool.address}</Text>
          </View>
        </View>
        {/* 즐겨찾기 토글 버튼 */}
        <Pressable onPress={() => onToggle(pool.id)}>
          <AntDesign name="pushpin" size={20} color={isFavorite ? '#111' : '#ddd'} />
        </Pressable>
      </Pressable>
    );
  },

  (prev, next) => prev.isFavorite === next.isFavorite && prev.pool.id === next.pool.id,
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  addressContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  address: {
    color: '#6B7280',
    fontSize: 14,
  },
});
