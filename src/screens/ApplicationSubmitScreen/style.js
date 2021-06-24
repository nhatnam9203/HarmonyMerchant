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
        width: scaleSzie(284),
        height: scaleSzie(65)
    },
    desc:{ color: '#fff', fontSize: scaleSzie(20) },
})