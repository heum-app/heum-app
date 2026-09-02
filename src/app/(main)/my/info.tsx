import { Button, RadioButton, ScreenContainer } from '@/components';
import { DataPicker, GenderPicker } from '@/features/my/components/info';
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserInfoQuery,
} from '@/hooks/queries/user.queries';
import { useAlertStore, useToastStore } from '@/store/commonStore';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function MyInfoScreen() {
  // state
  const [email, setEmail] = useState('');
  const [birth, setBirth] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'gender' | 'birth' | null>(null);
  const [tempBirth, setTempBirth] = useState(new Date());
  const [tempGender, setTempGender] = useState('MALE');
  const [isPublic, setIsPublic] = useState<boolean | null>(false);

  // api
  const { data: userInfo } = useUserInfoQuery();
  const { mutateAsync: updateUser } = useUpdateUserMutation();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();

  // store
  const showToast = useToastStore((state) => state.show);
  const openAlert = useAlertStore((state) => state.open);

  /** 회원 탈퇴 핸들러 */
  const handleDeleteAccount = () => {
    openAlert({
      type: 'warning',
      title: '정말 탈퇴하시겠어요?',
      message: '모든 기록, 목표, 뱃지 정보가 전부 삭제돼요.',
      confirmText: '탈퇴하기',
      cancelText: '취소',
      onConfirm: () => deleteUser(),
    });
  };

  /** 유저 정보 불러오기 */
  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setBirth(userInfo.birthDate);
      setGender(userInfo.gender);
      if (userInfo.birthDate) setTempBirth(new Date(userInfo.birthDate));
      if (userInfo.gender) setTempGender(userInfo.gender);
    }
  }, [userInfo]);

  /** 날짜 확정 핸들러 */
  const handleSaveBirth = () => {
    const formattedDate = tempBirth.toISOString().split('T')[0]; // YYYY-MM-DD

    updateUser({ birthDate: formattedDate });
    setBirth(formattedDate);
    setActiveType(null);
  };

  /** 성별 확정 핸들러 */
  const handleSaveGender = () => {
    updateUser({ gender: tempGender });
    setGender(tempGender);
    setActiveType(null);
  };

  /** 공개 설정 핸들러 */
  const handleToggleVisibility = async (newIsPublic: boolean) => {
    if (isPublic === newIsPublic) return;
    setIsPublic(newIsPublic);

    await updateUser({ isPublic: newIsPublic });
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/* 이메일 */}
          <View style={[styles.inputWrapper, { marginBottom: 30 }]}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 16, color: email ? '#000' : '#B0B0B0' }}>{email}</Text>
              <Ionicons name="mail-outline" size={20} color="#B0B0B0" />
            </View>
          </View>

          <View style={[styles.inputWrapper]}>
            <Text style={styles.label}>공개 설정</Text>
            <View style={styles.radioWrapper}>
              <RadioButton
                options={[
                  { value: true, label: '공개' },
                  { value: false, label: '비공개' },
                ]}
                selectedValue={isPublic}
                onValueChange={handleToggleVisibility}
              />
            </View>
          </View>

          {/* 생년월일 */}
          <Pressable onPress={() => setActiveType('birth')}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>생년월일</Text>
              <View style={styles.input}>
                <Text style={{ fontSize: 16, color: birth ? '#000' : '#B0B0B0' }}>
                  {birth || '생년월일을 선택해주세요.'}
                </Text>
                {/* 달력 아이콘 */}
                <Ionicons name="calendar-outline" size={20} color="#B0B0B0" />
              </View>
            </View>
          </Pressable>

          {/* 성별 */}
          <Pressable
            onPress={() => {
              setTempGender(gender);
              setActiveType('gender');
            }}
          >
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.input}>
                <Text style={{ fontSize: 16, color: gender !== null ? '#000' : '#B0B0B0' }}>
                  {gender === 'MALE'
                    ? '남성'
                    : gender === 'FEMALE'
                      ? '여성'
                      : '성별을 선택해주세요.'}
                </Text>

                {/* 성별 아이콘 */}
                <Ionicons name="male-female-outline" size={20} color="#B0B0B0" />
              </View>
            </View>
          </Pressable>
        </View>

        {/* 생년월일 바텀 시트 */}
        <DataPicker
          visible={activeType === 'birth'}
          onClose={() => setActiveType(null)}
          date={tempBirth}
          onDateChange={setTempBirth}
          onSave={handleSaveBirth}
        />

        {/* 성별 바텀 시트 */}
        <GenderPicker
          visible={activeType === 'gender'}
          onClose={() => setActiveType(null)}
          value={tempGender}
          onValueChange={setTempGender}
          onSave={handleSaveGender}
        />

        <Button
          title="회원 탈퇴"
          variant="underlined"
          onPress={handleDeleteAccount}
          style={styles.buttonContainer}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  inputContainer: { flex: 1, gap: 20, marginBottom: 24 },
  inputWrapper: { gap: 8 },
  label: { fontSize: 14, color: '#575757', fontWeight: '600' },
  input: {
    borderRadius: 25,
    padding: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#F3F3F3',
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 'auto',
  },
  radioWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
