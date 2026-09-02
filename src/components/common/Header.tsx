import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title?: string;
  onBack?: () => void;
  rightItems?: React.ReactNode[];
  bgColor?: string;
  titleColor?: string;
}

export function Header({
  title,
  onBack,
  rightItems = [],
  bgColor = 'white',
  titleColor = 'black',
}: Props) {
  const insets = useSafeAreaInsets();

  const RoundedIconWrapper = ({ children }: any) =>
    bgColor === 'transparent' ? (
      <View style={styles.blurWrapper}>
        <BlurView intensity={40} tint="light" style={styles.blurButton}>
          {children}
        </BlurView>
      </View>
    ) : (
      <View>{children}</View>
    );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: bgColor,
        },
      ]}
    >
      {/* 뒤로가기 버튼 */}
      <View style={styles.left}>
        {onBack && (
          <RoundedIconWrapper>
            <Pressable onPress={onBack} hitSlop={10}>
              <Ionicons name="chevron-back" size={26} color={titleColor} />
            </Pressable>
          </RoundedIconWrapper>
        )}
      </View>

      {/* 타이틀 */}
      <View style={styles.center}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      </View>

      {/* 우측 버튼 영역 */}
      <View style={styles.right}>
        {rightItems.length > 0 && (
          <View style={styles.rightGroup}>
            {rightItems.map((item, i) => (
              <RoundedIconWrapper key={i}>{item}</RoundedIconWrapper>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  blurWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  blurButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
