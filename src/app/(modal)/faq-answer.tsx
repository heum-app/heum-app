import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FAQAnswerModal() {
  const { question, answer } = useLocalSearchParams<{ question: string; answer: string }>();

  return (
    <View style={styles.container}>
      {/* 상단 둥근 바 영역 */}
      <View style={styles.topBarContainer}>
        <View style={styles.handleBar} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{question?.replace(/\n/g, ' ')}</Text>
        <Text style={styles.content}>{answer}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  topBarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 28,
  },
  content: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});
