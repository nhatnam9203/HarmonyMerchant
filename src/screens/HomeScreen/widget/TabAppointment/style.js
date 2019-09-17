import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSzie } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,

    },
    containerAddAppoitment: {
        width: width,
        height: height - scaleSzie(34),
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: scaleSzie(1)
    },
    headerContainer: {
        height: scaleSzie(45),
        flexDirection: 'row',
        borderColor: 'rgb(197,197,197)',
        borderWidth: 1,
        paddingHorizontal: scaleSzie(14),
        alignItems: 'center'
    },
    textHeader: {
        fontSize: scaleSzie(20),
        color: '#404040'
    },
    categoriesHeader: {
        height: scaleSzie(46),
        borderWidth: 1,
        borderColor: '#404040',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoriesBody: {
        flex: 1,
        // backgroundColor:'red'
    },
    shadowLine: {
        width: 2,
        backgroundColor: '#404040',
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0,1)',
                shadowOpacity: 1,

            },

            android: {
                elevation: 2,
            },
        })
    },
    shadowLineLeft: {
        shadowOffset: { width: -3.5, height: 2 },
    },
    shadowLineRight: {
        shadowOffset: { width: 3.5, height: 2 },
    },
})