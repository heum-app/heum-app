import { StyleSheet, Text, View } from 'react-native';

export function FeedStatsSection() {
  return (
    <View style={styles.container}>
      {[
        { label: '포스트', count: 59 },
        { label: '팔로워', count: 112 },
        { label: '팔로잉', count: 211 },
      ].map((item) => (
        <View key={item.label}>
          <Text style={styles.count}>{item.count}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 50,
    paddingVertical: 50,
    paddingHorizontal: 5,
  },
  count: { fontWeight: 'bold' },
  label: { color: '#5B5B59' },
});
