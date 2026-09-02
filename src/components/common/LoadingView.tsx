import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
