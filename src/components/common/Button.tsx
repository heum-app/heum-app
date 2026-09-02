import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

export type AppButtonVariant =
  | 'filled'
  | 'outline'
  | 'gray'
  | 'gray-outline'
  | 'ghost'
  | 'underlined';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

/**
 * 공통 버튼 컴포넌트(Button)
 *
 * - Filled / Outline / Gray 스타일을 선택적으로 사용할 수 있음
 * - 팔로우 버튼, 로그인 버튼 등 다양한 화면에서 재사용 가능
 * - 기본적으로 width: '100%' + 둥근 모양(button radius 14)
 * - 외부에서 style, textStyle 로 자유롭게 스타일 오버라이드 가능
 *
 * 사용 예시:
 * <Button title="팔로우" variant="outline" onPress={handleFollow} />
 * <Button title="로그인" variant="filled" onPress={handleLogin} />
 * <Button title="팔로잉" variant="gray" onPress={handleUnfollow} />
 */
export function Button({
  title,
  onPress,
  variant = 'filled',
  style,
  textStyle,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        variant === 'filled' && styles.filled,
        variant === 'outline' && styles.outline,
        variant === 'gray' && styles.gray,
        variant === 'gray-outline' && styles.grayOutline,
        variant === 'ghost' && styles.ghost,
        variant === 'underlined' && styles.underlined,
        style,
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.baseText,
          variant === 'filled' && styles.filledText,
          variant === 'outline' && styles.outlineText,
          variant === 'gray' && styles.grayText,
          variant === 'gray-outline' && styles.grayOutlineText,
          variant === 'ghost' && styles.ghostText,
          variant === 'underlined' && styles.underlinedText,
          textStyle,
          disabled && styles.disabledText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontWeight: '600',
    fontSize: 15,
  },
  /* Filled (파란 배경) */
  filled: {
    backgroundColor: '#4285EA',
  },
  filledText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  /* Outline */
  outline: {
    borderWidth: 1,
    borderColor: '#4285EA',
    backgroundColor: '#FFFFFF',
  },
  outlineText: {
    color: '#4285EA',
    fontWeight: '600',
    fontSize: 15,
  },
  /* Gray */
  gray: {
    backgroundColor: '#F3F3F3',
  },
  grayText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  disabled: {
    backgroundColor: '#4285EA60',
  },
  disabledText: {
    color: '#FFFFFF',
  },
  /* Gray Outline */
  grayOutline: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
  },
  grayOutlineText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  /* Ghost */
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  /* Underlined */
  underlined: {
    backgroundColor: 'transparent',
  },
  underlinedText: {
    color: '#333',
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '400',
  },
});
