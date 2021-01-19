const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    offline: true,// Passing true will enable the default Workbox + Expo SW configuration.
  }, argv);
  // Customize the config before returning it.
  return config;
};
