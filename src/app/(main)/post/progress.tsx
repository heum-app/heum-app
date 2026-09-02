import { GoalCard } from '@/features/post/components/GoalCard';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// 더미 목표 데이터
const goals = [
  {
    id: 'week',
    label: '주간 목표',
    current: 4000,
    total: 4000,
    percentage: 100,
    achieved: true,
  },
  {
    id: 'month',
    label: '월간 목표',
    current: 12200,
    total: 20000,
    percentage: 61,
  },
  {
    id: 'year',
    label: '연간 목표',
    current: 142000,
    total: 200000,
    percentage: 71,
  },
];

export default function CreateFeedProgressScreen() {
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
        {goals.map((goal) => (
          <GoalCard key={goal.id} item={goal} selected={selected} onSelect={setSelected} />
        ))}

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
