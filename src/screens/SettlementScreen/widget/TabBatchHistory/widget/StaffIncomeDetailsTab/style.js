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
        fontSize: scaleSize(12),
        fontWeight: "600"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: scaleSize(10),
        fontWeight: "400"
    },

})