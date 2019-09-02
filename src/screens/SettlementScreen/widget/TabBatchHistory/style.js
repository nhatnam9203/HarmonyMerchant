import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:scaleSzie(16),
        // paddingHorizontal:scaleSzie(12)
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
        
    }
})