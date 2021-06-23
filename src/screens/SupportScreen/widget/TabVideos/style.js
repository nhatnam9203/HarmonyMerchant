import {
    StyleSheet,
    Platform
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAbout: {
        flex: 1,
        paddingHorizontal: ScaleSzie(24),
        paddingTop: ScaleSzie(25)
    },
    textTitle: { 
        color: 'rgb(64,64,64)',
         fontSize: ScaleSzie(26), 
         fontWeight: 'bold'
         },
    logo: {
        marginVertical: ScaleSzie(20)
    },
    text2: {
        color: 'rgb(25,107,176)',
        fontWeight: '600',
        fontSize: ScaleSzie(16)
    },
    textVersion: {
        color: 'rgb(129,129,129)',
        fontSize: ScaleSzie(16),
        marginVertical: ScaleSzie(16)
    },
    textCopy: {
        color: '#0764B0',
        fontSize: ScaleSzie(16),
        marginVertical: ScaleSzie(18)
    },
    textDesc: {
        color: 'rgb(150,150,150)',
        fontSize: ScaleSzie(16),
    },
    textPhone: {
        color: '#404040',
        fontSize: ScaleSzie(16),
        marginBottom:ScaleSzie(10)

    }
})