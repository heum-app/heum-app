import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function MenuItem({ icon, text, onPress }: any) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.left}>
        {icon}
        <Text style={styles.text}>{text}</Text>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { color: '#111827' },
});
