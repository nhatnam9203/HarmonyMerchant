import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:scaleSzie(16),
    },
    borderStyle:{
        borderWidth:1,
        borderColor:'#C5C5C5',
        borderRadius:scaleSzie(4),
        backgroundColor: 'rgb(246,246,246)',
    },
    textTitleLefConten:{
        color:'#404040',
        fontSize:scaleSzie(14)
    },
    tableLeft:{
        flex:1,
        borderWidth:1,
        borderColor:'#C5C5C5'
    },
    btnLogDetail:{
        height:scaleSzie(35),
        borderColor:'#C5C5C5',
        borderWidth:1,
        borderRadius:4,
        backgroundColor:'#F1F1F1',
        alignItems:'center',
        paddingHorizontal:scaleSzie(10),
        justifyContent:'space-between',
    },
    rowBox:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginBottom:scaleSzie(4),
        // paddingRight:scaleSzie(10)
    },
    textLeftBox:{
        color: '#404040',
         fontSize: scaleSzie(14) 
    },
    textRightBox:{
        color: '#404040',
        fontSize: scaleSzie(14) ,
        fontWeight:'bold'
    },
    boxChild:{
        flex:1,
        backgroundColor:'#E5E5E5',
        marginBottom:scaleSzie(3),
        paddingHorizontal:scaleSzie(8),
        justifyContent:'space-evenly'
    },
    boxChildLogo:{
        width:scaleSzie(22),
        height:scaleSzie(15)
    },
    rowBoxChild:{
        flexDirection: 'row',
        justifyContent:'space-between',
        // marginBottom:scaleSzie(4) 
    },
    textBoxChild:{
        color: '#404040',
        fontSize: scaleSzie(12) 
    }
})