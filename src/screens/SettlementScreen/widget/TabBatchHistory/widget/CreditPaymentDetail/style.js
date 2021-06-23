import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#0764B0',
        fontSize: ScaleSzie(16),
        fontWeight: "600",
        marginTop:ScaleSzie(20),
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