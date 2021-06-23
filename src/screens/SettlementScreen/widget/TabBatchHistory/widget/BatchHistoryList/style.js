import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: ScaleSzie(14),
        fontWeight: "600",
        marginTop:ScaleSzie(6),
        marginLeft:ScaleSzie(10)
    },
    txt_header_table: {
        color: '#404040',
        fontSize: ScaleSzie(16),
        fontWeight: "400"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: ScaleSzie(12),
        fontWeight: "400"
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:ScaleSzie(4),
        backgroundColor: 'rgb(246,246,246)',
    },

})