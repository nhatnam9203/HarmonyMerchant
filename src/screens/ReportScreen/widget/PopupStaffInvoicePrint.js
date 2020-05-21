import React from 'react';
import {
    View,
    Text,
    Keyboard,
    ActivityIndicator,
    DeviceEventEmitter,
    Platform,
    ScrollView,
    StyleSheet,
    Modal,
    Image
} from 'react-native';
import { StarPRNT } from 'react-native-star-prnt';
import { captureRef, releaseCapture } from "react-native-view-shot";

import { Button, ButtonCustom } from '@components';
import { scaleSzie, localize, PRINTER_MACHINE, getPaymentString } from '@utils';
import connectRedux from '@redux/ConnectRedux';
import PrintManager from '@lib/PrintManager';
import ICON from "@resources";

const initalState = {
    basket: [],
    temptSubTotal: 0.00,
    temptTax: 0.00,
    temptDiscount: 0.00,
    temptTip: 0.00,
    temptTotal: 0.00,
    paymentSelected: "",
    isPrintTempt: true,
    printMachine: "",
    isProcessingPrint: false,
    isCheck: false,
    isSignature: false
}

class PopupStaffInvoicePrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.viewShotRef = React.createRef();
    }

    setStateFromParent = async (basket, temptSubTotal, temptTax, temptDiscount, temptTip, temptTotal, paymentSelected, isPrintTempt, printMachine) => {
        await this.setState({
            basket,
            temptSubTotal,
            temptTax,
            temptDiscount,
            temptTip,
            temptTotal,
            paymentSelected,
            isPrintTempt,
            printMachine
        })
    }

    doPrint = async () => {
        const { printMachine, isCheck, isSignature } = this.state;
        try {
            await this.setState({
                isProcessingPrint: true
            });
            const imageUri = await captureRef(this.viewShotRef, {});
            if (imageUri) {
                let commands = [];
                commands.push({ appendLineFeed: 0 });
                commands.push({ appendBitmap: imageUri, width: PRINTER_MACHINE[printMachine].widthPaper, bothScale: true, diffusion: true, alignment: "Center" });
                commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });

                await PrintManager.getInstance().print(printMachine, commands);
                const { isPrintTempt } = this.state;
                releaseCapture(imageUri);

                if (!isCheck || isSignature) {
                    await this.setState(initalState);
                    this.props.onRequestClose(isPrintTempt);
                }
            }
        } catch (error) {
            await this.setState({
                isProcessingPrint: false
            });

        }
    }

    processPrintInvoice = async () => {
        const { isCheck } = this.state;
        this.doPrint();
        if (isCheck) {
            await this.setState({
                isSignature: true
            });
            setTimeout(() => {
                this.doPrint();
            }, 500)

        }
    }

    getHour() {
        const hours = parseInt(new Date().getHours()) - 12 > 0 ? `0${parseInt(new Date().getHours()) - 12}` : parseInt(new Date().getHours());
        const surfix = parseInt(new Date().getHours()) - 12 > 0 ? 'PM' : 'AM'
        const temptDate = `${hours}:${(new Date().getMinutes()) > 10 ? (new Date().getMinutes()) : `0${(new Date().getMinutes())}`} ${surfix}`;

        return temptDate;
    }

    getDate() {
        return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    }

    cancelInvoicePrint = async () => {
        const { isPrintTempt } = this.state;

        let tempt = isPrintTempt;
        await this.setState(initalState);
        this.props.onRequestClose(tempt);
    }

    switchCheckbox = () => {
        this.setState(prevState => ({
            isCheck: !prevState.isCheck
        }))
    }

    getPaymentMethods = () => {
        const { paymentDetailInfo } = this.props;
        const paidAmounts = paymentDetailInfo.paidAmounts ? paymentDetailInfo.paidAmounts : [{ paymentMethod: "" }];

        return paidAmounts;

    }

    // -------------- Render --------------

    renderLoadingProcessingPrint() {
        if (this.state.isProcessingPrint) {
            return (
                <View style={{
                    height: scaleSzie(530), width: scaleSzie(270),
                    position: "absolute", top: 0, bottom: 0, left: 0, rightL: 0, backgroundColor: "rgba(0,0,0,0.2)",
                    justifyContent: "center", alignItems: "center"
                }} >
                    <ActivityIndicator
                        size="large"
                        color="#0764B0"
                    />
                </View>
            );
        }
        return null;
    }

    render() {
        const { language, visiblePrintInvoice } = this.props;
        const { } = this.state;

        return (
            <Modal
                visible={visiblePrintInvoice}
                onRequestClose={() => { }}
                transparent={true}
            >
                <View
                    style={[{
                        flex: 1, justifyContent: 'center', alignItems: 'center',
                        backgroundColor: "rgba(0,0,0,0.6)"
                    },]} >
                    <View
                        style={{
                            backgroundColor: "#fff",
                            width: scaleSzie(270),
                            // height: scaleSzie(450) 
                        }} >

                        <View
                            style={{ height: scaleSzie(480) }}
                        >
                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={true}
                            >
                                <View
                                    ref={this.viewShotRef}
                                    style={{ paddingHorizontal: scaleSzie(10) }}

                                >


                                </View>


                                <View style={{ height: scaleSzie(30) }} />
                            </ScrollView>
                        </View>


                        {/* ------ Button ----- */}
                        < View style={{
                            height: scaleSzie(40), justifyContent: 'center',
                            flexDirection: "row"
                        }} >
                            <ButtonCustom
                                width={'30%'}
                                height={30}
                                backgroundColor="#0764B0"
                                title={localize('CANCEL', language)}
                                textColor="#fff"
                                onPress={this.cancelInvoicePrint}
                                styleText={{
                                    fontSize: scaleSzie(10),
                                    fontWeight: "600",
                                    color: "#404040"
                                }}
                                style={{
                                    borderRadius: 4,
                                    borderColor: "#CCCCCC",
                                    borderWidth: 1,
                                    backgroundColor: "#F1F1F1"
                                }}
                            />
                            <View style={{ width: scaleSzie(35) }} />
                            <ButtonCustom
                                width={'30%'}
                                height={30}
                                backgroundColor="#0764B0"
                                title={localize('PRINT', language)}
                                textColor="#fff"
                                onPress={this.processPrintInvoice}
                                styleText={{
                                    fontSize: scaleSzie(10),
                                    fontWeight: "600"
                                }}
                                style={{
                                    borderRadius: 4
                                }}
                            />
                        </ View>

                        {this.renderLoadingProcessingPrint()}
                    </View>
                </View>


            </Modal>
        );
    }


}

const ItemInvoice = ({ item, index }) => {
    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {item.quanlitySet ? item.quanlitySet : ""}
                </Text>
            </View>
            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`$ ${item.data && item.data.price ? item.data.price : ""}`}
                </Text>
            </View>
        </View>
    );
}

const ItemTotal = ({ title, value, style }) => {
    return (
        <View style={{ flexDirection: "row", marginBottom: scaleSzie(4) }} >
            <Text style={[styleInvoice.txt_total, { alignSelf: "flex-start", fontWeight: "600" }, style]} >
                {title}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[styleInvoice.txt_total, { alignSelf: "flex-end", fontWeight: "400" }, style]} >
                {`$ ${value}`}
            </Text>
        </View>
    );
}

const styleInvoice = StyleSheet.create({
    txt_normal: {
        color: "#000",
        fontSize: 18,
        alignSelf: "center",
        fontWeight: "200"
    },
    txt_info: {
        color: "#000",
        fontSize: 18,
        fontWeight: "200"
    },
    txt_total: {
        color: "#000",
        fontSize: 20,
        fontWeight: "200"

    }
})


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    profile: state.dataLocal.profile,
    groupAppointment: state.appointment.groupAppointment,
    paymentDetailInfo: state.appointment.paymentDetailInfo
});

export default connectRedux(mapStateToProps, PopupStaffInvoicePrint);
