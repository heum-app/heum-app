import { Button } from '@/components';
import { useBottomSheetStore } from '@/store/commonStore';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SelectOptionSheet from './SelectOptionSheet';

export default function FilterSheet() {
  const [ageRange, setAgeRange] = useState([20, 30]);

  // 화면 상태 ('main' | 'select')
  const [step, setStep] = useState<'main' | 'select'>('main');

  // 현재 선택 옵션 데이터
  const [currentSelect, setCurrentSelect] = useState<{
    title: string;
    value: string;
    setter: (v: string) => void;
    options: string[];
  } | null>(null);

  // 실제 선택되는 값들
  const [scope, setScope] = useState('전체');
  const [stroke, setStroke] = useState('전체');
  const [sort, setSort] = useState('거리');
  const [gender, setGender] = useState('전체');

  const close = useBottomSheetStore((s) => s.close);

  return (
    <View style={styles.container}>
      {/* Select 화면일 때 이걸 먼저 렌더링 */}
      {step === 'select' && currentSelect && (
        <SelectOptionSheet
          title={currentSelect.title}
          selected={currentSelect.value}
          options={currentSelect.options}
          onSelect={(v) => {
            currentSelect.setter(v);
            setStep('main');
          }}
        />
      )}

      {/* 필터 메인 화면 */}
      {step === 'main' && (
        <>
          <View style={styles.topBarContainer}>
            <View style={styles.handleBar} />
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>필터</Text>
          </View>

          {/* 필터 목록 */}
          <View style={styles.listBox}>
            <Row
              title="범위"
              value={scope}
              onPress={() => {
                setCurrentSelect({
                  title: '범위',
                  value: scope,
                  setter: setScope,
                  options: ['전체', '친구'],
                });
                setStep('select');
              }}
            />

            <Row
              title="영법별"
              value={stroke}
              onPress={() => {
                setCurrentSelect({
                  title: '영법별',
                  value: stroke,
                  setter: setStroke,
                  options: ['전체', '자유형', '배영', '평영', '접영'],
                });
                setStep('select');
              }}
            />

            <Row
              title="정렬 기준"
              value={sort}
              onPress={() => {
                setCurrentSelect({
                  title: '정렬 기준',
                  value: sort,
                  setter: setSort,
                  options: ['거리', '시간'],
                });
                setStep('select');
              }}
            />

            <Row
              title="성별"
              value={gender}
              onPress={() => {
                setCurrentSelect({
                  title: '성별',
                  value: gender,
                  setter: setGender,
                  options: ['전체', '남자', '여자'],
                });
                setStep('select');
              }}
            />
          </View>

          {/* 나이대 */}
          <View style={styles.ageBox} onStartShouldSetResponder={() => true}>
            <Text style={styles.rowTitle}>나이대</Text>

            <MultiSlider
              values={ageRange}
              min={10}
              max={70}
              step={1}
              onValuesChange={setAgeRange}
              selectedStyle={{ backgroundColor: '#4285EA' }}
              markerStyle={{
                height: 24,
                width: 24,
                borderRadius: 12,
                backgroundColor: '#FFF',
                borderWidth: 2,
                borderColor: '#4285EA',
              }}
              containerStyle={{ alignSelf: 'center', marginVertical: 16 }}
            />

            <View style={styles.ageInputRow}>
              <View style={styles.ageInput}>
                <Text>{ageRange[0]}</Text>
              </View>
              <Text style={{ fontSize: 18 }}> - </Text>
              <View style={styles.ageInput}>
                <Text>{ageRange[1]}</Text>
              </View>
            </View>
          </View>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <Button title="취소" variant="outline" style={styles.button} onPress={close} />
            <Button
              title="적용하기"
              variant="filled"
              style={styles.button}
              onPress={() => console.log('currentSelect: ', currentSelect)}
            />
          </View>
        </>
      )}
    </View>
  );
}

function Row({ title, value, onPress }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowTitle}>{title}</Text>
      <View style={styles.rowValueContainer}>
        <Text style={styles.rowValue}>{value}</Text>
        <Ionicons name="chevron-forward" size={18} color="#666" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  topBarContainer: {
    alignItems: 'center',
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  listBox: { paddingVertical: 16, gap: 10 },
  row: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowTitle: { fontSize: 16, fontWeight: '600' },
  rowValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowValue: { fontSize: 14, color: '#666' },
  ageBox: {
    backgroundColor: '#F7F7F7',
    padding: 16,
    borderRadius: 16,
  },
  ageInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  ageInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});
