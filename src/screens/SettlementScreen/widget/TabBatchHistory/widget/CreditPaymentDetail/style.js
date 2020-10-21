import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#0764B0',
        fontSize: scaleSzie(16),
        fontWeight: "600",
        marginTop:scaleSzie(20),
        marginLeft:scaleSzie(10)
    },
    txt_header_table: {
        color: '#404040',
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_row_table: {
        color: '#404040',
        fontSize: scaleSzie(10),
        fontWeight: "400"
    },

})