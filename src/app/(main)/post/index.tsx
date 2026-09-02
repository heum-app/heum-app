import { Switch } from '@/components';
import { SwimRecord } from '@/features/record/type';
import { useToastStore } from '@/store/commonStore';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { EventEmitter } from 'expo-modules-core';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const dummySwimRecord: SwimRecord = {
  id: 1,
  date: '2025-05-02',
  totalDistance: 750, // 750m
  totalSeconds: 2785, // 46분 25초 (750m 페이스 2:27/100m과 동일)
  startTime: '2025-05-02T14:21:00Z',
  endTime: '2025-05-02T15:07:25Z',
  calories: 342,
  averageHeartRate: 139,
  pace: '2:27',
  poolLength: 25,
  source: 'auto',
  pool: {
    id: 12,
    name: '송도스포츠파크 수영장',
  },
  user: {
    id: 101,
  },
};

const sampleImages = [
  'https://i.pinimg.com/736x/e1/53/a7/e153a73423354af79c237df5f34aa313.jpg',
  'https://i.pinimg.com/1200x/4a/cf/a1/4acfa107685b60825948d500a5917423.jpg',
  'https://i.pinimg.com/736x/f4/34/1d/f4341df867918fdfc602d2e68a25541e.jpg',
  'https://i.pinimg.com/1200x/bc/df/43/bcdf43f327580c58e7bcf26f64343631.jpg',
];

export default function CreateFeedRecordScreen() {
  const [text, setText] = useState('');
  const [color, setColor] = useState('white');
  const [images, setImages] = useState(sampleImages);

  const [selectedImage, setSelectedImage] = useState(0);
  const [options, setOptions] = useState({
    distance: true,
    time: true,
    pace: true,
    bpm: true,
  });

  const { show, hide } = useToastStore();

  /** EventEmitter로 업로드 완료( uploadFinished ) 구독 */
  useEffect(() => {
    const emitter = new EventEmitter<Record<string, any>>();
    const sub = emitter.addListener('uploadFinished', (data: { id: string; success: boolean }) => {
      if (data.success) {
        console.log('uploadFinished', data);
        show({ message: '게시물이 작성됐어요' });
      }
    });
    return () => {
      sub.remove();
    };
  }, []);

  /** 사진 업로드 */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Photos permission not granted',
        'Please grant photos permission to use this feature',
        [{ text: 'Open settings', onPress: () => Linking.openSettings() }, { text: 'Cancel' }],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const selectImage = (idx: number) => {
    console.log(idx, '이미지 선택');
    setSelectedImage(idx);
  };

  /** 수영 시간, 페이스 포함 여부 */
  const timeAndPace = useMemo(() => {
    if (!options.time && !options.pace) return null;

    const timeText = options.time ? formatSeconds(dummySwimRecord.totalSeconds) : null;
    const paceText = options.pace ? dummySwimRecord.pace : null;

    if (timeText && paceText) return `${timeText} | ${paceText}`;
    return timeText || paceText || null;
  }, [options, dummySwimRecord]);

  /** 초 -> MM:SS 변환 함수 */
  function formatSeconds(sec: number) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;

    // 두 자리수 맞추기 (07 이런 식)
    const paddedSec = String(seconds).padStart(2, '0');

    return `${minutes}:${paddedSec}`;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* 기록 카드 */}
      <View style={styles.recordCard}>
        <Image
          source={{ uri: images[selectedImage] }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* 오버레이 텍스트 */}
        <View style={styles.overlayText}>
          {options.distance && (
            <Text style={[styles.distanceText, { color }]}>{dummySwimRecord.totalDistance}m</Text>
          )}
          {timeAndPace && (
            <Text style={[styles.subText, { marginTop: 4, color }]}>{timeAndPace}</Text>
          )}
          {options.bpm && (
            <View style={styles.bpmGroup}>
              <Ionicons name="heart" size={18} color={color} />
              <Text style={[styles.subText, { color }]}>{dummySwimRecord.averageHeartRate}bpm</Text>
            </View>
          )}
        </View>
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

      {/* 사진 리스트 */}
      <ScrollView
        horizontal
        contentContainerStyle={styles.photoRow}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((uri, idx) => (
          <Pressable key={idx} onPress={() => selectImage(idx)}>
            <Image
              source={{ uri }}
              style={[styles.photo, idx === selectedImage ? styles.photoSelected : null]}
            />
          </Pressable>
        ))}

        <Pressable style={styles.addPhotoBtn} onPress={pickImage}>
          <Ionicons name="add" size={24} color="#555" />
        </Pressable>
      </ScrollView>

      {/* 색상 선택 */}
      <View style={styles.colorSection}>
        <Text style={styles.sectionLabel}>텍스트</Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>색상</Text>
          <View style={styles.colorRow}>
            <Pressable
              onPress={() => setColor('white')}
              style={[styles.colorDot, styles.whiteDot, color === 'white' && styles.selectedDot]}
            />

            <Pressable
              onPress={() => setColor('black')}
              style={[styles.colorDot, styles.blackDot, color === 'black' && styles.selectedDot]}
            />
          </View>
        </View>
      </View>

      {/* 상세 설정 */}
      <View>
        <Text style={styles.sectionLabel}>상세 설정</Text>
        {[
          ['distance', '거리'],
          ['time', '시간'],
          ['pace', '평균 페이스'],
          ['bpm', '심박수'],
        ].map(([key, label]) => (
          <View key={key} style={styles.optionRow}>
            <Text style={styles.optionLabel}>{label}</Text>

            <Switch
              value={options[key]}
              onValueChange={(v) => setOptions((prev) => ({ ...prev, [key]: v }))}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  /** 기록 카드 */
  recordCard: {
    width: '100%',
    backgroundColor: '#EEE',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 208,
  },
  overlayText: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  distanceText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  bpmGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  subText: {
    fontSize: 15,
  },
  /** 입력 */
  inputWrapper: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    marginBottom: 16,
  },
  input: { minHeight: 140, fontSize: 16, color: '#222', lineHeight: 22 },
  /** 사진 */
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 8,
  },
  photoSelected: {
    borderWidth: 2,
    borderColor: '#4285EA',
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** 색상 선택 */
  colorSection: {
    marginVertical: 20,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#B0B0B0',
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  whiteDot: {
    backgroundColor: '#FFF',
    borderColor: '#DDD',
  },
  blackDot: {
    backgroundColor: '#000',
    borderColor: '#DDD',
  },
  selectedDot: {
    borderColor: '#4285EA',
  },
  /** 상세 설정 */
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  optionLabel: {
    fontSize: 16,
    color: '#222',
  },
  /** 버튼 */
  submitBtn: {
    marginTop: 28,
    backgroundColor: '#4285EA',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '500',
  },
});
