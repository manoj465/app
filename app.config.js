import 'dotenv/config';

export default ({ config }) => {
  //console.log('environment variable APP_PARTY >> ' + process.env.APP_PARTY);
  let version = '2.2.11';

  const newConfig = {
    ...config,
    version,
    extra: {
      extraParam: 'extraPraramString',
      ENVIRONMENT: process.env.ENVIRONMENT
    },
  };
  if (process.env.APP_PARTY == 'BDE_ELECTRIC') {
    newConfig.name = 'BDE Smart';
    newConfig.slug = 'BDE';
    newConfig.icon = './assets/icons/bde/bdeWhiteBackground.png';
    newConfig.splash.image = "./assets/icons/bde/bdeWhiteBackground.png"
    /// ios config
    newConfig.ios.icon = './assets/icons/bde/bdeWhiteBackground.png';
    newConfig.ios.bundleIdentifier = "com.sternet.bdeelectric";
    newConfig.ios.buildNumber = version;
    /// android config
    newConfig.android.icon = './assets/icons/bde/bdeWhiteBackground.png';
    newConfig.android.package = 'com.sternet.bdeelectric';
    newConfig.android.versionCode = 2;
  } else if (process.env.APP_PARTY == 'HUELITE') {
    newConfig.name = 'HUElite';
    newConfig.slug = 'HUElite';
    newConfig.icon = process.env.ENVIRONMENT == "development" ? "./assets/icons/huelite/icon-no-bg-beta.png" : "./assets/icons/icon-no-bg.png";
    newConfig.splash.image = "./assets/icons/huelite/splash.png";
    /// ios config
    newConfig.ios.icon = "./assets/icons/icon-with-bg.png";
    newConfig.ios.bundleIdentifier = "com.sternet.huelite";
    newConfig.ios.buildNumber = version;
    /// android config
    newConfig.android.icon = "./assets/icons/icon-no-bg.png";
    newConfig.android.adaptiveIcon = {
      foregroundImage: "./assets/icons/icon-no-bg.png",
      backgroundColor: "#FFFFFF"
    };
    newConfig.android.package = "com.sternet.huelite";
    newConfig.android.versionCode = 5;
  }

  //console.log('manifest config -- ' + JSON.stringify(newConfig, null, 2));
  return newConfig;
};
