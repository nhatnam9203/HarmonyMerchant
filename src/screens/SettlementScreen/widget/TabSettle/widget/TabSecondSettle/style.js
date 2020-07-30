import {
    StyleSheet,
} from 'react-native';

import { scaleSzie } from '@utils';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    txt_top_title: {
        color: '#0764B0',
        fontSize: scaleSzie(14),
        fontWeight: "600",
        marginBottom:scaleSzie(10)
    },
})