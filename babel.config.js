module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // If you use Reanimated, ONLY list it once here:
      // 'react-native-reanimated/plugin', 
    ],
  };
};