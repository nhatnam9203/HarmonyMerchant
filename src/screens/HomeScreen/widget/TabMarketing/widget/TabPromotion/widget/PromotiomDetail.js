import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native';
import { useSelector } from 'react-redux';

import { scaleSzie, localize } from '@utils';
import IMAGE from '@resources';
import { Button, Text, InputForm } from '@components';
const { width } = Dimensions.get('window');

const PromotiomDetail = () => {

    const [promotion, setPromotion] = React.useState();
    const language = useSelector(state => state?.dataLocal?.language || "en");

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: scaleSzie(14) }} >
            {/* ------------------- New Campaigns ------------------- */}
            <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginBottom: scaleSzie(20) }} >
                {`New campaign`}
            </Text>

            <InputForm
                title={`${localize('Campaign Name', language)}:`}
                subTitle=""
                placeholder="Campaign name"
                value={""}
                onChangeText={(value) => {
                }}
                style={{ marginBottom: scaleSzie(10), }}
                styleTitle={{ fontSize: scaleSzie(14), fontWeight: "600" ,marginBottom:scaleSzie(5)}}
                styleInputText={{fontSize:scaleSzie(13)}}
            />

             {/* ------------------- Date ------------------- */}
             <Text style={{ color: "#404040", fontSize: scaleSzie(16), fontWeight: "600", marginBottom: scaleSzie(20),
            marginTop:scaleSzie(12)
            }} >
                {`Date:`}
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

