import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface ContactInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export function ContactInput({ label, errorMessage, ...props }: ContactInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, props.style]} placeholderTextColor="#B0B0B0" {...props} />
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
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000',
    minHeight: 55,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: -4,
  },
});
