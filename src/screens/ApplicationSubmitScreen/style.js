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
        width: ScaleSzie(284),
        height: ScaleSzie(65)
    },
    desc:{ color: '#fff', fontSize: ScaleSzie(20) },
})