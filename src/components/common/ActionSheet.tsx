import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export interface Action {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  actions?: Action[];
  children?: React.ReactNode;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

/**
 * ActionSheet — 하단에서 부드럽게 등장하는 공통 액션 시트 컴포넌트
 *
 * 특징:
 * - iOS/Android 공통 스타일의 Bottom Sheet 인터랙션
 * - `visible` prop으로 등장/퇴장 제어
 * - `actions` 배열에 따라 버튼 개수 동적으로 조정
 * - `destructive` 속성으로 삭제 등 위험한 액션 강조 표시 (빨간색)
 * - 자연스러운 Fade + Slide 애니메이션 (Easing.cubic)
 *
 * 사용 예시:
 * <ActionSheet
 *   visible={!!activeType}
 *   onClose={() => setActiveType(null)}
 *   actions={[
 *     { label: '수정', onPress: handleEdit },
 *     { label: '삭제', onPress: handleDelete, destructive: true },
 *   ]}
 * />
 */
export const ActionSheet: React.FC<Props> = ({ visible, onClose, actions, children }) => {
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // ActionSheet가 열릴 때 Light 햅틱
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT * 0.9, // 완전 밑까지 말고 살짝 남기기 (자연스럽게 사라짐)
          duration: 250,
          easing: Easing.inOut(Easing.cubic), // 닫힐 때 천천히 감속
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsMounted(false);
        translateY.setValue(SCREEN_HEIGHT); // 깔끔하게 초기화
      });
    }
  }, [visible]);

  if (!isMounted) return null;

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlayContainer}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
            children ? { paddingTop: 0 } : undefined,
          ]}
        >
          {children
            ? children
            : (actions || []).map((action, idx) => (
                <Pressable
                  key={idx}
                  style={styles.button}
                  onPress={() => {
                    onClose();
                    setTimeout(action.onPress, 150);
                  }}
                >
                  <Text style={[styles.label, action.destructive && styles.destructive]}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 32,
    paddingTop: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#111',
  },
  destructive: {
    color: '#E15C4E',
    fontWeight: '600',
  },
});
