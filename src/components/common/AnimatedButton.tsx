import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface AnimatedButtonProps {
  visible: boolean;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: (event: GestureResponderEvent) => void;

  /** 버튼 크기 지정 */
  width?: number;
  height?: number;

  /** 아이콘 크기 지정 */
  iconSize?: number;

  /** 배경색 */
  color?: string;

  /** 텍스트 스타일 */
  textStyle?: TextStyle;

  /** 추가 스타일 */
  style?: ViewStyle;
}

/**
 * AnimatedButton — 자연스럽게 등장/퇴장하는 공통 버튼 컴포넌트
 *
 * 특징:
 * - 나타날 때 Fade + Scale 애니메이션
 * - `icon`, `label` 모두 optional (둘 중 하나만 or 둘 다 가능)
 * - 버튼 크기(`width`, `height`)와 아이콘 크기(`iconSize`)를 독립적으로 조정 가능
 * - 다양한 색상(`color`) 및 스타일 오버라이드 지원
 *
 * 예시:
 * <AnimatedButton visible icon="arrow-up" onPress={handleSend} />
 * <AnimatedButton visible label="등록" width={90} height={40} />
 * <AnimatedButton visible icon="cloud-upload" iconSize={24} width={48} height={48} />
 */
export function AnimatedButton({
  visible,
  label,
  icon,
  onPress,
  width = 52,
  height = 36,
  iconSize = 20,
  color = '#4285EA',
  textStyle,
  style,
}: AnimatedButtonProps) {
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0.9)).current;
  const animatedWidth = useRef(new Animated.Value(visible ? width : 0)).current;
  const [shouldRender, setShouldRender] = useState(visible);
  const animatedMargin = useRef(new Animated.Value(visible ? 10 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
    }

    Animated.parallel([
      // 1. 너비 애니메이션
      Animated.timing(animatedWidth, {
        toValue: visible ? width : 0,
        duration: 180,
        useNativeDriver: false,
      }),
      // 2. 마진 애니메이션 추가 (10px -> 0px)
      Animated.timing(animatedMargin, {
        toValue: visible ? 10 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
      // 3. 투명도 애니메이션
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
      // 4. 스케일 애니메이션
      Animated.spring(scale, {
        toValue: visible ? 1 : 0.9,
        friction: 6,
        tension: 100,
        useNativeDriver: false,
      }),
    ]).start(({ finished }) => {
      if (finished && !visible) {
        // 애니메이션이 완전히 끝난 후 레이아웃에서 제거
        setShouldRender(false);
      }
    });
  }, [visible, width]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          // marginLeft를 Animated.Value로 대체
          marginLeft: animatedMargin,
          width: animatedWidth,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        style={[
          styles.button,
          {
            width: '100%',
            height,
            borderRadius: height / 2,
            backgroundColor: color,
          },
          style,
        ]}
        onPress={onPress}
      >
        {icon && <Ionicons name={icon} size={iconSize} color="white" />}
        {label && <Text style={[styles.label, textStyle]}>{label}</Text>}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
