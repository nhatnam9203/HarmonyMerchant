import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '../../configs';
import { scaleSzie } from '../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        paddingTop:scaleSzie(30)
    },
    logo:{
        width:scaleSzie(210),
        height:scaleSzie(50)
    }
})