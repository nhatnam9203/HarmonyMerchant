import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { ScaleSzie } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        height:ScaleSzie(50),
        flexDirection:'row',
    },
    content:{ 
        flex: 1 ,
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    leftContent:{
        flex:1,
        paddingTop:ScaleSzie(15)
    },
    rightContent:{
        flex:0.8,
       
    }
})