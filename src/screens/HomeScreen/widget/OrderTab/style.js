import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSize } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
})