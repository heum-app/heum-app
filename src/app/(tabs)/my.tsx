import { LoadingView, ScreenContainer } from '@/components';
import {
  FeedStatsSection,
  MenuItem,
  MenuTitle,
  ProfileSection,
  SmartWatchItem,
} from '@/features/my/components/main';
import { MenuGroup } from '@/features/my/components/main/MenuGroup';
import { useLogoutMutation } from '@/hooks/queries/useAuthMutations';
import { useUserInfoQuery } from '@/hooks/queries/user.queries';
import { useAlertStore } from '@/store/commonStore';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function MyScreen() {
  const { data, isLoading } = useUserInfoQuery();
  const router = useRouter();

  // api
  const { mutate: logoutMutation } = useLogoutMutation();

  // store
  const open = useAlertStore((state) => state.open);

  const handleLogout = () => {
    // 로그아웃 확인 모달 띄우기
    open({
      type: 'warning',
      title: '로그아웃 하시겠습니까?',
      message: '로그아웃하면 앱을 다시 실행해야 합니다.',
      confirmText: '로그아웃',
      cancelText: '취소',

      // 로그아웃 확정
      onConfirm: () => {
        console.log(`로그아웃`);
        logoutMutation();
      },

      // 취소
      onCancel: () => {
        console.log(`로그아웃 취소`);
      },
    });
  };

  if (isLoading || !data) return <LoadingView />;

  return (
    <ScreenContainer edges={['top']}>
      <ScrollView>
        <View style={styles.container}>
          {/* 프로필 섹션 */}
          <ProfileSection profile={data.profile} email={data.email} />

          {/* 피드 통계 섹션 */}
          <FeedStatsSection />

          {/* 메뉴 그룹 */}
          <MenuGroup>
            <SmartWatchItem />
          </MenuGroup>

          {/* 계정 관리 */}
          <MenuTitle>계정 관리</MenuTitle>
          <MenuGroup>
            <MenuItem
              text="내 정보"
              icon={<Ionicons name="person" size={18} />}
              onPress={() => router.push('/my/info')}
            />
            <MenuItem
              text="알림 설정"
              icon={<Ionicons name="notifications" size={18} />}
              onPress={() => router.push('/(main)/notification/setting')}
            />
          </MenuGroup>

          {/* 로그아웃 */}
          <MenuGroup>
            <MenuItem
              text="로그아웃"
              icon={<Ionicons name="log-out-outline" size={18} />}
              onPress={handleLogout}
            />
          </MenuGroup>

          {/* 활동 관리 */}
          <MenuTitle>활동 관리</MenuTitle>
          <MenuGroup>
            <MenuItem
              text="내 목표"
              icon={<FontAwesome name="bullseye" size={18} />}
              onPress={() => router.push('/my/goals')}
            />
            <MenuItem text="내 배지" icon={<Ionicons name="ribbon" size={18} />} />
          </MenuGroup>

          {/* 고객 지원 */}
          <MenuTitle>고객 지원</MenuTitle>
          <MenuGroup>
            <MenuItem
              text="자주 묻는 질문"
              icon={<Ionicons name="help-circle" size={18} />}
              onPress={() => router.push('/my/faq')}
            />
            <MenuItem
              text="문의하기"
              icon={<Ionicons name="mail" size={18} />}
              onPress={() => router.push('/(main)/my/contact')}
            />
          </MenuGroup>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
});
