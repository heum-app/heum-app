import { ScreenContainer } from '@/components';
import { FAQAccordion, FAQCard, FAQSearchInput } from '@/features/my/components/faq';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const FAQ_LIST = [
  {
    id: '1',
    question: '비밀번호를\n잊어버렸을 때 어떻게\n재설정하나요?',
    answer:
      '로그인 화면의 [비밀번호 찾기]를 통해 가입하신 이메일로 비밀번호 재설정 링크를 받을 수 있습니다.',
  },
  {
    id: '2',
    question: '여러 기기에서\n동일 계정으로\n사용할 수 있나요?',
    answer: '네, 가능합니다. 여러 기기에서 로그인하시면 데이터가 실시간으로 동기화됩니다.',
  },
  {
    id: '3',
    question: '회원 탈퇴는\n어디서 하나요?',
    answer: '마이페이지 > 내 정보 > 하단의 [회원 탈퇴] 버튼을 통해 진행하실 수 있습니다.',
  },
];

const HOW_TO_USE = [
  {
    id: '1',
    title: '스마트워치 연동하기',
    content: '마이페이지의 [스마트워치 연동] 메뉴에서 안내에 따라 기기를 블루투스로 연결해 주세요.',
  },
  {
    id: '2',
    title: '기록 작성하기',
    content: '홈 화면 우측 하단의 [+] 버튼을 눌러 새로운 활동 기록을 추가할 수 있습니다.',
  },
  {
    id: '3',
    title: '오늘의 기록 공유하기',
    content: '기록 상세 페이지에서 우측 상단의 [공유] 버튼을 눌러 SNS에 기록을 공유해보세요.',
  },
];

export default function FAQScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleCardPress = (item: { id: string; question: string; answer: string }) => {
    router.push({
      pathname: '/(modal)/faq-answer',
      params: { question: item.question, answer: item.answer },
    });
  };

  // 검색 결과 필터링
  const filteredFaq = FAQ_LIST.filter(
    (item) => item.question.includes(searchQuery) || item.answer.includes(searchQuery),
  );
  const filteredHowToUse = HOW_TO_USE.filter(
    (item) => item.title.includes(searchQuery) || item.content.includes(searchQuery),
  );

  const hasSearchResults = filteredFaq.length > 0 || filteredHowToUse.length > 0;

  return (
    <ScreenContainer edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* 헤더 타이틀 영역 */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>
            <Text style={styles.mainTitleBold}>무엇을</Text>
            {'\n'}도와드릴까요?
          </Text>
          <Text style={styles.subTitle}>
            궁금한 점이 있으신가요?{'\n'}자주 묻는 질문을 통해 문제를 빠르게 해결하세요.
          </Text>
        </View>

        {/* 검색 바 */}
        <FAQSearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* 검색 중일 때의 뷰 */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            {!hasSearchResults ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={48} color="#E5E7EB" />
                <Text style={styles.emptyText}>'{searchQuery}'에 대한 검색 결과가 없습니다.</Text>
              </View>
            ) : (
              <View style={styles.accordionGroup}>
                {filteredFaq.map((item, index) => (
                  <FAQAccordion
                    key={`faq-${item.id}`}
                    title={item.question.replace(/\n/g, ' ')}
                    content={item.answer}
                    isLast={index === filteredFaq.length - 1 && filteredHowToUse.length === 0}
                  />
                ))}
                {filteredHowToUse.map((item, index) => (
                  <FAQAccordion
                    key={`howto-${item.id}`}
                    title={item.title}
                    content={item.content}
                    isLast={index === filteredHowToUse.length - 1}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          /* 기본 화면 뷰 */
          <View>
            {/* 자주 묻는 질문 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>자주 묻는 질문</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScrollView}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {FAQ_LIST.map((item, index) => (
                  <FAQCard
                    key={item.id}
                    question={item.question}
                    style={index === FAQ_LIST.length - 1 ? { marginRight: 0 } : undefined}
                    onPress={() => handleCardPress(item)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* 헤엄 사용 방법 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>헤엄 사용 방법</Text>
              <View style={styles.accordionGroup}>
                {HOW_TO_USE.map((item, index) => (
                  <FAQAccordion
                    key={item.id}
                    title={item.title}
                    content={item.content}
                    isLast={index === HOW_TO_USE.length - 1}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    color: '#111827',
    fontWeight: '300',
    lineHeight: 38,
    marginBottom: 12,
  },
  mainTitleBold: {
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 16,
  },
  horizontalScrollView: {
    marginHorizontal: -16,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
  },
  accordionGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  searchResultsContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
  bottomSheetContainer: {
    padding: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 28,
  },
  bottomSheetContent: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});
