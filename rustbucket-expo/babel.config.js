module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // No Reanimated plugin here on purpose: babel-preset-expo (SDK 54) adds
    // react-native-worklets/plugin automatically when it's installed, so
    // listing it again would run it twice.
  };
};
