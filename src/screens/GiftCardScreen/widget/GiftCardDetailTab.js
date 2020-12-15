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
    scaleSzie, formatWithMoment, getArrayProductsFromAppointment, getArrayServicesFromAppointment, getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment,
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
        };
        this.onEndReachedCalledDuringMomentum = true;
        this.popupAppointmentDetailRef = React.createRef();
    }

    render() {
        const { pastAppointments, customerHistory, isLoadMorePastAppointment, stateCity } = this.props;
        const { customer, visible } = this.state;
        const firstLetter = customer?.firstName ? customer?.firstName[0] : "";

        return (
            <View style={{ flex: 1, paddingHorizontal: scaleSzie(15), paddingTop: scaleSzie(20) }} >
                <Text style={{ fontSize: scaleSzie(14), fontWeight: "600", color: TXT_COLOR, marginBottom: scaleSzie(10) }} >
                    {`Gift Card Detail`}
                </Text>

                <GiftCardDetailInfo
                    title={"ID"}
                    value={"1005"}
                />

                <GiftCardDetailInfo
                    title={"Serial"}
                    value={"1005424324424432"}
                />

                <GiftCardDetailInfo
                    title={"Created On"}
                    value={`${formatWithMoment(new Date(), "MMM DD, YYYY")}`}
                />

                <GiftCardDetailInfo
                    title={"Value On"}
                    value={`$ 193.00`}
                />

                {/* ------------------- Line -------------------- */}
                <View style={{ height: 2, backgroundColor: TXT_COLOR_2, marginTop: scaleSzie(5), marginBottom: scaleSzie(10) }} />

                <Text style={{ fontSize: scaleSzie(14), fontWeight: "600", color: TXT_COLOR, marginBottom: scaleSzie(15) }} >
                    {`Logs`}
                </Text>

                {/* ----------------- Header Table ------------------ */}
                <View style={{ flexDirection: "row", height: scaleSzie(25) }} >
                    <Text style={{ width: scaleSzie(140), fontSize: scaleSzie(14), fontWeight: "500", color: TXT_COLOR, }} >
                        {`Time`}
                    </Text>
                    <Text style={{ width: scaleSzie(180), fontSize: scaleSzie(14), fontWeight: "500", color: TXT_COLOR, }} >
                        {`Date`}
                    </Text>
                    <Text style={{ flex: 1, fontSize: scaleSzie(13), fontWeight: "600", color: TXT_COLOR, }} >
                        {`Message`}
                    </Text>
                </View>

                {/* ----------------- Rows Table ------------------ */}

                <View style={{ flexDirection: "row", minHeight: scaleSzie(30) }} >
                    <Text style={{ width: scaleSzie(140), fontSize: scaleSzie(12), fontWeight: "500", color: TXT_COLOR_3, }} >
                    {`${formatWithMoment(new Date(), "hh:mm ss A")}`}
                    </Text>
                    <Text style={{ width: scaleSzie(180), fontSize: scaleSzie(12), fontWeight: "500", color: TXT_COLOR_3, }} >
                    {`${formatWithMoment(new Date(), "MMM DD, YYYY")}`}
                    </Text>
                    <Text style={{ flex: 1, fontSize: scaleSzie(12), fontWeight: "600", color: TXT_COLOR_3, }} >
                        {`Message`}
                    </Text>
                </View>

            </View >
        );
    }

}

const GiftCardDetailInfo = ({ title, value }) => {

    return (
        <View style={{ flexDirection: "row", height: scaleSzie(25) }} >
            <Text style={{ width: scaleSzie(150), fontSize: scaleSzie(12), color: TXT_COLOR, fontWeight: "500" }} >
                {`${title}`}
            </Text>

            <Text style={{ fontSize: scaleSzie(12), color: TXT_COLOR, fontWeight: "500" }} >
                {`${value}`}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    SHADOW: {
        backgroundColor: "#fff",
        borderRadius: scaleSzie(4),
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
        fontSize: scaleSzie(18)
    }

})


const mapStateToProps = state => ({

})



export default connectRedux(mapStateToProps, GiftCardDetailTab);