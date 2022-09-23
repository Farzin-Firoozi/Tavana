module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '~': './src',
        },
      },
    ],
    'react-native-reanimated/plugin', // has to be last
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
}
