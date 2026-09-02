import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, View } from 'react-native';

export function FloatingButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <View style={styles.button}>
        <BlurView intensity={20} tint="light" style={styles.blur} />
        <AntDesign name="plus" size={24} color="#111" style={styles.icon} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 34,
    right: 24,
  },

  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 10,
  },

  blur: {
    ...StyleSheet.absoluteFillObject,
  },

  icon: {
    zIndex: 10,
  },
});
