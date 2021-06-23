import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logo:{
        width:scaleSize(210),
        height:scaleSize(50)
    },
    desc:{ color: '#fff', fontSize: scaleSize(20) }
})