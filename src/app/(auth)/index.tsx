import { useLoginMutation } from '@/hooks/queries/useAuthMutations';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
  const loginMutation = useLoginMutation();

  // Google Sign-In 초기 설정
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Constants.expoConfig.extra.googleWebKey,
      iosClientId: Constants.expoConfig.extra.googleIosKey,
      offlineAccess: false,
    });
  }, []);

  /** 네이버 로그인 */
  const handleNaverLogin = async () => {
    const initialOptions = {
      consumerKey: Constants.expoConfig.extra.naverClientKey,
      consumerSecret: Constants.expoConfig.extra.naverSecretKey,
      appName: 'heum-app',
      serviceUrlScheme: 'heumapp', // Android
      serviceUrlSchemeIOS: 'heumapp', // iOS
    };

    try {
      await NaverLogin.initialize(initialOptions);
      const result = await NaverLogin.login();

      if (result.isSuccess) {
        const accessToken = result.successResponse.accessToken;

        loginMutation.mutate({
          provider: 'NAVER',
          socialToken: accessToken,
        });
      } else {
        console.log('네이버 로그인 실패:', result.failureResponse);
      }
    } catch (e) {
      console.error('네이버 로그인 오류:', e);
    }
  };

  /** 카카오 로그인 */
  const handleKakaoLogin = async () => {
    try {
      const result = await KakaoLogin.login();

      const accessToken = result.accessToken;

      loginMutation.mutate({
        provider: 'KAKAO',
        socialToken: accessToken,
      });
    } catch (e) {
      console.error('KAKAO 로그인 오류:', e);
    }
  };

  /** 구글 로그인 */
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.data?.idToken) {
        loginMutation.mutate({
          provider: 'GOOGLE',
          socialToken: response.data.idToken,
        });
      } else {
        console.warn('Google 로그인 요청이 아직 준비되지 않았습니다.');
      }
    } catch (e) {
      console.error('GOOGLE 로그인 에러:', e);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('@/assets/images/heum-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>환영합니다!</Text>
        <Text style={styles.subtitle}>
          3초 만에 가입하고,{'\n'}나만의 훈련 기록을 지금 바로 시작하세요.
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        {/* Naver */}
        <Pressable
          style={[styles.snsButton, { backgroundColor: '#03C75A' }]}
          onPress={handleNaverLogin}
        >
          <Image source={require('@/assets/images/naver_logo.png')} style={styles.snsIcon} />
          <Text style={[styles.snsText, { color: '#fff' }]}>네이버로 시작하기</Text>
        </Pressable>

        {/* Kakao */}
        <Pressable
          style={[styles.snsButton, { backgroundColor: '#FEE500' }]}
          onPress={handleKakaoLogin}
        >
          <Image source={require('@/assets/images/kakao_logo.png')} style={styles.snsIcon} />
          <Text style={[styles.snsText, { color: '#000' }]}>카카오로 시작하기</Text>
        </Pressable>

        {/* Google */}
        <Pressable
          style={[
            styles.snsButton,
            { backgroundColor: '#fff', borderWidth: 1, borderColor: '#DADCE0' },
          ]}
          onPress={handleGoogleLogin}
        >
          <Image source={require('@/assets/images/google_logo.png')} style={styles.snsIcon} />
          <Text style={[styles.snsText, { color: '#3C4043' }]}>구글로 시작하기</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  },
  logoSection: {
    alignItems: 'flex-start',
    marginBottom: 80,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  snsButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  snsIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    left: 14,
  },
  snsText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
