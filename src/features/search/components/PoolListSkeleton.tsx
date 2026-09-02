import React from 'react';
import { StyleSheet, View } from 'react-native';

export function PoolListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 8 }).map((_, idx) => (
        <View key={idx} style={styles.row}>
          <View style={styles.textBlock}>
            <View style={styles.lineLong} />
            <View style={styles.lineShort} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  textBlock: {
    flex: 1,
  },
  lineLong: {
    width: '70%',
    height: 13,
    backgroundColor: '#E5E7EB',
    borderRadius: 21,
    marginBottom: 8,
  },
  lineShort: {
    width: '50%',
    height: 12,
    backgroundColor: '#ECEDF1',
    borderRadius: 21,
  },
});
