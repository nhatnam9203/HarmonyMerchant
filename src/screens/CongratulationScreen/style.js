import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        paddingTop:ScaleSzie(30)
    },
    logo:{
        // width:ScaleSzie(240),
        // height:ScaleSzie(60)
    },
    desc:{ color: '#fff', fontSize: ScaleSzie(20) }
})