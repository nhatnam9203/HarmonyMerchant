import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie, checkIsTablet } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: checkIsTablet() ? ScaleSzie(30) : ScaleSzie(40)
    },
    logo: {
        width: ScaleSzie(284),
        height: ScaleSzie(65)
    }
})