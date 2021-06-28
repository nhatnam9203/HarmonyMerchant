import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: scaleSize(16),
    },
    borderStyle: {
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: scaleSize(4),
        backgroundColor: 'rgb(246,246,246)',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: scaleSize(10)
    },
    headerContent: {
        height: scaleSize(30),
        flexDirection: 'row',
    },
    textHeaderContent:{
        color:'#404040',
        fontSize:scaleSize(14)
    },
    tableContainer :{
        flex:1,
        borderWidth:1,
        borderColor:'#C5C5C5'
    }
})