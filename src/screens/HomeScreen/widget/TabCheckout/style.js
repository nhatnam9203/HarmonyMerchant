import {
    StyleSheet,
    Platform
} from 'react-native';

import { scaleSzie, checkIsTablet } from '@utils';

const TXT_COLOR= "#404040";
const BULE_SKY= "#0764B0"

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: scaleSzie(60),
        flexDirection: 'row',
        borderColor: 'rgb(197,197,197)',
        borderWidth: 1,
        paddingHorizontal: scaleSzie(14),


    },
    textHeader: {
        fontSize: scaleSzie(18),
        color: '#404040'
    },
    categoriesHeader: {
        height: scaleSzie(38),
        borderBottomWidth: 2,
        borderColor: '#DDDDDD',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F1F1F1"
    },
    categoriesBody: {
        flex: 1,
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
        height: scaleSzie(26),
        width: scaleSzie(100),
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
        marginLeft: scaleSzie(4),
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
        marginTop: checkIsTablet() ? scaleSzie(15) : scaleSzie(30)
    },
    box_payment_singular_container: {
        marginTop: checkIsTablet() ? scaleSzie(15) : scaleSzie(30),
        paddingHorizontal: scaleSzie(20),
    },
    txt_category_header_extra: {
        color: "#404040",
        fontSize: scaleSzie(15),
        fontWeight: "500"
    },

    // -------------- New Style --------
    centered: {
        justifyContent: "center",
        alignItems: "center"
    },
    staff_column_box: {
        backgroundColor: "#fff",
        borderRightColor: "#EEEEEE",
        borderRightWidth: 1,
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowOpacity: 0.54,
                shadowOffset: { width: 4, height: 0 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    staff_column_header: {
        height: scaleSzie(43),
        backgroundColor: "#F1F1F1",
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    txt_staff_column_header: {
        color: TXT_COLOR,
        fontSize: scaleSzie(18),
        fontWeight: "600"
    },
    staff_item:{
        height:scaleSzie(75),
        borderBottomWidth:1,
        borderBottomColor: "#EEEEEE",
        justifyContent: "center",
        alignItems: "center"
    },
    staff_avatar_box:{
        width:scaleSzie(38),
        height:scaleSzie(38),
        borderRadius:scaleSzie(19),
        overflow:"hidden"
    },
    staff_avatar:{
        width:scaleSzie(38),
        height:scaleSzie(38),
    },
    txt_staff_name:{
        color:TXT_COLOR,
        fontSize:scaleSzie(12),
        marginTop:scaleSzie(4)
    },
    number_staff_appointment_box:{
        width:scaleSzie(20),
        height:scaleSzie(20),
        borderRadius:scaleSzie(10),
        backgroundColor:BULE_SKY,
        position:"absolute",
        top:scaleSzie(6),
        left:scaleSzie(6),
        justifyContent: "center",
        alignItems: "center"
    },
    number_staff_appointment:{
        color:"#fff",
        fontSize:scaleSzie(12),
        fontWeight:"600"
    }
})
