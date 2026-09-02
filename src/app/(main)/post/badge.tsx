import { BadgeCard } from '@/features/post/components/BadgeCard';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// 더미 배지 데이터
export const badges = [
  {
    id: 'morning-swimmer',
    label: '아침 수영인',
    emoji: '☀️',
    description: '아침 시간에 꾸준히 수영을 진행했어요!',
    achieved: true,
  },
  {
    id: 'consistency-master',
    label: '꾸준함의 달인',
    emoji: '👏',
    description: '지속적으로 훈련하며 목표를 향해 달려갔어요!',
    achieved: true,
  },
  {
    id: 'challenger',
    label: '도전자',
    emoji: '🧍‍♂️',
    description: '새로운 목표에 도전한 당신! 멋져요.',
    achieved: false,
  },
  {
    id: 'endurance-king',
    label: '격려왕',
    emoji: '📣',
    description: '꾸준한 응원과 격려를 실천했어요.',
    achieved: false,
  },
  {
    id: 'iron',
    label: '철인',
    emoji: '💪',
    description: '강인한 체력으로 수영을 완주했어요!',
    achieved: true,
  },
  {
    id: 'sprinter',
    label: '스프린터',
    emoji: '🔥',
    description: '폭발적인 스피드로 단거리 기록을 냈어요!',
    achieved: false,
  },
  {
    id: 'speed-king',
    label: '속도왕',
    emoji: '⚡️',
    description: '빠른 페이스로 자신의 한계를 넘어섰어요!',
    achieved: true,
  },
  {
    id: 'first-challenge',
    label: '첫 챌린지 달성',
    emoji: '🚀',
    description: '첫 번째 챌린지를 성공적으로 완료했어요!',
    achieved: true,
  },
  {
    id: 'weekly-challenger',
    label: '주간 챌린저',
    emoji: '🎯',
    description: '일주일 동안 꾸준히 목표를 수행했어요!',
    achieved: false,
  },
];

export default function CreateFeedBadgeScreen() {
  const [text, setText] = useState('');
  const [selected, setSelected] = useState(0);

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      extraScrollHeight={20} // 인풋이 키보드 위로 좀 더 올라오게
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.badgeContainer}>
          {badges.map((badge) => (
            <BadgeCard key={badge.id} item={badge} selected={selected} onSelect={setSelected} />
          ))}
        </View>

        {/* 텍스트 입력 */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="공유할 내용을 작성해 주세요."
            placeholderTextColor="#999"
            multiline
            style={styles.input}
          />
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 16,
  },
  input: { minHeight: 140, fontSize: 16, color: '#222', lineHeight: 22 },
});
