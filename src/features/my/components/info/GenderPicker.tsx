import WheelPicker from '@quidone/react-native-wheel-picker';
import { View } from 'react-native';
import CommonActionSheet from './CommonActionSheet';

interface GenderPickerProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
}

const GENDER_DATA = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
];

export default function GenderPicker({
  visible,
  onClose,
  value,
  onValueChange,
  onSave,
}: GenderPickerProps) {
  return (
    <CommonActionSheet visible={visible} onClose={onClose} title="성별" onSave={onSave}>
      <View style={{ width: '100%', maxHeight: 200 }}>
        <WheelPicker
          data={GENDER_DATA}
          value={value}
          onValueChanged={({ item }) => onValueChange(item.value as string)}
          width="100%"
          itemTextStyle={{ fontSize: 20 }}
          visibleItemCount={3}
        />
      </View>
    </CommonActionSheet>
  );
}
