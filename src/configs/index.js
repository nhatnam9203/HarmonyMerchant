import { Dimensions, Platform } from 'react-native';

const configs = {
    VERSION: "1.0.6",
    BUILD: "",
    DEFAULT_WIDTH: Platform.OS === 'ios' ? 768 : 768,
    // DEFAULT_WIDTH: 736, mobile
    DEFAULT_HEIGHT: 736,
    FULL_WIDTH: Dimensions.get('window').width,
    // app's color 
    ORANGE: "rgb(249,115,0)",
    COLOR_MAIN_APP: "rgba(51,73,131,0.6)",
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
        })
    },
    codePushKeyIOS: {
        production: 'duhVozb0nWJ1ciL39iNtdh5xdqBy8ed003ce-e621-4347-babf-de7857b9c737',
        staging: 'mnF_3WG05SYllO2LScQOQIhTgfRs8ed003ce-e621-4347-babf-de7857b9c737',
        name: 'HpMerchant-IOS'
    },
    codePushKeyANDROID: {
        production: '_5E1ikfD-7PdT5JlapN9q4BfGAKy6Ohb2zHZpI',
        staging: 'WIPNFxhxOnC-CPUztRPNuYj4HMhWmkKi-8UOj',
        name: 'HpMerchant-IOS'
    },
    bundleIdAppStore: 'com.merchant.harmony',
    bundleIdAdhoc: 'com.app.hpmerchant',
    bundleIdAdhocDEV: 'com.app.hpmerchant.dev',
}

export default configs;



