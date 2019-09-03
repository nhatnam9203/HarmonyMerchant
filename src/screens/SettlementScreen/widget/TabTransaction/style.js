import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scaleSzie(16),
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSzie(4),
        backgroundColor: 'rgb(246,246,246)',
    },
})