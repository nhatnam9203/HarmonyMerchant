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
        paddingTop:scaleSize(15),
        backgroundColor :'#F1F1F1'
    },
})