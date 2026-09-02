import { ScreenContainer } from '@/components';
import { useAppStore } from '@/store';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, View as RNView, StyleSheet, Text, View } from 'react-native';

const ONBOARDING_DATA = [
  {
    id: 1,
    content: (
      <>
        스마트워치를 연동해{'\n'}
        모든 수영 기록을 자동으로 {'\n'}
        불러오세요.
      </>
    ),
    isFinal: false,
  },
  {
    id: 2,
    content: (
      <>
        수영 일지를 남기고,{'\n'}
        수영 기록을 피드로 공유하세요.
      </>
    ),
    isFinal: false,
  },
  {
    id: 3,
    content: (
      <>
        나의 성장과 순위를 확인하며{'\n'}
        매일 더 나아가세요.
      </>
    ),
    isFinal: true, // 마지막 페이지임을 표시
  },
];

const TOTAL_PAGES = ONBOARDING_DATA.length; // 실제로는 스와이프 로직에서 처리

export default function OnboardingScreen() {
  const router = useRouter();

  const { setOnboardingCompleted } = useAppStore();

  // 현재 페이지 인덱스 상태
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 현재 페이지 데이터
  const currentItem = ONBOARDING_DATA[currentPageIndex];
  const isLastPage = currentItem.isFinal;

  // 화면 전체 탭하면 호출되는 함수
  const handleNext = () => {
    if (currentPageIndex < TOTAL_PAGES - 1) {
      setCurrentPageIndex(currentPageIndex + 1); // 다음 페이지로 이동
    } else {
      // 마지막 페이지에서 탭하면 인증 화면으로 이동
      router.replace('/(auth)');
    }
  };

  // 인증 화면으로 최종 이동하는 함수 (시작하기 버튼용)
  const handleStart = () => {
    setOnboardingCompleted();
    router.replace('/(auth)');
  };

  // 인디케이터 렌더링 함수
  const renderIndicators = () => {
    return Array.from({ length: TOTAL_PAGES }).map((_, index) => (
      <RNView
        key={index}
        style={[styles.dot, index === currentPageIndex ? styles.activeDot : null]}
      />
    ));
  };

  return (
    <ScreenContainer edges={['bottom']}>
      <Pressable
        style={styles.container}
        onPress={isLastPage ? undefined : handleNext} // 마지막 페이지가 아니면 handleNext 호출
      >
        <RNView style={{ flex: 1 }} />

        {/* 상단 콘텐츠 영역 */}
        <View style={styles.contentSection}>
          <RNView style={styles.header}>
            <Image
              source={require('@/assets/images/heum-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <RNView style={styles.indicatorContainer}>{renderIndicators()}</RNView>
          </RNView>

          {/* 텍스트 */}
          <Text style={styles.content}>{currentItem.content}</Text>
        </View>

        {/* 2. 하단 버튼 영역 */}
        <RNView style={styles.bottomSection}>
          {!isLastPage ? (
            // 💡 마지막 페이지가 아닐 때: "탭하여 계속하기"
            <Text style={styles.tabButtonText}>탭하여 계속하기</Text>
          ) : (
            // 💡 마지막 페이지일 때: "시작하기" 버튼
            <Pressable style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>시작하기</Text>
            </Pressable>
          )}
        </RNView>
      </Pressable>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },

  contentSection: {
    flex: 1,
  },

  header: {
    marginBottom: 30,
  },

  logo: {
    width: 100,
    height: 100,
  },

  indicatorContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#111827',
    width: 16,
  },

  content: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 32,
  },

  bottomSection: {
    flex: 1,
    paddingBottom: 40, // 하단에서 띄우는 간격
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 100, // 버튼 영역 높이 확보
  },

  tabButtonText: {
    color: '#5D5D5B',
    fontSize: 14,
    padding: 16,
  },

  startButton: {
    backgroundColor: '#4285EA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
