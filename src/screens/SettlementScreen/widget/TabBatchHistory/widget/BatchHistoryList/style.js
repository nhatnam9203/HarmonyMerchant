import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: scaleSize(14),
        fontWeight: "600",
        marginTop:scaleSize(6),
        marginLeft:scaleSize(10)
    },
    txt_header_table: {
        color: '#404040',
        fontSize: scaleSize(16),
        fontWeight: "400"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: scaleSize(12),
        fontWeight: "400"
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSize(4),
        backgroundColor: 'rgb(246,246,246)',
    },

})