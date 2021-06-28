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
        width: scaleSize(284),
        height: scaleSize(65)
    },
    desc:{ color: '#fff', fontSize: scaleSize(20) },
})