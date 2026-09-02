import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SelectOptionSheet({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View>
      <View style={styles.topBarContainer}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.listBox}>
        {options.map((opt) => (
          <Pressable key={opt} style={[styles.row]} onPress={() => onSelect(opt)}>
            <Text style={styles.optionText}>{opt}</Text>
            {selected === opt && <Ionicons name="checkmark" size={18} color="#4285EA" />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBarContainer: {
    alignItems: 'center',
  },
  handleBar: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  listBox: { paddingVertical: 16, gap: 10 },
  row: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 15,
    color: '#111',
  },
});
