import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logo:{
        width:scaleSzie(210),
        height:scaleSzie(50)
    },
    desc:{ color: '#fff', fontSize: scaleSzie(20) }
})