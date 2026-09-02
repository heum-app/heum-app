import { Button, ScreenContainer } from '@/components';
import { GoalCard, GoalType } from '@/features/my/components/goals';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function MyGoalsScreen() {
  const [weeklyType, setWeeklyType] = useState<GoalType>('거리');
  const [monthlyType, setMonthlyType] = useState<GoalType>('거리');
  const [yearlyType, setYearlyType] = useState<GoalType>('거리');

  const [weeklyDistance, setWeeklyDistance] = useState('');
  const [weeklyDistanceUnit, setWeeklyDistanceUnit] = useState('m');
  const [weeklyHours, setWeeklyHours] = useState('');
  const [weeklyMinutes, setWeeklyMinutes] = useState('');

  const [monthlyDistance, setMonthlyDistance] = useState('');
  const [monthlyDistanceUnit, setMonthlyDistanceUnit] = useState('m');
  const [monthlyHours, setMonthlyHours] = useState('');
  const [monthlyMinutes, setMonthlyMinutes] = useState('');

  const [yearlyDistance, setYearlyDistance] = useState('');
  const [yearlyDistanceUnit, setYearlyDistanceUnit] = useState('m');
  const [yearlyHours, setYearlyHours] = useState('');
  const [yearlyMinutes, setYearlyMinutes] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <GoalCard
            title="주간 목표"
            type={weeklyType}
            onTypeChange={setWeeklyType}
            distanceValue={weeklyDistance}
            onDistanceChange={setWeeklyDistance}
            distanceUnit={weeklyDistanceUnit}
            onDistanceUnitChange={setWeeklyDistanceUnit}
            hoursValue={weeklyHours}
            onHoursChange={setWeeklyHours}
            minutesValue={weeklyMinutes}
            onMinutesChange={setWeeklyMinutes}
          />
          <GoalCard
            title="월간 목표"
            type={monthlyType}
            onTypeChange={setMonthlyType}
            distanceValue={monthlyDistance}
            onDistanceChange={setMonthlyDistance}
            distanceUnit={monthlyDistanceUnit}
            onDistanceUnitChange={setMonthlyDistanceUnit}
            hoursValue={monthlyHours}
            onHoursChange={setMonthlyHours}
            minutesValue={monthlyMinutes}
            onMinutesChange={setMonthlyMinutes}
          />
          <GoalCard
            title="연간 목표"
            type={yearlyType}
            onTypeChange={setYearlyType}
            distanceValue={yearlyDistance}
            onDistanceChange={setYearlyDistance}
            distanceUnit={yearlyDistanceUnit}
            onDistanceUnitChange={setYearlyDistanceUnit}
            hoursValue={yearlyHours}
            onHoursChange={setYearlyHours}
            minutesValue={yearlyMinutes}
            onMinutesChange={setYearlyMinutes}
          />
        </ScrollView>

        <View style={styles.bottomButtonContainer}>
          <Button title="저장하기" variant="filled" onPress={() => {}} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  bottomButtonContainer: {
    paddingVertical: 16,
    marginTop: 'auto',
  },
});
