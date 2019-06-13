import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '../../../../../../configs';
import { scaleSzie } from '../../../../../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        height:scaleSzie(60),
        flexDirection:'row'
    },
    content:{ 
        flex: 1 ,
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    leftContent:{
        flex:1,
    },
    rightContent:{
        flex:0.8,
       
    }
})