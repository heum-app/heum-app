import { Button } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ContactCompleteModalScreen() {
  const router = useRouter();

  const handleConfirm = () => {
    router.back();
    setTimeout(() => {
      router.back();
    }, 100);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.background} onPress={() => router.back()} />
      <View style={styles.modalContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={24} color="#000" />
        </View>
        <Text style={styles.title}>제출이 완료되었습니다.</Text>
        <Text style={styles.subtitle}>
          보내주신 내용을 확인 후{'\n'}최대한 빠르게 답변드리겠습니다.
        </Text>
        <Button title="확인" onPress={handleConfirm} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
  },
});
