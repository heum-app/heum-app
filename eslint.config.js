// ✅ ESLint Flat Config for React Native + TypeScript + Expo (v9.x 이상)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // 1️⃣ Node 환경용 (babel.config.js, metro.config.js 등)
  {
    files: ['babel.config.js', 'metro.config.js', '**/*.cjs', '**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },
  },

  // 2️⃣ TypeScript + React Native 코드
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['./src'],
        },
      },
    },
    rules: {
      // ---------------------------------------------------------------------
      // ✅ 기본 권장 규칙들 (JS + TS)
      // ---------------------------------------------------------------------
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      // ---------------------------------------------------------------------
      // ✅ 코드 포맷 (Prettier 중심)
      // ---------------------------------------------------------------------
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          arrowParens: 'always',
          endOfLine: 'auto',
        },
      ],

      // ---------------------------------------------------------------------
      // ✅ React 관련
      // ---------------------------------------------------------------------
      'react/react-in-jsx-scope': 'off', // React 17+ 자동 import
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off', // TypeScript 사용 시 필요 없음

      // ---------------------------------------------------------------------
      // ✅ Hooks 관련
      // ---------------------------------------------------------------------
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ---------------------------------------------------------------------
      // ✅ Import 관련 (완화 버전)
      // ---------------------------------------------------------------------
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'ignore', // ✅ 빈 줄 관련 경고 제거
          alphabetize: { order: 'asc', caseInsensitive: true }, // ✅ 알파벳순 유지
        },
      ],
      'import/no-unresolved': 'off', // alias 경로는 tsconfig로 해결

      // ---------------------------------------------------------------------
      // ✅ TypeScript 관련
      // ---------------------------------------------------------------------
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-require-imports': 'off',

      // ---------------------------------------------------------------------
      // ✅ 기타
      // ---------------------------------------------------------------------
      'no-console': 'off', // RN에서는 console.log 자주 쓰니까 허용
      'no-undef': 'off', // globals로 대체
    },
  },

  // 3️⃣ 공통 ignore 설정
  {
    ignores: ['node_modules', 'dist', 'build', '.expo', 'android', 'ios'],
  },
];
