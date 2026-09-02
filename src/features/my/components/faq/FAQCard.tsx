import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

interface FAQCardProps {
  question: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function FAQCard({ question, onPress, style }: FAQCardProps) {
  return (
    <Pressable style={[styles.card, style]} onPress={onPress}>
      <Text style={styles.questionText}>{question}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F6F8',
    borderRadius: 16,
    padding: 20,
    width: 200,
    height: 135,
    justifyContent: 'center',
    marginRight: 12,
  },
  questionText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
    lineHeight: 26,
  },
});
