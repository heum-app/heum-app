import { Ionicons } from '@expo/vector-icons';
import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function BadgeCard({ item, selected, onSelect }) {
  const confettiRef = useRef(null);

  const isSelected = selected === item.id;

  return (
    <Pressable
      style={[styles.card, isSelected && styles.cardAchieved]}
      onPress={() => onSelect(item.id)}
    >
      {/* 카드 내용 */}
      <View style={styles.rowBetween}>
        <View style={styles.selectBox}>
          {isSelected ? (
            <View style={styles.badgeCircle}>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </View>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </View>
        <Text style={styles.image}>{item.emoji}</Text>
        <Text style={styles.cardTitle}>{item.label}</Text>
      </View>
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
    width: '32%',
  },
  cardAchieved: {
    borderColor: '#3B82F6',
    backgroundColor: '#F3F8FF',
  },
  rowBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectBox: { position: 'absolute', right: 0, top: 0 },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
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
  image: {
    fontSize: 50,
    marginTop: 40,
  },
});
