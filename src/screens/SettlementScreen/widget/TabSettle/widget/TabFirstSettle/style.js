import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    txt_top_title: {
        color: '#404040',
        fontSize: scaleSize(14),
        fontWeight: "600"
    },
    txt_table: {
        color: '#0764B0',
        fontSize: scaleSize(14),
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