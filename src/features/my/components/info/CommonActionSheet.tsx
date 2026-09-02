import { ActionSheet, Button } from '@/components';
import { StyleSheet, Text, View } from 'react-native';

interface CommonActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onSave: () => void;
  children: React.ReactNode;
}

export default function CommonActionSheet({
  visible,
  onClose,
  title,
  onSave,
  children,
}: CommonActionSheetProps) {
  return (
    <ActionSheet visible={visible} onClose={onClose}>
      <View style={styles.bottomSheetContainer}>
        {/* 상단 둥근 바 영역 */}
        <View style={styles.topBarContainer}>
          <View style={styles.handleBar} />
        </View>

        {/* 헤더 텍스트 */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.contentContainer}>{children}</View>

        <Button title="저장하기" variant="outline" onPress={onSave} style={styles.saveButton} />
      </View>
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: { width: '100%', borderRadius: 15, marginTop: 20 },
});
