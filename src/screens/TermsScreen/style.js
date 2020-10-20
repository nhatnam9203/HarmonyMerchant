import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSzie, checkIsTablet } from '@utils';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logoTopContainer: {
        width,
        height: scaleSzie(100),
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
        fontSize:checkIsTablet() ?scaleSzie(22) :  scaleSzie(28),
        marginTop: scaleSzie(5)
    },
    termContainer: {
        width: scaleSzie(500),
        height: checkIsTablet() ? scaleSzie(230) : scaleSzie(300),
        borderWidth: 1,
        borderColor: '#0764B0',
        paddingLeft: scaleSzie(15),
        paddingRight: scaleSzie(10),
        paddingTop: scaleSzie(2),
        paddingBottom: scaleSzie(2),
        backgroundColor: 'rgb(246,246,246)'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: scaleSzie(5)
    },
    contentTerms: {
        marginTop: 10,
        fontSize: 17,
        lineHeight: 25
    },
    checkboxContainer: {
        width: scaleSzie(500),
        flexDirection: 'row',
        marginTop: checkIsTablet() ? scaleSzie(8) : scaleSzie(10)
    }

})