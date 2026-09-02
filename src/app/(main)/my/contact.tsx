import { Button, ScreenContainer } from '@/components';
import { ContactInput, ContactPhoneInput, ContactTextArea } from '@/features/my/components/contact';
import { Suggestion } from '@/features/my/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  phone: z.object({
    part1: z.string().length(3, '올바른 번호를 입력해주세요.'),
    part2: z.string().min(3, '올바른 번호를 입력해주세요.').max(4, '올바른 번호를 입력해주세요.'),
    part3: z.string().length(4, '올바른 번호를 입력해주세요.'),
  }),
  email: z.string().min(1, '이메일을 입력해주세요.').email('올바른 이메일 형식을 입력해주세요.'),
  content: z.string().min(1, '문의 내용을 입력해주세요.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: {
        part1: '',
        part2: '',
        part3: '',
      },
      email: '',
      content: '',
    },
  });

  const onSubmit = (data: ContactFormData) => {
    // API 호출 시 Suggestion 타입 활용 예시
    const payload: Omit<
      Suggestion,
      'suggestionId' | 'userId' | 'createdAt' | 'updatedAt' | 'status'
    > = {
      name: data.name,
      phone: `${data.phone.part1}-${data.phone.part2}-${data.phone.part3}`,
      email: data.email,
      content: data.content,
    };

    // api 통신 성공 시 모달 띄우기
    router.push('/(main)/my/contact-complete-modal');
  };

  return (
    <ScreenContainer edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>안녕하세요.</Text>
            <Text style={styles.subtitle}>
              서비스 이용 중 불편 사항이나{'\n'}개선 의견을 알려주세요.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <ContactInput
                  label="이름"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <ContactPhoneInput
                  label="휴대폰 번호"
                  part1={value.part1}
                  part2={value.part2}
                  part3={value.part3}
                  onChangePart1={(v) => onChange({ ...value, part1: v })}
                  onChangePart2={(v) => onChange({ ...value, part2: v })}
                  onChangePart3={(v) => onChange({ ...value, part3: v })}
                  errorMessage={
                    errors.phone?.part1?.message ||
                    errors.phone?.part2?.message ||
                    errors.phone?.part3?.message
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <ContactInput
                  label="이메일"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="content"
              render={({ field: { onChange, value } }) => (
                <ContactTextArea
                  label="문의 내용"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.content?.message}
                />
              )}
            />
          </View>

          <Button title="제출하기" onPress={handleSubmit(onSubmit)} style={styles.submitButton} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
  },
  headerTextContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  formContainer: {
    flex: 1,
    gap: 24,
    marginBottom: 30,
  },
  submitButton: {
    marginTop: 'auto',
  },
});
