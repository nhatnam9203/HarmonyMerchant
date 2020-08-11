import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: scaleSzie(14),
        fontWeight: "600",
        marginTop:scaleSzie(6),
        marginLeft:scaleSzie(10)
    },
    txt_header_table: {
        color: '#404040',
        fontSize: scaleSzie(16),
        fontWeight: "400"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: scaleSzie(10),
        fontWeight: "400"
    },

})