import { Header } from '@/components';
import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function PostLayout() {
  return (
    <Stack
      screenOptions={{
        title: '새 게시물',
        headerShown: true,
        header: ({ options, navigation }) => (
          <Header
            title={options.title}
            onBack={() => navigation.goBack()}
            rightItems={[
              <Pressable key="post" onPress={() => console.log('post')}>
                <Text style={styles.postButtonText}>게시하기</Text>
              </Pressable>,
            ]}
            bgColor="white"
            titleColor="black"
          />
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  postButtonText: {
    fontSize: 16,
    color: '#4285EA',
    fontWeight: '500',
  },
});
