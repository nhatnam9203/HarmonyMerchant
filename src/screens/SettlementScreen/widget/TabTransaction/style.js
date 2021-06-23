import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: ScaleSzie(16),
    },
    borderStyle: {
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: ScaleSzie(4),
        backgroundColor: 'rgb(246,246,246)',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: ScaleSzie(10)
    },
    headerContent: {
        height: ScaleSzie(30),
        flexDirection: 'row',
    },
    textHeaderContent:{
        color:'#404040',
        fontSize:ScaleSzie(14)
    },
    tableContainer :{
        flex:1,
        borderWidth:1,
        borderColor:'#C5C5C5'
    }
})