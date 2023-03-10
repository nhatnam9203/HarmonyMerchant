import { Dimensions, Platform } from 'react-native';
import EvnConfigs from 'react-native-config';
import { getVersion } from 'react-native-device-info';
const AppConfigs = {
  VERSION: getVersion(),
  BUILD: '70',
  CODEPUSH_VERSION: '1',
  DOMAIN: 'www.harmonypay.com',
  DEFAULT_WIDTH: Platform.OS === 'ios' ? 768 : 780,
  // DEFAULT_WIDTH: 736, mobile
  DEFAULT_HEIGHT: 736,
  FULL_WIDTH: Dimensions.get('window').width,
  // app's color
  ORANGE: 'rgb(249,115,0)',
  COLOR_MAIN_APP: 'rgba(51,73,131,0.6)',
  SHADOW: {
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: 'rgba(0, 0, 0, 1.0)',
        shadowOpacity: 0.54,
        shadowOffset: { width: 0, height: 2 },
      },

      android: {
        elevation: 2,
      },
    }),
  },
  APPSTORE_VERSION: '1.1.8',
  codePushKeyIOS: {
    production:
      'duhVozb0nWJ1ciL39iNtdh5xdqBy8ed003ce-e621-4347-babf-de7857b9c737',
    staging: 'mnF_3WG05SYllO2LScQOQIhTgfRs8ed003ce-e621-4347-babf-de7857b9c737',
    name: 'HpMerchant-IOS',
  },
  codePushKeyANDROID: {
    production: '_5E1ikfD-7PdT5JlapN9q4BfGAKy6Ohb2zHZpI',
    staging: 'WIPNFxhxOnC-CPUztRPNuYj4HMhWmkKi-8UOj',
    name: 'HpMerchant-IOS',
  },
  bundleIdAppStore: 'com.merchant.harmony',
  bundleIdAdhoc: 'com.app.hpmerchant',
  bundleIdAdhocDEV: 'com.app.hpmerchant.dev',
  btn_right_position: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 0,
    right: 0,
  },
  btn_left_position: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 0,
    left: 0,
  },
  REACTOTRON: true, // reactotron tool
  CHROME_DEBUG_LOGGER: false, // true -> active hight debug with chrome -> log
};

// const Configs = Object.assign(EvnConfigs, AppConfigs, {
//   API_URL: 'https://dev.harmonypayment.com/api/',
//   SOCKET_URL: 'https://dev.harmonypayment.com/',
// });

const Configs = Object.assign({}, AppConfigs, EvnConfigs);

export default Configs;
