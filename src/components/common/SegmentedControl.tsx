import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const isWeb = Platform.OS === 'web';
const RNMaskedView: any = !isWeb ? require('@react-native-masked-view/masked-view').default : null;

type SegmentedControlProps = {
  options: string[];
  selectedIndex: number;
  position?: Animated.AnimatedInterpolation<number> | Animated.Value;
  alphaValue?: number;
  selectedBackgroundColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  onSelect: (index: number) => void;
};

export default function SegmentedControl({
  options,
  selectedIndex,
  position,
  alphaValue = 1.0,
  selectedBackgroundColor = '#FFFFFF',
  activeTextColor = '#111827',
  inactiveTextColor = '#6B7280',
  onSelect,
}: SegmentedControlProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const translucentBg = `rgba(243, 243, 243, ${alphaValue})`;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const horizontalInset = 8;
  const verticalInset = 4;
  const nativeDriver = !isWeb;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    setTabWidth(width / options.length);
  };

  const translateX =
    position && tabWidth
      ? position.interpolate({
          inputRange: options.map((_, i) => i),
          outputRange: options.map((_, i) => i * tabWidth + horizontalInset / 2),
          extrapolate: 'clamp',
        })
      : translateAnim;

  useEffect(() => {
    if (!position && tabWidth) {
      Animated.spring(translateAnim, {
        toValue: selectedIndex * tabWidth + horizontalInset / 2,
        useNativeDriver: nativeDriver,
        speed: 18,
        bounciness: 7,
      }).start();
    }
  }, [selectedIndex, tabWidth, position, translateAnim, horizontalInset, nativeDriver]);

  // 네이티브 마스크: 전체 높이 사용(상/하 인셋 제거)
  const maskElement =
    tabWidth > 0 ? (
      <Animated.View
        style={[
          styles.mask,
          {
            width: tabWidth - horizontalInset,
            top: 0,
            bottom: 0,
            transform: [{ translateX }],
          },
        ]}
      />
    ) : (
      <View />
    );

  return (
    <View style={[styles.container, { backgroundColor: translucentBg }]} onLayout={handleLayout}>
      {/* 인디케이터 배경(상/하 인셋만 배경에 적용) */}
      <Animated.View
        style={[
          styles.selectedBackground,
          {
            width: tabWidth - horizontalInset,
            top: verticalInset,
            bottom: verticalInset,
            backgroundColor: selectedBackgroundColor,
            transform: [{ translateX }],
          },
        ]}
      />

      {/* 비활성 텍스트 레이어 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View
          style={[styles.row, containerWidth ? { width: containerWidth, height: '100%' } : null]}
        >
          {options.map((option) => (
            <View key={option} style={styles.optionContainer}>
              <Text style={{ color: inactiveTextColor }}>{option}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 활성 텍스트 레이어 */}
      {!isWeb ? (
        <RNMaskedView
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          maskElement={maskElement}
        >
          <View
            style={[styles.row, containerWidth ? { width: containerWidth, height: '100%' } : null]}
          >
            {options.map((option) => (
              <View key={option} style={styles.optionContainer}>
                <Text style={[styles.optionText, { color: activeTextColor }]}>{option}</Text>
              </View>
            ))}
          </View>
        </RNMaskedView>
      ) : (
        // 웹: 전체 높이 기준으로 동일 정렬
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: Math.max(0, tabWidth - horizontalInset),
            overflow: 'hidden',
            transform: [{ translateX }],
            pointerEvents: 'none',
          }}
        >
          <Animated.View
            style={{
              width: containerWidth,
              height: '100%',
              transform: [{ translateX: Animated.multiply(translateX, -1) }],
            }}
          >
            <View style={[styles.row, { width: containerWidth, height: '100%' }]}>
              {options.map((option) => (
                <View key={option} style={styles.optionContainer}>
                  <Text style={[styles.optionText, { color: activeTextColor }]}>{option}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* 터치 영역 */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View
          style={[styles.row, containerWidth ? { width: containerWidth, height: '100%' } : null]}
        >
          {options.map((option, index) => (
            <Pressable
              key={option}
              style={styles.optionContainer}
              onPress={() => onSelect(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 30,
    padding: 3,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    height: '100%',
  },
  optionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBackground: {
    position: 'absolute',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    zIndex: 10,
  },
  mask: {
    position: 'absolute',
    left: 0,
    backgroundColor: '#000',
    borderRadius: 30,
  },
});
