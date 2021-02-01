import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native';
import Collapsible from 'react-native-collapsible';

import { scaleSzie } from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';

const { width } = Dimensions.get('window');

const PromotiomDetail = () => {

    const [promotion, setPromotion] = React.useState();

    return (
        <View style={{ flex: 1 }} >
            {/* ------------------- Campaigns ------------------- */}
            <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginLeft: scaleSzie(14) }} >
                {`New campaign`}
            </Text>
            
        </View>
    );
}




const styles = StyleSheet.create({
    center_txt: {
        justifyContent: "center"
    },
    txt_header: {
        color: "#404040",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_name_row: {
        color: "#0764B0",
        fontSize: scaleSzie(12),
        fontWeight: "600"
    },
    txt_row: {
        color: "#404040",
        fontSize: scaleSzie(11),
        fontWeight: "400"
    },
    btn_row: {
        height: scaleSzie(25),
        width: "100%",
        backgroundColor: "#0764B0",
        borderRadius: 2,
        justifyContent: "center",
        alignItems: "center"
    }

});



export default PromotiomDetail;

