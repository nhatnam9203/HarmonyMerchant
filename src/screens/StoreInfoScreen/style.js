import {
    StyleSheet,
} from 'react-native';

import { ScaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logo:{
        width:ScaleSzie(210),
        height:ScaleSzie(50)
    },
    desc:{ color: '#fff', fontSize: ScaleSzie(20) }
})