import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * 앱 전역에서 사용되는 기본 카드 래퍼 컴포넌트입니다.
 * 그림자, 둥근 모서리, 흰색 배경을 제공합니다.
 */
export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F3F3F3',
  },
});
