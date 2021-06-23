import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: ScaleSzie(14),
        fontWeight: "bold"
    },
    txt_table: {
        color: '#0764B0',
        fontSize: ScaleSzie(14),
        fontWeight: "600"
    },
    box_scale_by_staffs: {
        borderColor: "#DDDDDD",
        borderWidth: 1,
        flex: 1,
        paddingHorizontal: 1,
        backgroundColor:"#FAFAFA"
    }

})