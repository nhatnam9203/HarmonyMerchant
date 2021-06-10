import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import { scaleSize } from '@utils';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header_container: {
        height: scaleSize(55),
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        paddingHorizontal: scaleSize(12),
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
    txt_order_id_box: {
        justifyContent: "center"
    },
    txt_order_id: {
        color: "#404040",
        fontSize: scaleSize(14),
        fontWeight: "600",
    },
    status_box: {
        // height: scaleSize(25),
        backgroundColor: "#4CD964",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingVertical: scaleSize(6),
        paddingHorizontal: scaleSize(10),
        borderRadius: scaleSize(20),
        marginTop: scaleSize(14),
        marginBottom: scaleSize(12)
    },
    txt_status: {
        color: "#fff",
        fontSize: scaleSize(11),
        fontWeight: "600"
    },
    txt_title_two_colum: {
        color: "#404040",
        fontSize: scaleSize(13),
        fontWeight: "600",
        // marginBottom: scaleSize(10)
    },
    content_two_colum: {
        backgroundColor: "#F6F6F6",
        padding: scaleSize(10),
        marginTop: scaleSize(10)
    },
    txt_key_value_item: {
        color: "#404040",
        fontSize: scaleSize(11)
    },
    txt_total: {
        color: "#0764B0",
        fontWeight: "600"
    },
    header_product_list: {
        flexDirection: "row",
        height: scaleSize(25),
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 2
    },
    txt_header_product_list: {
        color: "#404040",
        fontSize: scaleSize(12),
        fontWeight: "bold"
    },
    item_row_product_list: {
        flexDirection: "row",
        minHeight: scaleSize(55),
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 2,
        paddingVertical: scaleSize(3),
    },
    txt_row_product_list: {
        color: "#404040",
        fontSize: scaleSize(12),
        fontWeight: "500",
    },
    txt_product_name:{
        color: "#404040",
        fontSize:scaleSize(12),
        fontWeight: "bold"
    }
})