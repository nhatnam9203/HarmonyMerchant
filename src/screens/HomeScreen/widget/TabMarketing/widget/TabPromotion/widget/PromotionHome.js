import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Switch
} from 'react-native';
import { useSelector, useDispatch } from "react-redux";

import { scaleSize, formatWithMoment } from '@utils';
import IMAGE from '@resources';
import { Button, Text } from '@components';
import * as appActions from "@actions/app";

const { width } = Dimensions.get('window');

const PromotionHome = ({ promotions, createNewCampaign, editCampaign, disableCampaign, enableCampaign, viewRule, disableRule }) => {

    const [giftForNewEnabled, setGiftForNewEnabled] = useState(true);
    const profile = useSelector(state => state?.dataLocal?.profile);
    const dispatch = useDispatch();

    useEffect(() => {
        setGiftForNewEnabled(profile?.giftForNewEnabled);
    }, [profile]);

    handleChangeGiftForCustomer = (value) => {
        setGiftForNewEnabled(value);
        dispatch(appActions.changeIsGiftForNew(value));
    };


    return (
        <View style={{ flex: 1 }} >
            {/* ------------------- Campaigns ------------------- */}
            <View style={{ flexDirection: "row", paddingHorizontal: scaleSize(14), justifyContent: "space-between", alignItems: "center" }} >
                <Text style={{ color: "#404040", fontSize: scaleSize(16), fontWeight: "600" }} >
                    {`Campaigns`}
                </Text>
                <Button onPress={createNewCampaign} style={{
                    height: scaleSize(30), width: scaleSize(130), backgroundColor: "#0764B0",
                    borderRadius: 4, justifyContent: "center", alignItems: "center"
                }} >
                    <Text style={{ color: "#fff", fontSize: scaleSize(13), fontWeight: "600" }} >
                        {`New Campaign`}
                    </Text>
                </Button>
            </View>
            <CampaignTableHeader />

            <FlatList
                data={promotions}
                renderItem={({ item, index }) => <CampaignRow
                    data={item}
                    editCampaign={editCampaign(item)}
                    disableCampaign={disableCampaign(item)}
                    enableCampaign={enableCampaign(item)}
                />}
                // ListHeaderComponent={() => <CampaignTableHeader />}
                ListFooterComponent={() => <>
                    {/* <Text style={{
                        color: "#404040", fontSize: scaleSize(16), fontWeight: "600",
                        marginLeft: scaleSize(14), marginTop: scaleSize(28), marginBottom: scaleSize(8)
                    }} >
                        {`Rules`}
                    </Text>
                    <RuleTableHeader />
                    <RuleRow
                        viewRule={viewRule}
                        disableRule={disableRule}
                    /> */}

                    {/* ------------  Gift For New Customer ------------ */}

                    <View style={{ flexDirection: "row", marginTop: scaleSize(25) }} >
                        <Text style={{ color: "#404040", marginLeft: scaleSize(14), fontSize: scaleSize(14), marginRight: scaleSize(25) }} >
                            {`Gift For New Customer`}
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#0764B0" }}
                            ios_backgroundColor="#E5E5E5"
                            onValueChange={handleChangeGiftForCustomer}
                            value={giftForNewEnabled}
                        />
                    </View>


                    <View style={{ height: scaleSize(50) }} />
                </>}
            />
        </View>
    );
}

const CampaignTableHeader = () => {
    return (
        <View style={{ flexDirection: "row", paddingHorizontal: scaleSize(14), marginTop: scaleSize(30), marginBottom: scaleSize(12) }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Name`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSize(90), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Status`}
                </Text>
            </View>
            {/* ------------------- Start date ------------------- */}
            <View style={[{ width: scaleSize(100) }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Start date`}
                </Text>
            </View>
            {/* ------------------- End date ------------------- */}
            <View style={[{ width: scaleSize(100), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`End date`}
                </Text>
            </View>
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSize(150), alignItems: "center", }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Actions`}
                </Text>
            </View>
        </View>
    );
}

const RuleTableHeader = () => {
    return (
        <View style={{ flexDirection: "row", paddingHorizontal: scaleSize(14), marginVertical: scaleSize(12) }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Name`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSize(90), }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Status`}
                </Text>
            </View>
            <View style={[{ width: scaleSize(100) }, styles.center_txt]} />
            <View style={[{ width: scaleSize(100), }, styles.center_txt]} />

            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSize(150), alignItems: "center", }, styles.center_txt]} >
                <Text style={styles.txt_header} >
                    {`Actions`}
                </Text>
            </View>
        </View>
    );
}

const RuleRow = ({ viewRule, disableRule }) => {

    return (
        <View style={{
            minHeight: scaleSize(45), backgroundColor: "#fff",
            flexDirection: "row", paddingHorizontal: scaleSize(14), borderTopWidth: 1, borderTopColor: "#F1F1F1"
        }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_name_row} >
                    {`Happy valentine`}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSize(90), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {`Active`}
                </Text>
            </View>
            <View style={[{ width: scaleSize(100) }, styles.center_txt]} />

            <View style={[{ width: scaleSize(100), }, styles.center_txt]} />
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSize(150), flexDirection: "row" }, styles.center_txt]} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <Button onPress={viewRule} style={styles.btn_row} >
                        <Text style={[styles.txt_row, { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }]} >
                            {`View`}
                        </Text>
                    </Button>
                </View>
                <View style={{ width: scaleSize(10) }} />
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <Button onPress={disableRule} style={[styles.btn_row, { backgroundColor: "#FF3B30" }]} >
                        <Text style={[styles.txt_row, { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }]} >
                            {`Disable`}
                        </Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}

const CampaignRow = ({ data, editCampaign, disableCampaign, enableCampaign }) => {

    return (
        <View style={{
            minHeight: scaleSize(45), backgroundColor: "#fff",
            flexDirection: "row", paddingHorizontal: scaleSize(14), borderTopWidth: 1, borderTopColor: "#F1F1F1"
        }} >
            {/* ------------------- Name ------------------- */}
            <View style={[{ flex: 1 }, styles.center_txt]} >
                <Text style={styles.txt_name_row} >
                    {data?.name || ""}
                </Text>
            </View>
            {/* ------------------- Status ------------------- */}
            <View style={[{ width: scaleSize(90), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {data?.isDisabled ? "Disable" : "Active"}
                </Text>
            </View>
            {/* ------------------- Start date ------------------- */}
            <View style={[{ width: scaleSize(100) }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {formatWithMoment(data?.fromDate, "MM/DD/YYYY")}
                </Text>
            </View>
            {/* ------------------- End date ------------------- */}
            <View style={[{ width: scaleSize(100), }, styles.center_txt]} >
                <Text style={styles.txt_row} >
                    {formatWithMoment(data?.toDate, "MM/DD/YYYY")}
                </Text>
            </View>
            {/* ------------------- Actions ------------------- */}
            <View style={[{ width: scaleSize(150), flexDirection: "row" }, styles.center_txt]} >
                <View style={{ flex: 1, justifyContent: "center" }} >
                    <Button onPress={editCampaign} style={styles.btn_row} >
                        <Text style={[styles.txt_row, { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }]} >
                            {`Edit`}
                        </Text>
                    </Button>
                </View>
                <View style={{ width: scaleSize(10) }} />
                <View style={{ flex: 1, justifyContent: "center" }} >
                    {
                        data?.isDisabled ? <Button onPress={enableCampaign} style={[styles.btn_row, { backgroundColor: "#EEEEEE" }]} >
                            <Text style={[styles.txt_row, { color: "#6A6A6A", fontSize: scaleSize(12), fontWeight: "600" }]} >
                                {`Start`}
                            </Text>
                        </Button>
                            :
                            <Button onPress={disableCampaign} style={[styles.btn_row, { backgroundColor: "#FF3B30" }]} >
                                <Text style={[styles.txt_row, { color: "#fff", fontSize: scaleSize(12), fontWeight: "600" }]} >
                                    {`Disable`}
                                </Text>
                            </Button>
                    }

                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    center_txt: {
        justifyContent: "center"
    },
    txt_header: {
        color: "#404040",
        fontSize: scaleSize(12),
        fontWeight: "600"
    },
    txt_name_row: {
        color: "#0764B0",
        fontSize: scaleSize(12),
        fontWeight: "600"
    },
    txt_row: {
        color: "#404040",
        fontSize: scaleSize(11),
        fontWeight: "400"
    },
    btn_row: {
        height: scaleSize(25),
        width: "100%",
        backgroundColor: "#0764B0",
        borderRadius: 2,
        justifyContent: "center",
        alignItems: "center"
    }

});



export default PromotionHome;

