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
    borderStyle: {
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: scaleSize(4),
        backgroundColor: '#F1F1F1',
    },
    containerDropdownExport: {
        width: scaleSize(110),
         height: scaleSize(50),
        backgroundColor: '#fff', borderRadius: scaleSize(4),
        paddingLeft:scaleSize(10),
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0,0.3)',
                shadowOffset: { width: 1, height: 0 },
                shadowOpacity: 1,

            },

            android: {
                elevation: 2,
            },
        })
    }
})