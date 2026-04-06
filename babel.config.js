module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      // Keep this plugin last per Reanimated docs.
      'react-native-reanimated/plugin',
    ],
  };
};