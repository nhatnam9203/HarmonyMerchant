import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '@configs';
import { scaleSzie } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAbout:{
        flex:1,
        paddingHorizontal:scaleSzie(24),
        paddingTop:scaleSzie(25)
    },
    textTitle:{color:'rgb(64,64,64)',fontSize:scaleSzie(26),fontWeight:'bold'},
    logo:{
        marginVertical:scaleSzie(20)
    },
    text2:{
        color:'rgb(25,107,176)',
        fontWeight:'600',
        fontSize:scaleSzie(16)
    },
    textVersion:{
        color:'rgb(129,129,129)',
        fontSize:scaleSzie(16),
        marginVertical:scaleSzie(16)
    },
    textCopy:{
        color:'rgb(104,158,203)',
        fontSize:scaleSzie(16),
    },
    textDesc:{
        color:'rgb(150,150,150)',
        fontSize:scaleSzie(16),
    },
    textFooter:{
        color:'rgb(104,158,203)',
        fontSize:scaleSzie(16),
        
    }
})