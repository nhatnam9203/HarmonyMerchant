import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSize, checkIsTablet } from '@utils';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logoTopContainer: {
        width,
        height: scaleSize(100),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 1.0)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 0, height: 2 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    textTitle: {
        color: '#0764B0',
        fontSize:checkIsTablet() ?scaleSize(22) :  scaleSize(28),
        marginTop: scaleSize(5)
    },
    termContainer: {
        width: scaleSize(500),
        height: checkIsTablet() ? scaleSize(230) : scaleSize(300),
        borderWidth: 1,
        borderColor: '#0764B0',
        paddingLeft: scaleSize(15),
        paddingRight: scaleSize(10),
        paddingTop: scaleSize(2),
        paddingBottom: scaleSize(2),
        backgroundColor: 'rgb(246,246,246)'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: scaleSize(5)
    },
    contentTerms: {
        marginTop: 10,
        fontSize: 17,
        lineHeight: 25
    },
    checkboxContainer: {
        width: scaleSize(500),
        flexDirection: 'row',
        marginTop: checkIsTablet() ? scaleSize(8) : scaleSize(10)
    }

})