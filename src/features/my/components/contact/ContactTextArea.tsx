import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';

interface ContactTextAreaProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export function ContactTextArea({ label, errorMessage, ...props }: ContactTextAreaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, props.style]}
        placeholderTextColor="#B0B0B0"
        multiline
        textAlignVertical="top"
        {...props}
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#575757',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    minHeight: 120,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -4,
  },
});
