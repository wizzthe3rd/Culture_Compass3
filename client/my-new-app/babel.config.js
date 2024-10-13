module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],  // Expo's default Babel preset
  };
};
