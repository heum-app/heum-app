import POOLS from '@/assets/data/pools.json';
import { EmptyResult } from '@/components';
import { PoolListItem, PoolListSkeleton, PoolMap } from '@/features/search';
import { useSearchStore } from '@/store/commonStore';
import { FlashList } from '@shopify/flash-list';
import Constants from 'expo-constants';

import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function SearchPool() {
  const keyword = useSearchStore((s) => s.keyword);

  const [debounced, setDebounced] = useState(keyword);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [nearbyPools, setNearbyPools] = useState([]);

  const [locState, setLocState] = useState({
    granted: false,
    location: null as null | { lat: number; lng: number },
  });

  const [searchState, setSearchState] = useState({
    list: [],
    selected: null,
  });

  /** 위치 권한 요청 */
  const requestLocation = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const loc = await Location.getCurrentPositionAsync({});
    const current = { lat: loc.coords.latitude, lng: loc.coords.longitude };

    setLocState({ granted: true, location: current });

    const kakaoPools = await fetchNearbyPools(current.lat, current.lng);
    setNearbyPools(kakaoPools);
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  /** Debounce 검색어 */
  useEffect(() => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      setDebounced('');
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => setDebounced(trimmed), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  /** Kakao 검색 */
  const fetchNearbyPools = async (lat, lng) => {
    try {
      const query = encodeURIComponent('수영장');

      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&y=${lat}&x=${lng}&radius=2000`,
        {
          headers: {
            Authorization: `KakaoAK ${Constants.expoConfig.extra.kakaoRestKey}`,
          },
        },
      );

      const data = await res.json();
      if (!data.documents) return [];

      return data.documents.map((doc) => ({
        id: doc.id,
        name: doc.place_name,
        lat: parseFloat(doc.y),
        lng: parseFloat(doc.x),
        address: doc.address_name,
        distance: doc.distance ? Number(doc.distance) : null,
      }));
    } catch (err) {
      console.error('Kakao API Error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /** POOLS 검색 */
  useEffect(() => {
    if (!debounced) {
      setSearchState({ list: [], selected: null });
      return;
    }

    const kw = debounced.toLowerCase();
    const result = POOLS.filter(
      (p) => p.name.toLowerCase().includes(kw) || p.address.toLowerCase().includes(kw),
    );

    setSearchState({
      list: result,
      selected: result[0] ?? null,
    });

    setLoading(false);
  }, [debounced]);

  /** 즐겨찾기 토글 */
  const onToggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === id);
      if (exists) return prev.filter((f) => f.id !== id);

      const pool = POOLS.find((p) => p.id === id);
      return pool ? [...prev, pool] : prev;
    });
  }, []);

  /** 수영장 선택 */
  const onSelectPool = useCallback((poolOrId) => {
    const pool =
      typeof poolOrId === 'string' ? (POOLS.find((p) => p.id === poolOrId) ?? null) : poolOrId;

    setSearchState((s) => ({ ...s, selected: pool }));
  }, []);

  /** 지도 region 계산 */
  const region = useMemo(() => {
    const base = searchState.selected || locState.location;
    if (!base) return null;

    return {
      latitude: base.lat,
      longitude: base.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [locState.location, searchState.selected]);

  /** 파생 상태 */
  const hasKeyword = keyword.trim().length > 0;

  /** 데이터 최적화 */
  const displayPools = useMemo(() => {
    const baseList = hasKeyword ? searchState.list : favorites;

    return baseList.map((pool) => ({
      ...pool,
      isFavorite: favorites.some((f) => f.id === pool.id),
    }));
  }, [hasKeyword, searchState.list, favorites]);

  const mapPools = hasKeyword ? searchState.list : nearbyPools;

  /** 스켈레톤 / 검색결과 없음 */
  if (loading) return <PoolListSkeleton />;
  if (hasKeyword && searchState.list.length === 0) return <EmptyResult />;

  return (
    <View style={styles.container}>
      {/* 지도 */}
      {locState.granted && (
        <PoolMap
          region={region}
          location={locState.location}
          pools={mapPools}
          selectedPool={searchState.selected}
          onSelectPool={onSelectPool}
        />
      )}

      {/* 리스트 */}
      <FlashList
        data={displayPools}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PoolListItem
            pool={item}
            isFavorite={item.isFavorite}
            onToggle={onToggleFavorite}
            onSelect={onSelectPool}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
});
