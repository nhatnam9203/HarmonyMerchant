import {
    StyleSheet,
    Platform
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAbout: {
        flex: 1,
        paddingHorizontal: scaleSzie(24),
        paddingTop: scaleSzie(25)
    },
    textTitle: { 
        color: 'rgb(64,64,64)',
         fontSize: scaleSzie(26), 
         fontWeight: 'bold'
         },
    logo: {
        marginVertical: scaleSzie(20)
    },
    text2: {
        color: 'rgb(25,107,176)',
        fontWeight: '600',
        fontSize: scaleSzie(16)
    },
    textVersion: {
        color: 'rgb(129,129,129)',
        fontSize: scaleSzie(16),
        marginVertical: scaleSzie(16)
    },
    textCopy: {
        color: '#0764B0',
        fontSize: scaleSzie(16),
        marginVertical: scaleSzie(18)
    },
    textDesc: {
        color: 'rgb(150,150,150)',
        fontSize: scaleSzie(16),
    },
    textPhone: {
        color: '#404040',
        fontSize: scaleSzie(16),
        marginBottom:scaleSzie(10)

    }
})