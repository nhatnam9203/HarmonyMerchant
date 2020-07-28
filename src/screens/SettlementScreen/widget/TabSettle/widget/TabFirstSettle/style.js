import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: scaleSzie(14),
        fontWeight: "600"
    },
    txt_table: {
        color: '#0764B0',
        fontSize: scaleSzie(14),
        fontWeight: "600"
    },
    box_scale_by_staffs: {
        flex: 1.2,
        borderColor: "#DDDDDD",
        borderWidth: 1,
    }

})