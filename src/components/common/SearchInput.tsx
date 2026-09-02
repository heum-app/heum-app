import { SearchInputProps } from '@/features/search/type';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

export function SearchInput({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = '검색',
}: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 6 }} />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="검색어를 입력하세요"
        placeholderTextColor="#BFC4CB"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus
      />

      {value.length > 0 && (
        <Pressable onPress={onClear}>
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
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 20,
    marginTop: 12,
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
});
