import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { ScaleSzie, checkIsTablet } from '@utils';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    logoTopContainer: {
        width,
        height: ScaleSzie(100),
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
        fontSize:checkIsTablet() ?ScaleSzie(22) :  ScaleSzie(28),
        marginTop: ScaleSzie(5)
    },
    termContainer: {
        width: ScaleSzie(500),
        height: checkIsTablet() ? ScaleSzie(230) : ScaleSzie(300),
        borderWidth: 1,
        borderColor: '#0764B0',
        paddingLeft: ScaleSzie(15),
        paddingRight: ScaleSzie(10),
        paddingTop: ScaleSzie(2),
        paddingBottom: ScaleSzie(2),
        backgroundColor: 'rgb(246,246,246)'
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: ScaleSzie(5)
    },
    contentTerms: {
        marginTop: 10,
        fontSize: 17,
        lineHeight: 25
    },
    checkboxContainer: {
        width: ScaleSzie(500),
        flexDirection: 'row',
        marginTop: checkIsTablet() ? ScaleSzie(8) : ScaleSzie(10)
    }

})