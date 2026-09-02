import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RecordDetailScreen() {
  const { date } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.date}>{date as string}</Text>
          <Text style={styles.title}>수영 기록 상세</Text>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>거리</Text>
              <Text style={styles.statValue}>750m</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>시간</Text>
              <Text style={styles.statValue}>00:46:25</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>페이스</Text>
              <Text style={styles.statValue}>2:27/100m</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>평균 심박수</Text>
              <Text style={styles.statValue}>139 bpm</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>칼로리</Text>
              <Text style={styles.statValue}>320 kcal</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>메모</Text>
          <Text style={styles.memo}>
            오늘은 컨디션이 좋았습니다. 평소보다 빠른 페이스로 수영했어요.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  memo: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});
