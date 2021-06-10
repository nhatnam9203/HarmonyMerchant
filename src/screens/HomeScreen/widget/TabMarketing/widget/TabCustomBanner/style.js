import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSize } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        height:scaleSize(50),
        flexDirection:'row',
    },
    content:{
        flex: 1 ,
        backgroundColor:'#fff',
        flexDirection:'row'
    },
    leftContent:{
        flex:1,
        paddingTop:scaleSize(15)
    },
    rightContent:{
        flex:0.8,

    }
})