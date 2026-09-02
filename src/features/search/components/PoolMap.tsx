import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PoolMapProps } from '../type';

export function PoolMap({ region, location, pools, selectedPool, onSelectPool }: PoolMapProps) {
  if (!location || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9CA3AF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} region={region}>
        {/* 내 위치 */}
        <Marker
          coordinate={{ latitude: location.lat, longitude: location.lng }}
          title="내 위치"
          pinColor="blue"
        />

        {/* 내 주변 수영장 or 검색된 수영장 위치 */}
        {pools.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.name}
            description={p.address}
            pinColor={selectedPool?.id === p.id ? 'tomato' : 'red'}
            onPress={() => onSelectPool(p)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 250, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },

  loadingContainer: {
    flex: 1,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
