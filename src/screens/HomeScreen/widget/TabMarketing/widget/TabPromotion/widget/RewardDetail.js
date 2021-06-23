import React, { useState } from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    ScrollView,
    Switch
} from 'react-native';
import { useSelector } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { ScaleSzie, localize, WorkingTime, formatWithMoment, MARKETING_CONDITIONS } from '@utils';
import ICON from '@resources';
import { Button, Text, InputForm, Dropdown } from '@components';
const { width } = Dimensions.get('window');

const RewardDetail = ({ cancelRewardPoints,saveRewardPoints }) => {

    const language = useSelector(state => state?.dataLocal?.language || "en");

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: ScaleSzie(14) }} >
                {/* ------------------- New Campaigns ------------------- */}
                <Text style={{ color: "#404040", fontSize: ScaleSzie(16), fontWeight: "600" }} >
                    {`Reward points`}
                </Text>

                <View style={{height:2,backgroundColor:"#EEEEEE",marginVertical:ScaleSzie(20)}} />

                <Text style={{ color: "#6A6A6A", fontSize: ScaleSzie(12), fontWeight: "400",marginBottom:ScaleSzie(15) }} >
                    {`Receive reward points according to the payment value`}
                </Text>

                <InputForm
                    title={`${localize('Rate', language)} (%)`}
                    subTitle=""
                    placeholder="100"
                    value={""}
                    onChangeText={(value) => { }}
                    style={{ marginBottom: ScaleSzie(10),width:ScaleSzie(220) }}
                    styleTitle={{ fontSize: ScaleSzie(12), fontWeight: "400", marginBottom: ScaleSzie(5),color:"#404040" }}
                    styleInputText={{ fontSize: ScaleSzie(13) }}
                />

                {/* ------------------- Date ------------------- */}
                <Text style={{}} >
                    {`* Payment of $100 get 100 reward points`}
                </Text>

                


            {/* --------------- Footer ---------------- */}
            <View style={{
                width: ScaleSzie(250), height: ScaleSzie(35),
                position: "absolute",
                bottom: ScaleSzie(20),
                left: (width - ScaleSzie(280)) / 2,
                flexDirection: "row"
            }} >
                <Button onPress={cancelRewardPoints} style={[{ flex: 1, backgroundColor: "#F1F1F1", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={styles.txt_footer} >
                        {`CANCEL`}
                    </Text>
                </Button>
                <View style={{ width: ScaleSzie(25) }} />
                <Button onPress={saveRewardPoints} style={[{ flex: 1, backgroundColor: "#0764B0", borderRadius: 2 }, styles.centered_box]} >
                    <Text style={[styles.txt_footer, { color: "#fff" }]} >
                        {`ADD`}
                    </Text>
                </Button>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    centered_box: {
        justifyContent: "center",
        alignItems: "center"
    },
    border_select: {
        borderColor: "#0764B0",
        borderWidth: 2,
    },
    txt_condition_select: {
        color: "#0764B0",
        fontSize: ScaleSzie(14),
        fontWeight: "600"
    },
    txt_date: {
        color: "#6A6A6A",
        fontSize: ScaleSzie(12),
        fontWeight: "400"
    },
    border_comm: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    txt_tit: {
        color: "#404040",
        fontSize: ScaleSzie(14),
        fontWeight: "600"
    },
    txt_footer: {
        fontSize: ScaleSzie(14),
        color: "#404040",
        fontWeight: "400"
    }

});



export default RewardDetail;

