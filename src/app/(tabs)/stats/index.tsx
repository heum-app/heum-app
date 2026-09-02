import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function WeekStatsScreen() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Week Stats Page: Data Fetching Started.');

    setTimeout(() => {
      setData('Week');
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.content}>
      <View style={styles.placeholder}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#9CA3AF" />
        ) : (
          <Text style={styles.placeholderText}>{data} 통계 데이터</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});
