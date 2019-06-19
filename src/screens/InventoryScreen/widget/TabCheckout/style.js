import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSzie } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:scaleSzie(15),
        
    },
})