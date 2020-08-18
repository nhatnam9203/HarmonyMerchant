import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSzie(4),
        // backgroundColor:'#F1F1F1',
        backgroundColor: 'rgb(246,246,246)',
    },
    payNumberTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleSzie(4),
    },
    textPay: {
        fontSize: scaleSzie(14),
        color: '#404040'
    },
    txt_normal: {
        color: "#000",
        fontSize: 18,
        alignSelf: "center",
        fontWeight: "200"
    },
    txt_info: {
        color: "#000",
        fontSize: 18,
        fontWeight: "200"
    },
    txt_total: {
        color: "#000",
        fontSize: 20,
        fontWeight: "200"
    }
})