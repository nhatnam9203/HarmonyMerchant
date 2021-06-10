import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSize(4),
        backgroundColor: 'rgb(246,246,246)',
    },
    textTitleLefConten:{
        color:'#404040',
        fontSize:scaleSize(14)
    },
    tableLeft:{
        flex:1,
        borderWidth:1,
        borderColor:'#C5C5C5'
    },
    btnLogDetail:{
        height:scaleSize(35),
        borderColor:'#C5C5C5',
        borderWidth:1,
        borderRadius:4,
        backgroundColor:'#F1F1F1',
        alignItems:'center',
        paddingHorizontal:scaleSize(10),
        justifyContent:'space-between',
    },
    rowBox:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:scaleSize(4),
        // paddingRight:scaleSize(10)
    },
    textLeftBox:{
        color: '#404040',
         fontSize: scaleSize(14)
    },
    textRightBox:{
        color: '#404040',
        fontSize: scaleSize(14) ,
        fontWeight:'bold'
    },
    boxChild:{
        flex:1,
        backgroundColor:'#E5E5E5',
        marginBottom:scaleSize(3),
        paddingHorizontal:scaleSize(8),
        justifyContent:'space-evenly'
    },
    boxChildLogo:{
        width:scaleSize(22),
        height:scaleSize(15)
    },
    rowBoxChild:{
        flexDirection: 'row',
        justifyContent:'space-between',
        // marginBottom:scaleSize(4)
    },
    textBoxChild:{
        color: '#404040',
        fontSize: scaleSize(12)
    }
})