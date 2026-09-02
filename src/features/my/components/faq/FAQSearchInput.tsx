import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface FAQSearchInputProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function FAQSearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search',
}: FAQSearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#111827" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={onClear} style={styles.clearIcon}>
          <Ionicons name="close-circle" size={18} color="#A3A3A3" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 32,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    minHeight: 45,
  },
  clearIcon: {
    marginLeft: 8,
  },
});
