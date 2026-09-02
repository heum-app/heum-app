import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, NativeModules, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import AppleHealthKitOriginal, { HealthKitPermissions } from 'react-native-health';

import { useAppStore } from '@/store';

// New Architecture / Bridgeless Mode 대응: NativeModules가 초기 로드 시점(load-time)에 비어있는 이슈를 해결하기 위해
// 실행 시점(run-time)에 동적으로 모듈을 가져옵니다.
const getAppleHealthKit = () => {
  return NativeModules.AppleHealthKit || NativeModules.RCTAppleHealthKit;
};

export function SmartWatchItem() {
  const isConnected = useAppStore((s) => s.isWatchConnected);
  const setIsWatchConnected = useAppStore((s) => s.setIsWatchConnected);

  const handlePress = () => {
    if (isConnected) {
      // 연동 해제 처리
      Alert.alert(
        '스마트 워치 연동 해제',
        '스마트 워치 연동을 해제하시겠습니까? 해제 시 수영 기록이 자동으로 동기화되지 않습니다.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '해제',
            style: 'destructive',
            onPress: () => {
              setIsWatchConnected(false);
              Alert.alert('연동 해제 완료', '스마트 워치 연동이 해제되었습니다.');
            },
          },
        ],
      );
    } else {
      // Android 플랫폼 예외 처리
      if (Platform.OS === 'android') {
        Alert.alert(
          '연동 불가능',
          '안드로이드 기기에서는 Apple 건강(HealthKit) 연동을 지원하지 않습니다.',
        );
        return;
      }

      const AppleHealthKit = getAppleHealthKit();

      // Native Module 존재 여부 체크 (Expo Go 방어 코드)
      if (!AppleHealthKit || typeof AppleHealthKit.isAvailable !== 'function') {
        Alert.alert(
          '연동 불가능',
          '현재 테스트 환경(Expo Go 등)에서는 건강 데이터 연동을 사용할 수 없습니다.\n\n터미널에서 "npm run ios" 명령어를 실행하여 개발 빌드로 앱을 실행해야 HealthKit이 탑재됩니다.',
        );
        return;
      }

      // HealthKit 사용 가능 여부 체크
      AppleHealthKit.isAvailable((err: any, available: boolean) => {
        if (err || !available) {
          console.warn('[HealthKit] isAvailable failed:', err, 'available:', available);
          Alert.alert(
            '연동 불가능',
            '이 기기는 Apple 건강(HealthKit) 데이터 연동을 지원하지 않습니다. (개발 빌드(npm run ios)가 필요합니다.)',
          );
          return;
        }

        const permissions: HealthKitPermissions = {
          permissions: {
            read: [
              AppleHealthKitOriginal.Constants.Permissions.Workout,
              AppleHealthKitOriginal.Constants.Permissions.HeartRate,
              AppleHealthKitOriginal.Constants.Permissions.ActiveEnergyBurned,
              AppleHealthKitOriginal.Constants.Permissions.DistanceSwimming,
            ],
            write: [],
          },
        };

        // 건강 권한 요청
        AppleHealthKit.initHealthKit(permissions, (initErr: any) => {
          if (initErr) {
            console.warn('[HealthKit] Init Error:', initErr);
            Alert.alert(
              '연동 실패',
              'Apple 건강 권한 요청을 처리할 수 없습니다. 설정 > 건강 앱에서 권한을 수동으로 허용해 주세요.',
            );
            return;
          }

          // 연결 상태 활성화
          setIsWatchConnected(true);
          Alert.alert(
            '연동 완료',
            '스마트 워치(Apple 건강) 연동이 완료되었습니다. 메인 화면 진입 시 기록이 자동으로 동기화됩니다.',
          );
        });
      });
    }
  };

  return (
    <Pressable style={styles.item} onPress={handlePress}>
      <View style={styles.left}>
        <Ionicons name="watch" size={18} color="black" />
        <Text style={styles.text}>스마트 워치</Text>
      </View>

      <View style={styles.right}>
        <View style={[styles.dot, isConnected ? styles.green : styles.red]} />
        <Text>{isConnected ? '연결됨' : '연결 안됨'}</Text>

        <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  green: { backgroundColor: '#56D953' },
  red: { backgroundColor: '#EF4444' },
  text: { color: '#111827' },
});
