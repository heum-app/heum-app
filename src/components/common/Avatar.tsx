import { Image, StyleSheet, Text, View } from 'react-native';

/**
 * @file Avatar.tsx
 * @description
 * - 이미지를 표시하거나 fallbackText의 첫 글자를 표시
 * - size prop으로 다양한 크기 대응
 */

type AvatarProps = {
  src?: any; // 이미지 경로
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  style?: any;
};

export function Avatar({ src, fallbackText = '', size = 'md', style }: AvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 76,
    xxl: 90,
  };

  const avatarSize = sizeMap[size];
  const initials = fallbackText?.[0] || '?';

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      {src ? (
        <Image
          source={typeof src === 'string' ? { uri: src } : src}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: avatarSize / 2,
          }}
          resizeMode="cover"
          onError={(e) => console.log('이미지 에러 발생:', e.nativeEvent.error)}
        />
      ) : (
        <Text
          style={[
            styles.fallbackText,
            {
              fontSize: avatarSize / 2.5,
            },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#E5E7EB', // bg-gray-200
  },
  fallbackText: {
    color: '#6B7280', // text-gray-500
    fontWeight: '600',
  },
});
