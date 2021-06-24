import {
    StyleSheet,
} from 'react-native';

import { scaleSzie, checkIsTablet } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: checkIsTablet() ? scaleSzie(30) : scaleSzie(40)
    },
    logo: {
        width: scaleSzie(284),
        height: scaleSzie(65)
    }
})