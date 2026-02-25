module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Ensure you don't have conflicting plugins here
  };
};