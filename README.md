# Heum App 🏊‍

> 수영 기록 및 소셜(피드) 기능을 제공하는 모바일 (Android, iOS) 앱입니다.

<br>

## 🎥 앱 주요 화면 (GIF Preview)

<p align="center">
  <!-- <img src="/images/heum-1.gif" width="220" /> -->
  <img src="/images/heum-2.gif" width="220" />
  <img src="/images/heum-3.gif" width="220" />
  <img src="/images/heum-4.gif" width="220" />
  <!-- <img src="/images/heum-5.gif" width="220" /> -->
</p>

<br>

## ✨ 1. 핵심 기술 스택 (Core Tech Stack)

이 프로젝트는 다음의 핵심 라이브러리를 기반으로 합니다.

- **코어**: `React Native`, `Expo (Managed)`
- **라우팅**: `Expo Router (v3)`
- **스타일링**: `NativeWind (v4)` (Tailwind CSS for React Native)
- **서버 상태 관리**: `React Query (TanStack Query)`
- **클라이언트 상태 관리**: `Zustand`
- **언어**: `TypeScript`

> 선택 이유

- Expo 기반으로 Android/iOS를 동시에 개발하며 OTA 업데이트를 활용할 수 있습니다.
- Expo Router v3로 파일 기반 라우팅을 적용해 화면 구조가 명확해지고 유지보수가 쉬워졌습니다.
- NativeWind로 RN 스타일링 생산성을 크게 높였습니다.
- React Query는 서버 상태를 안전하고 일관성 있게 관리합니다.
- Zustand는 BottomSheet·전역 UI 상태처럼 “가벼운 전역 상태” 관리에 적합합니다.

<br>

## 🚀 2. 시작하기 (Getting Started)

### 개발 서버 실행 (Dev Client 기반)

프로젝트 설정 변경 후에는 항상 캐시를 초기화하고 Dev Client로 실행하는 것을 권장합니다.

```bash
# 1. 의존성 설치
npm install

# 2. Dev Client 빌드 (네이티브 기능 테스트용)
npx expo run:ios
npx expo run:android

# 3. 실행
npx expo start --dev-client

# 4. 플랫폼별 실행
서버 실행 후 터미널에서 해당 키를 누릅니다.

- **Android**: a 키
- **iOS**: i 키
- **Web**: w 키
```

<br>

## 📂 3. 프로젝트 구조 철학 (Architecture)

이 프로젝트는 `app/`과 `src/`라는 두 개의 핵심 폴더로 분리됩니다.

### `app/` (라우팅과 화면 조립)

> "어떤 화면이 어디에 있는지"를 정의합니다. (Expo Router의 영역)

- `app/` 폴더의 파일/폴더 구조가 그대로 앱의 URL과 내비게이션 경로가 됩니다.
- `_layout.tsx` 파일은 해당 폴더의 **레이아웃**이나 **네비게이터**(`Stack`, `Tabs`) 역할을 합니다.
- `(group)` 폴더는 URL 경로에 영향을 주지 않고 레이아웃을 분리합니다. (예: `(auth)`와 `(main)`)
- `app/` 폴더의 파일(예: `app/(main)/(tabs)/index.tsx`)은 "껍데기"이며, 실제 UI 로직은 `src/features/`에서 가져와 **조립**합니다.

### `src/` (기능과 로직)

> **"그 화면이 어떻게 동작하는지"**를 정의합니다. (팀 협업의 영역)

- **`src/features/`**
  - 도메인(기능)별로 코드를 분리합니다.
  - 각 `feature` 폴더는 자신의 `api`, `hooks`, `components`를 가질 수 있습니다.

- **`src/components/common/`**
  - **NativeWind**를 기반으로 스타일링된, 앱 전역에서 재사용되는 공통 컴포넌트입니다.
  - 예: `Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx` 등

- **`src/store/`**
  - `Zustand` 스토어를 관리합니다. (예: `authStore.ts`)

- **`src/api/`**
  - `React Query`의 `queryFn`이나 `axios` 인스턴스 등 공통 API 로직을 관리합니다.

- **`src/hooks/` / `src/constants/` / `src/lib/`**
  - 전역에서 사용되는 공통 훅, 상수, 유틸리티 함수를 관리합니다.

<br>

## 📁 4. 전체 디렉토리 구조 (Tree)

```plaintext
heum-app/
│
├── app/                      # (A) 라우팅 (Expo Router)
│   ├── (auth)/             # 1. 인증 그룹 (로그인 전)
│   │   ├── _layout.tsx     # (Stack)
│   │   └── signup.tsx
│   │
│   ├── (main)/             # 2. 메인 앱 그룹 (로그인 후)
│   │   ├── (tab)/
│   │   │   ├── _layout.tsx # (Tabs) 5개 탭
│   │   │   ├── index.tsx   # 홈(대시보드)
│   │   │   ├── calendar.tsx
│   │   │   ├── feed.tsx
│   │   │   ├── gear.tsx
│   │   │   └── my.tsx
│   │   ├── record/         # 탭을 덮는 스크린 (상세)
│   │   │   ├── [date].tsx
│   │   │   └── create.tsx
│   │   └── _layout.tsx     # (Stack) (tab)과 record/를 관리
│   │
│   ├── (onboarding)/       # 3. 온보딩 그룹 (최초 1회)
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   └── _layout.tsx         # 0. 최상위 레이아웃 (Provider)
│
├── src/                      # (B) 기능 및 로직
│   │
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   └── common/         # NativeWind 기반 공통 컴포넌트
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── calendar/
│   │   ├── dashboard/
│   │   ├── record/
│   │   └── ... (기능별)
│   │
│   ├── hooks/
│   ├── lib/ (utils)
│   └── store/              # Zustand 스토어
│
├── app.json                # Expo 설정
├── babel.config.js         # NativeWind 플러그인 설정
└── package.json

```

## 💡 5. 자주 발생하는 문제 (Troubleshooting)

- **Q: `app/` 폴더에 파일을 만들었는데 탭이나 헤더가 이상해요.**
  - A: 해당 파일이 속한 그룹(폴더)의 `_layout.tsx` 파일(`Stack` 또는 `Tabs`)에 `<Stack.Screen name="..."/>`으로 올바르게 등록되었는지 확인하세요.

* **Q: Expo Router가 새 파일을 인식하지 못해요.**
  - A: `expo-router`는 가끔 새 파일을 즉시 인식하지 못합니다. `npx expo start -c`로 재시작하세요.
* **Q: `app/` 폴더에 파일을 만들었는데 탭이나 헤더가 이상해요.**
  - A: 해당 파일이 속한 그룹(폴더)의 `_layout.tsx` 파일(`Stack` 또는 `Tabs`)에 `<Stack.Screen name="..."/>`으로 올바르게 등록되었는지 확인하세요.
