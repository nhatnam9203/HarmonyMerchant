import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '@configs';
import { scaleSize } from '@utils';

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
        paddingLeft:scaleSize(38)
    },
    headerRigth: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight:scaleSize(56),
        paddingBottom :scaleSize(20)
    },
    textSkip: {
        color: '#0A88C1',
        fontSize: scaleSize(16),
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
        width: scaleSize(20),
        height: scaleSize(5),
        borderRadius: scaleSize(8),
        marginBottom: 0,
        backgroundColor: "#656581"
    },
    activeDotStyle: {
        width: scaleSize(20),
        height: scaleSize(5),
        borderRadius: scaleSize(8),
        marginBottom: 0,
        backgroundColor: "white"
    },
    slide: {
        flex: 1,
        flexDirection: 'row'
    },
    slideImage: {
        flex: 1,
        paddingHorizontal: scaleSize(20),
    },
    slideText: {
        flex: 0.8,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    slideTextTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: scaleSize(16)
    },
    slideTextDesc: {
        color: '#fff',
        fontSize: scaleSize(12)
    }
})