import { Avatar } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function ProfileSection({ profile, email }: any) {
  const router = useRouter();

  if (!profile) return null;

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.row}>
          <Avatar
            size="lg"
            src={
              profile.profileImageUrl
                ? profile.profileImageUrl.replace(/^http:/, 'https:')
                : undefined
            }
            fallbackText={profile.nickname}
          />
          <View>
            <Text style={styles.nickname}>{profile.nickname}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
        <Pressable
          onPress={
            () =>
              router.push({
                pathname: '/my/profile',
                params: { profile: JSON.stringify(profile) },
              }) // params에 객체(profile)를 그대로 넣으면, 내부적으로 이를 URL 쿼리 스트링으로 변환하려고 시도하면서 오류가 발생
          }
        >
          <Ionicons name="settings-outline" size={20} color="black" />
        </Pressable>
      </View>

      <Text style={styles.bio}>{profile.bio ? profile.bio : '자기소개 글이 없습니다.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nickname: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  email: { fontSize: 14, color: '#6B7280' },
  bio: { fontSize: 14, color: '#B0B0B0', paddingHorizontal: 5 },
});
