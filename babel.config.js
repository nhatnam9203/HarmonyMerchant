module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        paths: [
          {
            rootPathSuffix: "./src",
            rootPathPrefix: "@src",
          },
          {
            rootPathSuffix: "./src/shared",
            rootPathPrefix: "@shared",
          },
        ],
      },
    ],
  ],
  retainLines: true,
};
