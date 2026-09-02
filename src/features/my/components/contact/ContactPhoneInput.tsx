import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface ContactPhoneInputProps {
  label: string;
  part1: string;
  part2: string;
  part3: string;
  onChangePart1: (text: string) => void;
  onChangePart2: (text: string) => void;
  onChangePart3: (text: string) => void;
  errorMessage?: string;
}

export function ContactPhoneInput({
  label,
  part1,
  part2,
  part3,
  onChangePart1,
  onChangePart2,
  onChangePart3,
  errorMessage,
}: ContactPhoneInputProps) {
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  const handlePart1Change = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangePart1(numericValue);
    if (numericValue.length === 3) {
      input2Ref.current?.focus();
    }
  };

  const handlePart2Change = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangePart2(numericValue);
    if (numericValue.length === 4) {
      input3Ref.current?.focus();
    }
  };

  const handlePart3Change = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangePart3(numericValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={part1}
          onChangeText={handlePart1Change}
          keyboardType="numeric"
          maxLength={3}
          textAlign="center"
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          ref={input2Ref}
          style={styles.input}
          value={part2}
          onChangeText={handlePart2Change}
          keyboardType="numeric"
          maxLength={4}
          textAlign="center"
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          ref={input3Ref}
          style={styles.input}
          value={part3}
          onChangeText={handlePart3Change}
          keyboardType="numeric"
          maxLength={4}
          textAlign="center"
        />
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#575757',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
    minHeight: 50,
    fontWeight: '600',
  },
  dash: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -4,
  },
});
