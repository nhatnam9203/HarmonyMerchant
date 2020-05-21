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
        const { 
            // printMachine,
             isCheck, isSignature } = this.state;
        const printMachine = "BT:TSP100"
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
            console.log(error);
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
                            width: scaleSzie(300),
                            // height: scaleSzie(450) 
                        }} >

                        <View
                            style={{ height: scaleSzie(480) }}
                        >
                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={true}
                            >
                                <View style={{ height: scaleSzie(10) }} />
                                <View
                                    ref={this.viewShotRef}
                                    style={{ paddingHorizontal: scaleSzie(10) }}
                                >
                                    {/* -------------- Type Invoice + Staff Name -------------- */}
                                    <Text style={[styleInvoice.txt_normal, { fontWeight: "600" }]} >
                                        Weekly receipts - Adrienne Miller
                                    </Text>
                                    {/* -------------- Date -------------- */}
                                    <Text style={[styleInvoice.txt_normal, { fontWeight: "600", marginTop: 5 }]} >
                                        04/01/2020 - 04/07/2020
                                    </Text>
                                    {/* ------------- Dot Border  ----------- */}
                                    <ItemBorderBottom />
                                    {/* ------------- Part 1  ----------- */}
                                    <ItemStaffInvoice
                                        title="Service sales"
                                        value={`$ 1500.00`}
                                    />
                                    <ItemStaffInvoice
                                        title="Total time work"
                                        value={`20 hrs`}
                                    />
                                    <ItemStaffInvoice
                                        title="Product sales"
                                        value={`$ 1000.00`}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 1300.00`}
                                    />
                                    <ItemStaffInvoice
                                        title="Non-cash"
                                        value={`$ 1200.00`}
                                    />
                                    {/* ------------- Dot Border  ----------- */}
                                    <ItemBorderBottom />
                                    {/* ------------- Part 2.1  ----------- */}
                                    <ItemStaffInvoice
                                        title="1. Service payout (10%)"
                                        value={`$ 1000.00`}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 300.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ 700.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    {/* ------------- Part 2.2  ----------- */}
                                    <ItemStaffInvoice
                                        title="2. Working hour ($10)"
                                        value={`$ 200.00`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 300.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ 700.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    {/* ------------- Part 2.3  ----------- */}
                                    <ItemStaffInvoice
                                        title="3. Product payout (20%)"
                                        value={`$ 200.00`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 300.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ 700.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />

                                    {/* ------------- Part 2.4  ----------- */}
                                    <ItemStaffInvoice
                                        title="4. Tip payout"
                                        value={`$ 200.00`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 300.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Tip fee (2%)"
                                        value={`$ -4.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ 700.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    {/* ------------- Line   ----------- */}
                                    <View
                                        style={{ height: 2, backgroundColor: "#000", marginVertical: scaleSzie(10) }}
                                    />

                                    {/* ------------- Part Total  ----------- */}
                                    <ItemStaffInvoice
                                        title="Total payout"
                                        value={`$ 1596.00`}
                                        subTitle=" (1+2+3+4)"
                                        styleTilte={{ fontSize: scaleSzie(14), fontWeight: "600" }}
                                        styleValue={{ fontSize: scaleSzie(14), fontWeight: "600" }}
                                    />
                                     <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ 300.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ 700.00`}
                                        styleTilte={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(12), fontWeight: "200" }}
                                    />

                                </View>
                                <View style={{ height: scaleSzie(100) }} />
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

const ItemStaffInvoice = ({ title, value, style, styleTilte, styleValue, subTitle }) => {
    return (
        <View style={[{ flexDirection: "row", marginTop: 7 }, style]} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styleInvoice.txt_info, styleTilte]} >
                    {title}
                    <Text style={{fontWeight:"200"}} >
                        {subTitle}
                    </Text>
                </Text>
            </View>

            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styleInvoice.txt_info, styleValue]} >
                    {value}
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

const ItemBorderBottom = () => {
    return (
        <View style={{ height: 30 }} >
            <Text style={{ fontWeight: "200", fontSize: 22 }} >
                {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
            </Text>
        </View>
    );
}

const styleInvoice = StyleSheet.create({
    txt_normal: {
        color: "#000",
        fontSize: scaleSzie(13),
        alignSelf: "center",
        fontWeight: "200"
    },
    txt_info: {
        color: "#000",
        fontSize: scaleSzie(12),
        fontWeight: "400"
    },
    txt_total: {
        color: "#000",
        fontSize: scaleSzie(16),
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
