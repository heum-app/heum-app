import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface Option {
  value: boolean;
  label: string;
}

interface Props {
  selectedValue: boolean;
  onValueChange: (value: boolean) => void;
  options: Option[];
  disabled?: boolean;
}

function SingleRadio({
  selected,
  onPress,
  label,
  disabled,
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
  disabled: boolean;
}) {
  const animated = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: selected ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [selected, animated]);

  // 바깥 테두리 색상
  const borderColor = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D1D1D1', '#4285EA'], // 비활성(회색) → 활성(파란색)
  });

  // 내부 점(Dot) 크기 애니메이션
  const innerScale = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={() => !disabled && onPress()}
      style={[styles.itemContainer, disabled && { opacity: 0.4 }]}
    >
      <Animated.View style={[styles.outerCircle, { borderColor }]}>
        <Animated.View style={[styles.innerDot, { transform: [{ scale: innerScale }] }]} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export function RadioButton({ selectedValue, onValueChange, options, disabled = false }: Props) {
  return (
    <View style={styles.groupContainer}>
      {options.map((opt, index) => (
        <SingleRadio
          key={index}
          selected={selectedValue === opt.value}
          onPress={() => onValueChange(opt.value)}
          label={opt.label}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4285EA',
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
