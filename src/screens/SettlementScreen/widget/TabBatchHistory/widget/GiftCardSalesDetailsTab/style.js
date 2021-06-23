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
        fontSize: ScaleSzie(12),
        fontWeight: "600"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: ScaleSzie(10),
        fontWeight: "400"
    },

})