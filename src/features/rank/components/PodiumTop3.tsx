import { Avatar } from '@/components';
import { Image, StyleSheet, Text, View } from 'react-native';

export function PodiumTop3({ users }) {
  const [first, second, third] = users;

  return (
    <View style={styles.podiumContainer}>
      {/* 빛나는 배경 */}
      <Image
        source={require('@/assets/images/sunburst.png')}
        style={styles.sunburst}
        resizeMode="contain"
      />

      {/* 중앙 1등 */}
      <View style={styles.firstColumn}>
        <View style={styles.avatarCircleBig}>
          <Avatar src={first.user.profileImageUrl} size="xl" />
        </View>
        <Text style={styles.name}>{first.user.nickname}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{first.totalDistance}m</Text>
        </View>
        <View style={[styles.podiumBlock, styles.podiumFirst]}>
          <Text style={styles.podiumNumber}>1</Text>
        </View>
      </View>

      {/* 왼쪽 2등 */}
      <View style={styles.secondColumn}>
        <View style={styles.avatarCircle}>
          <Avatar src={second.user.profileImageUrl} size="lg" />
        </View>
        <Text style={styles.name}>{second.user.nickname}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{second.totalDistance}m</Text>
        </View>
        <View style={[styles.podiumBlock, styles.podiumSecond]}>
          <Text style={styles.podiumNumber}>2</Text>
        </View>
      </View>

      {/* 오른쪽 3등 */}
      <View style={styles.thirdColumn}>
        <View style={styles.avatarCircle}>
          <Avatar src={third.user.profileImageUrl} size="lg" />
        </View>
        <Text style={styles.name}>{third.user.nickname}</Text>
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{third.totalDistance}m</Text>
        </View>
        <View style={[styles.podiumBlock, styles.podiumThird]}>
          <Text style={styles.podiumNumber}>3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  podiumContainer: {
    marginTop: 20,
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  rays: {
    position: 'absolute',
    top: 0,
    width: 300,
    height: 180,
    borderRadius: 150,
    backgroundColor: '#ffffff33',
    opacity: 0.6,
    transform: [{ scaleX: 1.8 }],
  },
  firstColumn: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  secondColumn: {
    position: 'absolute',
    bottom: 0,
    left: 40,
    alignItems: 'center',
  },
  thirdColumn: {
    position: 'absolute',
    bottom: 0,
    right: 40,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  sunburst: {
    position: 'absolute',
    top: 0,
    width: 500,
    height: 500,
    opacity: 0.75,
  },
  avatarCircleBig: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  distanceBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 6,
  },
  distanceText: {
    color: '#333',
    fontWeight: '700',
  },
  podiumBlock: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#ffffff30',
  },
  podiumFirst: { height: 110 },
  podiumSecond: { height: 90 },
  podiumThird: { height: 80 },
  podiumNumber: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 12,
  },
});
