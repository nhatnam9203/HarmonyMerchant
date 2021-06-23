import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '@configs';
import { ScaleSzie } from '@utils';

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
        paddingLeft:ScaleSzie(38)
    },
    headerRigth: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight:ScaleSzie(56),
        paddingBottom :ScaleSzie(20)
    },
    textSkip: {
        color: '#0A88C1',
        fontSize: ScaleSzie(16),
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
        width: ScaleSzie(20),
        height: ScaleSzie(5),
        borderRadius: ScaleSzie(8),
        marginBottom: 0,
        backgroundColor: "#656581"
    },
    activeDotStyle: {
        width: ScaleSzie(20),
        height: ScaleSzie(5),
        borderRadius: ScaleSzie(8),
        marginBottom: 0,
        backgroundColor: "white"
    },
    slide: {
        flex: 1,
        flexDirection: 'row'
    },
    slideImage: {
        flex: 1,
        paddingHorizontal: ScaleSzie(20),
    },
    slideText: {
        flex: 0.8,
        justifyContent: "center",
        paddingHorizontal: 20
    },
    slideTextTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: ScaleSzie(16)
    },
    slideTextDesc: {
        color: '#fff',
        fontSize: ScaleSzie(12)
    }
})