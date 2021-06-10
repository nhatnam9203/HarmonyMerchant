import {
    StyleSheet,
} from 'react-native';

import { scaleSize, checkIsTablet } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: checkIsTablet() ? scaleSize(30) : scaleSize(40)
    },
    logo: {
        width: scaleSize(284),
        height: scaleSize(65)
    }
})