import {
    StyleSheet,
    Platform
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAbout: {
        flex: 1,
        paddingHorizontal: scaleSize(24),
        paddingTop: scaleSize(25)
    },
    textTitle: {
        color: 'rgb(64,64,64)',
         fontSize: scaleSize(26),
         fontWeight: 'bold'
         },
    logo: {
        marginVertical: scaleSize(20)
    },
    text2: {
        color: 'rgb(25,107,176)',
        fontWeight: '600',
        fontSize: scaleSize(16)
    },
    textVersion: {
        color: 'rgb(129,129,129)',
        fontSize: scaleSize(16),
        marginVertical: scaleSize(16)
    },
    textCopy: {
        color: '#0764B0',
        fontSize: scaleSize(16),
        marginVertical: scaleSize(18)
    },
    textDesc: {
        color: 'rgb(150,150,150)',
        fontSize: scaleSize(16),
    },
    textPhone: {
        color: '#404040',
        fontSize: scaleSize(16),
        marginBottom:scaleSize(10)

    }
})