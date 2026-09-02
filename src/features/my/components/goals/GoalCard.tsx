import { ActionSheet } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export type GoalType = '거리' | '시간';

interface GoalCardProps {
  title: string;
  type: GoalType;
  onTypeChange: (type: GoalType) => void;
  distanceValue: string;
  onDistanceChange?: (val: string) => void;
  distanceUnit?: string;
  onDistanceUnitChange?: (val: string) => void;
  hoursValue: string;
  onHoursChange?: (val: string) => void;
  minutesValue: string;
  onMinutesChange?: (val: string) => void;
}

export default function GoalCard({
  title,
  type,
  onTypeChange,
  distanceValue,
  onDistanceChange,
  distanceUnit = 'm',
  onDistanceUnitChange,
  hoursValue,
  onHoursChange,
  minutesValue,
  onMinutesChange,
}: GoalCardProps) {
  const [isUnitSheetVisible, setIsUnitSheetVisible] = useState(false);

  const handleNumericChange = (text: string, onChange?: (val: string) => void) => {
    if (!onChange) return;
    // 정규식을 사용하여 0 다음에 숫자가 오는 경우 시작 부분의 0을 제거 ('03' -> '3')
    const formatted = text.replace(/^0+(?=\d)/, '');
    onChange(formatted);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.toggleGroup}>
          <Pressable
            style={[styles.toggleButton, type === '거리' && styles.toggleButtonActive]}
            onPress={() => onTypeChange('거리')}
          >
            <Text style={[styles.toggleText, type === '거리' && styles.toggleTextActive]}>
              거리
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, type === '시간' && styles.toggleButtonActive]}
            onPress={() => onTypeChange('시간')}
          >
            <Text style={[styles.toggleText, type === '시간' && styles.toggleTextActive]}>
              시간
            </Text>
          </Pressable>
        </View>
      </View>

      {type === '거리' ? (
        <View style={styles.cardBody}>
          <View style={styles.distanceLeft}>
            <TextInput
              style={styles.inputText}
              value={distanceValue}
              onChangeText={(val) => handleNumericChange(val, onDistanceChange)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#BDBDBD"
            />
          </View>
          <Pressable style={styles.distanceRight} onPress={() => setIsUnitSheetVisible(true)}>
            <Text style={styles.dropdownText}>{distanceUnit}</Text>
            <Ionicons name="chevron-down" size={20} color="#575757" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.timeBody}>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.inputText}
              value={hoursValue}
              onChangeText={(val) => handleNumericChange(val, onHoursChange)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#BDBDBD"
            />
          </View>
          <Text style={styles.timeLabel}>시간</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.inputText}
              value={minutesValue}
              onChangeText={(val) => handleNumericChange(val, onMinutesChange)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#BDBDBD"
            />
          </View>
          <Text style={styles.timeLabel}>분</Text>
        </View>
      )}

      <ActionSheet
        visible={isUnitSheetVisible}
        onClose={() => setIsUnitSheetVisible(false)}
        actions={[
          { label: 'm', onPress: () => onDistanceUnitChange?.('m') },
          { label: 'yd', onPress: () => onDistanceUnitChange?.('yd') },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    backgroundColor: '#FFF',
  },
  toggleButtonActive: {
    borderColor: '#4285EA',
  },
  toggleText: {
    fontSize: 14,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#4285EA',
  },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
  },
  distanceLeft: {
    flex: 1.8,
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  distanceRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111',
  },
  timeBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeInputContainer: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#111',
    padding: 0,
    margin: 0,
  },
  timeLabel: {
    fontSize: 15,
    color: '#111',
  },
});
