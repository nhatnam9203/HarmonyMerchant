import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_top_title: {
        color: '#0764B0',
        fontSize: ScaleSzie(14),
        fontWeight: "600",
        marginBottom:ScaleSzie(10)
    },
    txt_normal: {
        color: "#404040",
        fontSize: ScaleSzie(12),
        fontWeight: "500"
    },
    txt_item: {
        color: "#404040",
        fontSize: ScaleSzie(10),
    },
    txt_title_note:{
        color:"#404040",
        fontSize:ScaleSzie(11),
        fontWeight:"600",
        marginVertical:ScaleSzie(10)
    },
    txt_note:{
        color:"#6A6A6A",
        fontSize:ScaleSzie(10),
        marginTop:ScaleSzie(5),
        marginHorizontal:ScaleSzie(8),
    },
    box_note:{
        height:ScaleSzie(60),
        borderColor:"#DDDDDD",
        borderWidth:2,
        borderRadius:6,
    },
    txt_header_open_batch_table:{
        color:"#404040",
        fontSize:ScaleSzie(9),
        fontWeight:"600",
    },
    txt_item_open_batch_table:{
        color:"#404040",
        fontSize:ScaleSzie(9),
        fontWeight:"400",
    }

})