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
        height: scaleSize(40),
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
        color: "#0764B0",
        fontSize: scaleSize(14),
        fontWeight: "600",
    },
    txtHeader: {
        color: '#404040',
        fontSize:scaleSize(11),
        lineHeight: scaleSize(20),
    }

})