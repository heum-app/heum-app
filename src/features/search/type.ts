export interface Pool {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance?: number | null;
}

export interface LocationLatLng {
  lat: number;
  lng: number;
}

export interface PoolRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PoolListProps {
  pools: Pool[];
  favorites: Pool[];
  onToggle: (id: string) => void;
  onSelectPool: (id: string) => void;
}

export interface PoolListItemProps {
  pool: any;
  isFavorite: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

export interface PoolMapProps {
  region: PoolRegion | null;
  location: LocationLatLng | null;
  pools: Pool[];
  selectedPool: Pool | null;
  onSelectPool: (pool: Pool) => void;
}

export interface LocationBlockedMapProps {
  onGranted: () => void;
}

export interface User {
  id: number;
  profileImageUrl: string;
  nickname: string;
  bio: string;
  isFollowing: boolean;
  isRequestedByMe: boolean;
  isRequestedToMe: boolean;
}

export interface PoolTopTabsProps {
  active: 'all' | 'friend' | 'pool';
  onChange: (tab: 'all' | 'friend' | 'pool') => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (text: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
}
