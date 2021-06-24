import {
    StyleSheet,
    Platform
} from 'react-native';

import { scaleSzie, checkIsTablet } from '@utils';

const TXT_COLOR = "#404040";
const BULE_SKY = "#0764B0"

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
    categoriesBody: {
        flex: 1,
    },
    headerBasket: {
        height: scaleSzie(38),
        // borderWidth: 1,
        // borderColor: 'rgb(197,197,197)',
        // borderRightColor: 'rgb(223,223,223)',
        // borderRightWidth: 3,
        // borderLeftWidth: 0,
        // borderTopWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: "#DDDDDD",
        borderBottomWidth: 1
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

    // ------------- Staff Column Style -------------
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
                shadowRadius: 5,
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 3 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    staff_column_box_small: {
        borderRightWidth: 0,
    },
    staff_column_header: {
        height: scaleSzie(38),
        backgroundColor: "#F1F1F1",
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    categoriesHeader: {
        height: scaleSzie(38),
        // borderBottomWidth: 2,
        // borderColor: '#DDDDDD',
        justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: "#F1F1F1",
        borderBottomColor: "#DDDDDD",
        borderBottomWidth: 1,
        paddingLeft: scaleSzie(8)
    },
    txt_staff_column_header: {
        color: TXT_COLOR,
        fontSize: scaleSzie(18),
        fontWeight: "600"
    },
    staff_item: {
        height: scaleSzie(70),
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
        justifyContent: "center",
        alignItems: "center"
    },
    staff_avatar_box: {
        width: scaleSzie(34),
        height: scaleSzie(34),
        borderRadius: scaleSzie(17),
        overflow: "hidden"
    },
    staff_avatar: {
        width: scaleSzie(34),
        height: scaleSzie(34),
    },
    txt_staff_name: {
        color: TXT_COLOR,
        fontSize: scaleSzie(12),
        marginTop: scaleSzie(4)
    },
    number_staff_appointment_box: {
        width: scaleSzie(20),
        height: scaleSzie(20),
        borderRadius: scaleSzie(10),
        backgroundColor: BULE_SKY,
        position: "absolute",
        top: scaleSzie(6),
        left: scaleSzie(6),
        justifyContent: "center",
        alignItems: "center"
    },
    number_staff_appointment: {
        color: "#fff",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },

    // ------------- Categories Column Style -------------

    categories_column_box: {
        backgroundColor: "#fff",
        borderRightColor: "#EEEEEE",
        borderRightWidth: 1,
        borderLeftColor: "#EEEEEE",
        borderLeftWidth: 1,
        ...Platform.select({
            ios: {
                shadowRadius: 5,
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 3 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    // ------------- Product Column Style -------------
    product_column_box: {
        backgroundColor: "#fff",
        borderRightColor: "#EEEEEE",
        borderRightWidth: 1,
        borderLeftColor: "#EEEEEE",
        borderLeftWidth: 1,
        ...Platform.select({
            ios: {
                shadowRadius: 5,
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 3 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    // ------------- Extra Column Style -------------
    product_column_box: {
        backgroundColor: "#fff",
        borderRightColor: "#EEEEEE",
        borderRightWidth: 1,
        borderLeftColor: "#EEEEEE",
        borderLeftWidth: 1,
        ...Platform.select({
            ios: {
                shadowRadius: 5,
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowOffset: { width: 0, height: 3 },
            },

            android: {
                elevation: 2,
            },
        })
    },

    // ------------- Basket Column Style -------------
    basket_box: {
        flex: 1,
        zIndex: 1,
        backgroundColor: "#fff",

    },

    btn_basket: {
        borderWidth: 1,
        borderColor: '#C5C5C5',
        flex: 1,
        borderRadius: 4
    },
    txt_btn_basket: {
        fontSize: scaleSzie(19),
        fontWeight: '600'
    },
    btn_back: {
        borderWidth: 1,
        borderColor: '#C5C5C5',
        borderRadius: 4,
        height: scaleSzie(44)
    },
    avatar_box: {
        width: scaleSzie(40),
        height: scaleSzie(40),
        borderRadius: scaleSzie(20),
        overflow: "hidden",
        backgroundColor: "#E5E5E5",
        justifyContent: "center",
        alignItems: "center"
    },
    txt_avatar: {
        color: "#404040",
        fontSize: scaleSzie(18),
        fontWeight: "bold"
    },
    txt_customer_name:{
        color:"#0764B0",
        fontSize:scaleSzie(16),
        fontWeight:"600"
    },
    txt_customer_phone:{
        color:"#404040",
        fontSize:scaleSzie(14),
        fontWeight:"400",
        marginTop:5,
    },
    txt_enter_other_phone_number:{ 
        textDecorationLine:"underline",  
        color:"#0764B0",
        fontSize:scaleSzie(12),
        marginLeft:scaleSzie(10)
    }
})
