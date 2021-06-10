import {
    StyleSheet,
} from 'react-native';

import { scaleSize } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        paddingTop:scaleSize(30)
    },
    logo:{
        // width:scaleSize(240),
        // height:scaleSize(60)
    },
    desc:{ color: '#fff', fontSize: scaleSize(20) }
})