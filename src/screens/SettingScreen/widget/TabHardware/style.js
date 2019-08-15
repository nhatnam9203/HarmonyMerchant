import {
    StyleSheet,
    Platform
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'red'
    },
    box: {
        flexDirection: 'row',
        width: '31%',
        height: scaleSzie(70),
        backgroundColor: '#fff',
        borderRadius: scaleSzie(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 0 },
            },

            android: {
                elevation: 2,
            },
        }),

    },
    containerIconBox:{
        paddingLeft :scaleSzie(10),
        paddingRight: scaleSzie(16),
        justifyContent:'center'
    },
    containerTextBox:{
        paddingTop: scaleSzie(16),
    },
    textBox:{
        fontSize:scaleSzie(12),
        fontWeight: '600',
        color:'#0764B0'
    }
})