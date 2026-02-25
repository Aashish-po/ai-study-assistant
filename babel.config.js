module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // Only add plugins if you absolutely need them!
  };
};