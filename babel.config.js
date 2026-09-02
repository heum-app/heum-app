module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './src/assets',
            '@components': './src/components',
            '@constants': './src/constants',
            '@features': './src/features',
            '@hooks': './src/hooks',
          },
        },
      ],

      'react-native-reanimated/plugin',
    ],
  };
};
