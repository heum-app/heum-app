import React from 'react';
import { StyleSheet, View } from 'react-native';

export function UserListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.textBlock}>
            <View style={styles.lineShort} />
            <View style={styles.lineLong} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
  },
  textBlock: {
    marginLeft: 12,
    flex: 1,
  },
  lineShort: {
    width: '40%',
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineLong: {
    width: '70%',
    height: 12,
    backgroundColor: '#ECEDF1',
    borderRadius: 6,
  },
});
