import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:ScaleSzie(4),
        backgroundColor: 'rgb(246,246,246)',
    },
    textTitleLefConten:{
        color:'#404040',
        fontSize:ScaleSzie(14)
    },
    tableLeft:{
        flex:1,
        borderWidth:1,
        borderColor:'#C5C5C5'
    },
    btnLogDetail:{
        height:ScaleSzie(35),
        borderColor:'#C5C5C5',
        borderWidth:1,
        borderRadius:4,
        backgroundColor:'#F1F1F1',
        alignItems:'center',
        paddingHorizontal:ScaleSzie(10),
        justifyContent:'space-between',
    },
    rowBox:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:ScaleSzie(4),
        // paddingRight:ScaleSzie(10)
    },
    textLeftBox:{
        color: '#404040',
         fontSize: ScaleSzie(14) 
    },
    textRightBox:{
        color: '#404040',
        fontSize: ScaleSzie(14) ,
        fontWeight:'bold'
    },
    boxChild:{
        flex:1,
        backgroundColor:'#E5E5E5',
        marginBottom:ScaleSzie(3),
        paddingHorizontal:ScaleSzie(8),
        justifyContent:'space-evenly'
    },
    boxChildLogo:{
        width:ScaleSzie(22),
        height:ScaleSzie(15)
    },
    rowBoxChild:{
        flexDirection: 'row',
        justifyContent:'space-between',
        // marginBottom:ScaleSzie(4) 
    },
    textBoxChild:{
        color: '#404040',
        fontSize: ScaleSzie(12) 
    }
})