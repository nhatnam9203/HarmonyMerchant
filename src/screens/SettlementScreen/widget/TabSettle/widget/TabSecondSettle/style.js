import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_top_title: {
        color: '#0764B0',
        fontSize: scaleSzie(14),
        fontWeight: "600",
        marginBottom:scaleSzie(10)
    },
    txt_normal: {
        color: "#404040",
        fontSize: scaleSzie(12),
        fontWeight: "500"
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSzie(10),
    },
    txt_title_note:{
        color:"#404040",
        fontSize:scaleSzie(11),
        fontWeight:"600",
        marginVertical:scaleSzie(10)
    },
    txt_note:{
        color:"#6A6A6A",
        fontSize:scaleSzie(10),
        marginTop:scaleSzie(5),
        marginHorizontal:scaleSzie(8),
    },
    box_note:{
        height:scaleSzie(60),
        borderColor:"#DDDDDD",
        borderWidth:2,
        borderRadius:6,
    }
})