import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSize(4),
        // backgroundColor:'#F1F1F1',
        backgroundColor: 'rgb(246,246,246)',
    },
})