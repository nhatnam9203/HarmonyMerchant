import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Image,
    FlatList,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import { Button, Text } from '@components';
import {
    scaleSize, formatWithMoment, getArrayProductsFromAppointment, getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment,
    getColorStatus, getNameStateById
} from '@utils';
import Configs from "@configs";
import ICON from "@resources";
import connectRedux from '@redux/ConnectRedux';
import PopupAppointmentDetail from "./PopupAppointmentDetail";
import { T } from 'ramda';

const TXT_COLOR = "rgb(70,70,70)";
const TXT_COLOR_2 = "rgb(240,240,240)";
const TXT_COLOR_3 = "rgb(135,135,135)";



class GiftCardDetailTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            giftCardDetail: {}
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.popupAppointmentDetailRef = React.createRef();
    }

    setStateFromParent = async (giftCardDetail) => {
        await this.setState({
            giftCardDetail
        });
    }

    render() {
        const { giftCardLogs } = this.props;
        const { giftCardDetail } = this.state;

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSize(15), paddingTop: scaleSize(20) }} >
                <Text style={{ fontSize: scaleSize(14), fontWeight: "600", color: TXT_COLOR, marginBottom: scaleSize(10) }} >
                    {`Gift Card Detail`}
                </Text>

                <GiftCardDetailInfo
                    title={"ID"}
                    value={`${giftCardDetail?.giftCardId || 0}`}
                />

                <GiftCardDetailInfo
                    title={"Serial"}
                    value={`${giftCardDetail?.serialNumber || 0}`}
                />

                <GiftCardDetailInfo
                    title={"Created On"}
                    value={`${formatWithMoment(giftCardDetail?.createdDate, "MMM DD, YYYY")}`}
                />

                <GiftCardDetailInfo
                    title={"Value On"}
                    value={`$ ${giftCardDetail?.amount || 0}`}
                />

                {/* ------------------- Line -------------------- */}
                <View style={{ height: 2, backgroundColor: TXT_COLOR_2, marginTop: scaleSize(5), marginBottom: scaleSize(10) }} />

                <Text style={{ fontSize: scaleSize(14), fontWeight: "600", color: TXT_COLOR, marginBottom: scaleSize(15) }} >
                    {`Logs`}
                </Text>

                {/* ----------------- Header Table ------------------ */}
                <View style={{ flexDirection: "row", height: scaleSize(25) }} >
                    <Text style={{ width: scaleSize(140), fontSize: scaleSize(14), fontWeight: "500", color: TXT_COLOR, }} >
                        {`Time`}
                    </Text>
                    <Text style={{ width: scaleSize(160), fontSize: scaleSize(14), fontWeight: "500", color: TXT_COLOR, }} >
                        {`Date`}
                    </Text>
                    <Text style={{ flex: 1, fontSize: scaleSize(13), fontWeight: "600", color: TXT_COLOR, }} >
                        {`Message`}
                    </Text>
                </View>

                {/* ----------------- Rows Table ------------------ */}
                <FlatList
                    data={giftCardLogs}
                    renderItem={({ item, index }) => <View style={{ flexDirection: "row", minHeight: scaleSize(30) }} >
                        <Text style={{ width: scaleSize(140), fontSize: scaleSize(12), fontWeight: "500", color: TXT_COLOR_3, }} >
                            {`${formatWithMoment(item?.createdDate, "hh:mm ss A")}`}
                        </Text>
                        <Text style={{ width: scaleSize(160), fontSize: scaleSize(12), fontWeight: "500", color: TXT_COLOR_3, }} >
                            {`${formatWithMoment(item?.createdDate, "MMM DD, YYYY")}`}
                        </Text>
                        <Text style={{ flex: 1, fontSize: scaleSize(12), fontWeight: "600", color: TXT_COLOR_3, }} >
                            {`${item?.message || ""}`}
                        </Text>
                    </View>}
                    keyExtractor={(item, index) => `${item?.giftCardLogId}_${index}`}
                />



            </View >
        );
    }

}

const GiftCardDetailInfo = ({ title, value }) => {

    return (
        <View style={{ flexDirection: "row", height: scaleSize(25) }} >
            <Text style={{ width: scaleSize(150), fontSize: scaleSize(12), color: TXT_COLOR, fontWeight: "500" }} >
                {`${title}`}
            </Text>

            <Text style={{ fontSize: scaleSize(12), color: TXT_COLOR, fontWeight: "500" }} >
                {`${value}`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSize(4),
        ...Platform.select({
            ios: {
                shadowRadius: 2,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.6,
                shadowOffset: { width: 0, height: 1 },
            },

            android: {
                elevation: 2,
            },
        })
    },
    booking_txt: {
        color: "#0764B0",
        fontWeight: "bold",
        fontSize: scaleSize(18)
    }

})


const mapStateToProps = state => ({
    giftCardLogs: state.appointment.giftCardLogs
})



export default connectRedux(mapStateToProps, GiftCardDetailTab);