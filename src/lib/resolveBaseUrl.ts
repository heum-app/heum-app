import { Platform } from 'react-native';

const ANDROID_EMULATOR_LOCALHOST = '10.0.2.2';

/**
 * Android 에뮬레이터에서 localhost → 10.0.2.2 자동 변환
 * iOS / 실기기 / 프로덕션 URL은 그대로 유지
 */
export function resolveBaseUrl(url: string): string {
  if (Platform.OS === 'android') {
    return url
      .replace('://localhost', `://${ANDROID_EMULATOR_LOCALHOST}`)
      .replace('://127.0.0.1', `://${ANDROID_EMULATOR_LOCALHOST}`);
  }
  return url;
}
