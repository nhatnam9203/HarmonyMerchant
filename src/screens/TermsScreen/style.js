import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSzie } from '@utils';

const { width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logoTopContainer: {
        width,
        height: scaleSzie(100),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 1.0)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 2 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    textTitle:{
         color:'#0764B0',
         fontSize :scaleSzie(30),
         marginTop:scaleSzie(5)
    },
    termContainer:{
        width:scaleSzie(500),
        height:scaleSzie(280),
        borderWidth:1,
        borderColor:'#0764B0',
        paddingLeft:scaleSzie(25),
        paddingRight:scaleSzie(15),
        paddingTop:scaleSzie(10),
        paddingBottom:scaleSzie(20),
        backgroundColor:'rgb(246,246,246)'
    },
    buttonContainer:{
        flex:1,
        justifyContent:'flex-end',
        paddingBottom:scaleSzie(5)
    },
    contentTerms: {
        marginTop: 10,
        fontSize: 17,
        lineHeight: 25
    },
    checkboxContainer:{
        width:scaleSzie(500),
        flexDirection:'row',
        marginTop:scaleSzie(8)
    }

})