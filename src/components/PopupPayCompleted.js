import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';

import ModalCustom from './ModalCustom';
import ButtonCustom from './ButtonCustom';
import { scaleSzie } from '../utils';
import connectRedux from '@redux/ConnectRedux';
import ICON from "@resources";
import Button from "./Button";

class PopupPayCompleted extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSendLink: false
        }
    }

    switchSendLink = () => {
        this.setState((prevState) => ({ isSendLink: !prevState.isSendLink }));
    }

    handleSendGoogleLinkReview = () => {
        const { profile, customerInfoBuyAppointment } = this.props;
        const { isSendLink } = this.state;
        if (isSendLink) {
            this.props.actions.customer.sendGoogleReviewLink(customerInfoBuyAppointment?.customerId || 0, profile?.merchantId || 0);
        }
    }

    printBill = () => {
        this.handleSendGoogleLinkReview();
        this.props.printBill();
    }

    donotPrintBill = () => {
        this.handleSendGoogleLinkReview();
        this.props.donotPrintBill();
    }


    render() {
        const { visiblePaymentCompleted, style } = this.props;
        const { isSendLink } = this.state;

        const checkIcon = isSendLink ? ICON.checkBox : ICON.checkBoxEmpty;

        return (
            <ModalCustom
                transparent={true}
                visible={visiblePaymentCompleted}
                onRequestClose={() => { }}
                style={style}
            >
                <View style={{
                    width: scaleSzie(450), height: scaleSzie(230), backgroundColor: "#fff",
                    borderRadius: scaleSzie(16)
                }} >
                    <View style={{ flex: 1 }} >
                        {/* ---------- header ------ */}
                        <View style={{
                            alignItems: 'center', paddingTop: scaleSzie(16), paddingBottom: scaleSzie(12),
                        }} >
                            <Text style={{ color: '#0764B0', fontSize: scaleSzie(28), fontWeight: 'bold' }}  >
                                {`Transaction completed!`}
                            </Text>
                        </View>
                        {/* ------------ content ----- */}
                        <View style={{
                            alignItems: 'center'
                        }} >
                            <Text style={{ color: '#404040', fontSize: scaleSzie(20) }}  >
                                {`Do you want to print receipt?`}
                            </Text>
                        </View>
                        {/* ------------ Check box ----- */}
                        <View style={{
                            flex: 1, flexDirection: "row",
                            justifyContent: "center", alignItems: "center"
                        }} >
                            <Button onPress={this.switchSendLink} style={{ justifyContent: "center" }} >
                                <Image source={checkIcon} />
                            </Button>
                            <Text style={{ color: 'rgb(130,130,130)', fontSize: scaleSzie(18), marginLeft: scaleSzie(12) }}  >
                                {`Send Google Review Link`}
                            </Text>
                        </View>
                    </View>


                    <View style={{
                        height: scaleSzie(75), flexDirection: 'row', paddingHorizontal: scaleSzie(70),
                        alignItems: 'center', justifyContent: 'space-between',
                        borderTopWidth: 1, borderTopColor: "rgb(212,211,211)"
                    }} >
                        <ButtonCustom
                            width={scaleSzie(100)}
                            height={40}
                            backgroundColor="#0764B0"
                            // title={localize('Search', language)}
                            title="Yes"
                            textColor="#fff"
                            onPress={this.printBill}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(18), fontWeight: 'normal' }}
                        />

                        <ButtonCustom
                            width={scaleSzie(100)}
                            height={40}
                            backgroundColor="#F1F1F1"
                            title="No"
                            textColor="#6A6A6A"
                            onPress={this.donotPrintBill}
                            style={{ borderWidth: 1, borderColor: '#C5C5C5' }}
                            styleText={{ fontSize: scaleSzie(18), fontWeight: 'normal' }}
                        />
                    </View>

                </View>

            </ModalCustom>

        );
    }
}

const mapStateToProps = state => ({
    visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,
    profile: state.dataLocal.profile,
    customerInfoBuyAppointment: state.appointment.customerInfoBuyAppointment
});

export default connectRedux(mapStateToProps, PopupPayCompleted);

