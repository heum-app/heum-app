import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function GoalCard({ item, selected, onSelect }) {
  const confettiRef = useRef(null);

  //   const [cardLayout, setCardLayout] = useState({ width: 0, height: 0 });

  const barWidth = `${item.percentage}%` as any;
  const isSelected = selected === item.id;

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardAchieved]}
      onPress={() => onSelect(item.id)}
    >
      {/* 카드 내용 */}
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.cardTitle}>
            {item.label} {item.achieved ? '달성!' : ''}
            {item.achieved && <Text> 🏅</Text>}
          </Text>

          <Text style={styles.cardSub}>
            {item.current.toLocaleString()} km / {item.total.toLocaleString()} km
          </Text>
        </View>

        {isSelected ? (
          <View style={styles.badgeCircle}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </View>
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: barWidth }]} />
      </View>

      <Text style={styles.percentText}>{item.percentage}%</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  cardAchieved: {
    borderColor: '#3B82F6',
    backgroundColor: '#F3F8FF',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  badgeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarBg: {
    marginTop: 14,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  percentText: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
});
