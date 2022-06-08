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
        backgroundColor:'#F1F1F1',
    },
    headerView: {
        height: scaleSize(35), 
        borderBottomColor: '#0764B0', 
        borderWidth: 3, 
        paddingLeft: scaleSize(50),
        paddingRight: scaleSize(20),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: { 
        fontSize: scaleSize(16), 
        color: '#0764B0',
        fontWeight:"600"
    },
    statusText: { 
        fontSize: scaleSize(11), 
        fontWeight: "600", 
    }
})