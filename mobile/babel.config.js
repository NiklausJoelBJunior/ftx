module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      ['transform-inline-environment-variables', { include: ['FTX_API_URL'] }],
      'react-native-worklets/plugin',
    ],
  };
};
