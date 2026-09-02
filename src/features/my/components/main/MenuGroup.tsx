import { StyleSheet, View } from 'react-native';

export function MenuGroup({ children }: any) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 5,
    gap: 10,
  },
});
