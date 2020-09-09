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
    },
    desc:{ color: '#fff', fontSize: scaleSzie(20) },
})