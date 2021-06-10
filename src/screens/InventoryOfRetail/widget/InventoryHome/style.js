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
        paddingTop: scaleSize(16),
        backgroundColor: "#FAFAFA",
    },
    row_search_box: {
        flexDirection: "row",
        height: scaleSize(34),
        paddingHorizontal: scaleSize(14),

    },
    search_input: {
        flexDirection: "row",
        width: scaleSize(260),
        borderWidth: 1,
        borderColor: "#CCCCCC",
        marginRight: scaleSize(16)
    },
    tbl_header: {
        height: scaleSize(36),
        backgroundColor: "rgba(241,241,241,0.84)",
        borderColor: "#C5C5C5",
        borderWidth: 1,
        flexDirection: "row",
    },
    tbl_header_col: {
        flex:1,
        borderLeftColor: "#C5C5C5",
        borderLeftWidth: 1,
        justifyContent: "center",
    },
    txt_tbl_header_col: {
        color: "#0764B0",
        fontSize: scaleSize(10),
        fontWeight: "600",
        marginLeft: scaleSize(8),
    },
    order_item: {
        height: scaleSize(60),
        backgroundColor: "#FAFAFA",
        borderBottomColor: "#EEEEEE",
        borderBottomWidth: 1,
        flexDirection: "row",
    },
    order_item_col: {
        flex: 1,
        justifyContent: "center",
    },
    txt_order_item_col: {
        color: "#6A6A6A",
        fontSize: scaleSize(10),
        fontWeight: "400",
        marginLeft: scaleSize(8)
    },
    status_box: {
        width: scaleSize(70),
        height: scaleSize(20),
        backgroundColor: "#4CD964",
        borderRadius: scaleSize(10),
        justifyContent: "center",
        alignItems: "center",
    },
    txt_status: {
        color: "#fff",
        fontSize: scaleSize(10),
        fontWeight: "600"
    }
})