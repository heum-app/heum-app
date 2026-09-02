import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const EmptyResult = React.memo(function EmptyResult() {
  return (
    <View style={styles.container}>
      <Ionicons name="sad-outline" size={60} color="#BFC4CB" />

      <Text style={styles.title}>앗, 결과가 없네요.</Text>
      <Text style={styles.sub}>다른 키워드로 검색해보세요!</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    color: '#6B7280',
  },
});
