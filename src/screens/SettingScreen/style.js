import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '@configs';
import { scaleSize } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAbout: {
        flex: 1,
        paddingHorizontal: scaleSize(24),
        paddingTop: scaleSize(25)
    },
    textTitle: { color: 'rgb(64,64,64)', fontSize: scaleSize(26), fontWeight: 'bold' },
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
        color: 'rgb(104,158,203)',
        fontSize: scaleSize(16),
    },
    textDesc: {
        color: 'rgb(150,150,150)',
        fontSize: scaleSize(16),
    },
    textFooter: {
        color: 'rgb(104,158,203)',
        fontSize: scaleSize(16),

    }
})