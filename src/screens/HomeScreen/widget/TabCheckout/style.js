import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import Configs from '@configs';
import { scaleSzie } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: scaleSzie(53),
        flexDirection: 'row',
        borderColor: 'rgb(197,197,197)',
        borderWidth: 1,
        paddingHorizontal: scaleSzie(14),
    },
    textHeader: {
        fontSize: scaleSzie(18),
        // fontWeight:"600",
        color: '#404040'
    },
    categoriesHeader: {
        height: scaleSzie(36),
        borderBottomWidth: 2,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoriesBody: {
        flex: 1,
        // backgroundColor: '#F1F1F1'
    },
    shadowLine: {
        width: 10,
        // backgroundColor: '#DDDDDD',
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
    headerBasket: {
        height: scaleSzie(37),
        borderWidth: 1,
        borderColor: 'rgb(197,197,197)',
        borderRightColor: 'rgb(223,223,223)',
        borderRightWidth: 3,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payNumberTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scaleSzie(6)
    },
    textPay: {
        fontSize: scaleSzie(16),
        color: '#404040'
    },

    containerQrcode: {
        width: scaleSzie(220),
        height: scaleSzie(220),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgb(230,236,242)',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0,0.3)',
                shadowOffset: { width: 1, height: 0 },
                shadowOpacity: 1,

            },

            android: {
                elevation: 2,
            },
        })
    },
    btnCashier: {
        height: scaleSzie(30),
        width: scaleSzie(120),
        backgroundColor: '#0764B0',
        borderRadius: scaleSzie(3),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    textBtnCashier: {
        fontWeight: 'bold',
        fontSize: scaleSzie(10),
        color: "#fff",
        marginLeft: scaleSzie(4)
    },
    payment_header: {
        backgroundColor: "#F1F1F1",
        height: scaleSzie(37),
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(197, 197, 197)',
    },
    box_payment_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scaleSzie(20),
        marginTop: scaleSzie(30)
    }
})
