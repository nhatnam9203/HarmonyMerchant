// const plugins = ['react-native-reanimated/plugin'];

// plugins.push([
//   'module-resolver',
//   {
//     root: ['./src'],
//     extensions: ['.js', '.json'],
//     alias: {
//       '@': './src',
//     },
//   },
// ]);

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src',
            rootPathPrefix: '@src',
          },
          {
            rootPathSuffix: './src/utils',
            rootPathPrefix: '!/',
          },
        ],
      },
    ],
  ],
};
