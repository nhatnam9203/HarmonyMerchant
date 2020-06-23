import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        paddingTop:scaleSzie(30)
    },
    logo:{
        // width:scaleSzie(240),
        // height:scaleSzie(60)
    },
    desc:{ color: '#fff', fontSize: scaleSzie(20) },
})