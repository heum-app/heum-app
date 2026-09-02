import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Switch({ value, onValueChange, disabled = false }: Props) {
  const animated = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: value ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [value]);

  // 트랙 배경 색상
  const trackColor = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E7E7E7', '#4285EA'], // off → on
  });

  // thumb 이동
  const translateX = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.container, disabled && { opacity: 0.4 }]}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]} />

      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 24,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: 24,
    borderRadius: 12,
    position: 'absolute',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
});
