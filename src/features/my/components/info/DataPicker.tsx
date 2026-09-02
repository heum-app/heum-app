import { DatePicker } from '@quidone/react-native-wheel-picker';
import { Text, View } from 'react-native';
import CommonActionSheet from './CommonActionSheet';

interface DataPickerProps {
  visible: boolean;
  onClose: () => void;
  date: Date;
  onDateChange: (date: Date) => void;
  onSave: () => void;
}

export default function DataPicker({
  visible,
  onClose,
  date,
  onDateChange,
  onSave,
}: DataPickerProps) {
  const dateString = date.toISOString().split('T')[0];
  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <CommonActionSheet visible={visible} onClose={onClose} title="생년월일" onSave={onSave}>
      <View style={{ width: '100%', maxHeight: 200 }}>
        <DatePicker
          date={dateString}
          onDateChanged={({ date: newDate }) => onDateChange(new Date(newDate))}
          minDate="1950-01-01"
          maxDate={maxDate}
          locale="ko"
          itemTextStyle={{ fontSize: 20 }}
          renderYear={() => (
            <DatePicker.Year
              width="33%"
              renderItem={({ item, itemTextStyle }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[itemTextStyle, { textAlign: 'center' }]}>{`${item.value}년`}</Text>
                </View>
              )}
            />
          )}
          renderMonth={() => (
            <DatePicker.Month
              width="33%"
              renderItem={({ item, itemTextStyle }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text
                    style={[itemTextStyle, { textAlign: 'center' }]}
                  >{`${item.value + 1}월`}</Text>
                </View>
              )}
            />
          )}
          renderDate={() => (
            <DatePicker.Date
              width="33%"
              renderItem={({ item, itemTextStyle }) => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[itemTextStyle, { textAlign: 'center' }]}>{`${item.value}일`}</Text>
                </View>
              )}
            />
          )}
        />
      </View>
    </CommonActionSheet>
  );
}
