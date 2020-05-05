import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_report_amount: {
        fontSize: scaleSzie(15),
        color: '#fff',
        fontWeight: "600"
    },
    txt_value_report_amount: {
        fontSize: scaleSzie(18),
        color: '#fff',
        fontWeight: "600"
    },
    txt_title_report_amount: {
        fontSize: scaleSzie(18),
        color: '#0764B0',
        fontWeight: "600",
        marginBottom: scaleSzie(8)
    },
    box_actual_amount: {
        height: scaleSzie(45),
        // marginTop: scaleSzie(8),
        marginBottom: scaleSzie(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    txt_actual_amount: {
        fontSize: scaleSzie(12),
        color: '#404040',
        // fontWeight: '600'
    },
    box_actual_value_amount: {
        height: scaleSzie(35),
        width: scaleSzie(140),
        borderColor: '#DDDDDD',
        borderWidth: 1,
        paddingHorizontal: scaleSzie(6),
    }
})