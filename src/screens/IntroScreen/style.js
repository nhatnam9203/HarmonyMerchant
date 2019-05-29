import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '../../configs';
import { scaleSzie } from '../../utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#23234B"
    },
    header: {
        flex: 1,
        flexDirection: 'row',
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingLeft:scaleSzie(38)
    },
    headerRigth: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight:scaleSzie(56),
        paddingBottom :scaleSzie(20)
    },
    textSkip: {
        color: '#0A88C1',
        fontSize: scaleSzie(12),
        fontWeight: '600'
    },
    body: {
        flex: 5,
    },
    footer: {
        flex: 1.5,
        flexDirection: 'row',
    },
    footerLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerRight: {
        flex: 1
    },
    dotStyle: {
        width: scaleSzie(20),
        height: scaleSzie(5),
        borderRadius: scaleSzie(8),
        marginBottom: 0,
        backgroundColor: "#656581"
    },
    activeDotStyle: {
        width: scaleSzie(20),
        height: scaleSzie(5),
        borderRadius: scaleSzie(8),
        marginBottom: 0,
        backgroundColor: "white"
    },
    slide: {
        flex: 1,
        flexDirection: 'row'
    },
    slideImage: {
        flex: 1,
        paddingHorizontal: scaleSzie(20),
    },
    slideText: {
        flex: 0.8,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    slideTextTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: scaleSzie(16)
    },
    slideTextDesc: {
        color: '#fff',
        fontSize: scaleSzie(12)
    }
})