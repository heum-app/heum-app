import { useToastStore } from '@/store/commonStore';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Toast() {
  const { visible, message, undoText, onUndo, hide } = useToastStore();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { top: insets.top + 10 }]}>
      <Text style={styles.message}>{message}</Text>

      {undoText && (
        <Pressable
          onPress={() => {
            onUndo?.();
            hide();
          }}
        >
          <Text style={styles.undo}>{undoText}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(17, 17, 17, 0.92)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  message: {
    color: '#FFFFFF',
    fontSize: 14,
    flexShrink: 1,
  },

  undo: {
    color: '#4DA6FF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 16,
  },
});
