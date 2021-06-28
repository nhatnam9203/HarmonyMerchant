import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_top_title: {
        color: '#0764B0',
        fontSize: scaleSize(14),
        fontWeight: "600",
        marginBottom:scaleSize(10)
    },
    txt_normal: {
        color: "#404040",
        fontSize: scaleSize(12),
        fontWeight: "500"
    },
    txt_item: {
        color: "#404040",
        fontSize: scaleSize(10),
    },
    txt_title_note:{
        color:"#404040",
        fontSize:scaleSize(11),
        fontWeight:"600",
        marginVertical:scaleSize(10)
    },
    txt_note:{
        color:"#6A6A6A",
        fontSize:scaleSize(10),
        marginTop:scaleSize(5),
        marginHorizontal:scaleSize(8),
    },
    box_note:{
        height:scaleSize(60),
        borderColor:"#DDDDDD",
        borderWidth:2,
        borderRadius:6,
    },
    txt_header_open_batch_table:{
        color:"#404040",
        fontSize:scaleSize(9),
        fontWeight:"600",
    },
    txt_item_open_batch_table:{
        color:"#404040",
        fontSize:scaleSize(9),
        fontWeight:"400",
    }

})