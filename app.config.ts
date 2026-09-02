import 'dotenv/config';
import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: 'heum',
  name: 'heum-app',
  slug: 'heum-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: 'src/assets/images/heum-logo.png',
  scheme: 'heumapp',
  // userInterfaceStyle: 'light',
  // newArchEnabled: true,
  splash: {
    image: 'src/assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
    show: false,
    imageStyle: {
      resizeMode: 'contain',
    },
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.heum.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: 'src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.heum.app',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: 'src/assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them with your friends.',
        cameraPermission: 'The app accesses your camera to let you share them with your friends.',
      },
    ],
    [
      'expo-media-library',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos.',
        isAccessMediaLocationEnabled: true,
        granularPermissions: ['audio', 'photo'],
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          usesCleartextTraffic: true, // 안드로이드 9.0 이상에서는 기본적으로 HTTP 트래픽이 차단되기 때문에, HTTP 통신을 위해 필요
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.KAKAO_NATIVE_APP_KEY,
        android: { authCodeHandlerActivity: true },
        ios: { handleKakaoOpenUrl: true },
      },
    ],
    '@react-native-google-signin/google-signin',
    [
      'react-native-health',
      {
        healthSharePermission:
          '애플워치로부터 수영 데이터(워크아웃 기록, 심박수, 소모 칼로리)를 가져와 개인 수영 분석 및 캘린더에 연동하기 위해 건강 권한이 필요합니다.',
        healthUpdatePermission: '수영 기록 데이터를 동기화하기 위해 건강 권한이 필요합니다.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // kakao
    kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY,
    kakaoRestKey: process.env.KAKAO_REST_API_KEY,
    kakaoJsKey: process.env.KAKAO_JS_KEY,

    // naver
    naverClientKey: process.env.NAVER_CLIENT_ID,
    naverSecretKey: process.env.NAVER_CLIENT_SECRET,

    // google
    googleWebKey: process.env.GOOGLE_WEB_CLIENT_ID,
    googleIosKey: process.env.GOOGLE_IOS_CLIENT_ID,
    googleAndroidKey: process.env.GOOGLE_ANDROID_CLIENT_ID,

    // server URL
    apiBaseUrl: process.env.SERVER_URL,
    eas: {
      projectId: process.env.EXPO_PROJECT_ID,

    },
  },
});
