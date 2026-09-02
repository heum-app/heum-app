import { StyleSheet, Text } from 'react-native';

export function MenuTitle({ children }: { children: string }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 5,
  },
});
