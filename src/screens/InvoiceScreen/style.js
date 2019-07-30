import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSzie(4),
        // backgroundColor:'#F1F1F1',
        backgroundColor: 'rgb(246,246,246)',
    },
    payNumberTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleSzie(6)
    },
    textPay: {
        fontSize: scaleSzie(14),
        color: '#404040'
    },
})