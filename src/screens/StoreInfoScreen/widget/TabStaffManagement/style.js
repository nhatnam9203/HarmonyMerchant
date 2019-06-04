import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '../../../../configs';
import { scaleSzie } from '../../../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        height: scaleSzie(50),
        flexDirection: 'row',
    },
    buttonContainer: {
        flex: 1,
        alignItems: 'center'
    },
})