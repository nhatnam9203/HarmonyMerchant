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
import _ from "ramda";

import { Button, ButtonCustom } from '@components';
import { scaleSzie, localize, PRINTER_MACHINE, formatWithMoment, checkStatusPrint } from '@utils';
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

    doPrint = async (printMachine) => {
        // const { printMachine,} = this.state;
        // const printMachine = "BT:TSP100"
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
                releaseCapture(imageUri);

                await this.setState({
                    isProcessingPrint: false
                });
            }
        } catch (error) {
            // console.log(error);
            await this.setState({
                isProcessingPrint: false
            });

        }
    }

    processPrintInvoice = async () => {
        const printMachine = await checkStatusPrint();
        if (printMachine) {
            await this.setState({
                isSignature: true
            });
            this.doPrint(printMachine);
        } else {
            alert('Please connect to your cash drawer.');
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

    findReceiptType = (type) => {
        const { staff } = this.props;
        if (_.isEmpty(staff)) {
            return false
        }
        const receipts = staff.receipts ? staff.receipts : [];
        if (receipts.length === 0) {
            return false;
        }

        const receipt = receipts.find((item) => item.receiptType === type);
        return receipt

    }

    // -------------- Render --------------

    renderLoadingProcessingPrint() {
        if (this.state.isProcessingPrint) {
            return (
                <View style={{
                    height: scaleSzie(530), width: scaleSzie(290),
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
        const { language, visiblePrintInvoice, staff } = this.props;

        const receiptType = staff.receiptType ? staff.receiptType : "";
        const staffName = staff.name ? staff.name : "";
        const fromTime = staff.from ? formatWithMoment(staff.from, "MM/DD/YYYY") : "";
        const toTime = staff.to ? formatWithMoment(staff.to, "MM/DD/YYYY") : "";
        const sales = staff.serviceSales ? staff.serviceSales : "0.00";
        const workingHour = staff.workingHour ? staff.workingHour : "0";
        const product = staff.productSales ? staff.productSales : "0.00";
        const cash = staff.cash ? staff.cash : "0.00";
        const nonCash = staff.nonCash ? staff.nonCash : "0.00";

        const servicePayout = this.findReceiptType("ServicePayout");
        const workingHourReceipt = this.findReceiptType("WorkingHour");
        const productPayout = this.findReceiptType("ProductPayout");
        const tippayout = this.findReceiptType("Tippayout");
        const totalReceipt = this.findReceiptType("Total");

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
                            width: scaleSzie(290),
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
                                    style={{ paddingHorizontal: 20 }}
                                >
                                    {/* -------------- Type Invoice + Staff Name -------------- */}
                                    <Text style={[styleInvoice.txt_normal, { fontSize: scaleSzie(14), fontWeight: "600" }]} >
                                        {`${receiptType} receipts - ${staffName}`}
                                    </Text>
                                    {/* -------------- Date -------------- */}
                                    <Text style={[styleInvoice.txt_normal, { fontWeight: "600", marginTop: 5 }]} >
                                        {`${fromTime} - ${toTime}`}
                                    </Text>
                                    {/* ------------- Dot Border  ----------- */}
                                    <ItemBorderBottom />
                                    {/* ------------- Part 1  ----------- */}
                                    <ItemStaffInvoice
                                        title="Service Sales"
                                        value={`$ ${sales}`}
                                    />
                                    <ItemStaffInvoice
                                        title="Total Time Work"
                                        value={`${workingHour} hrs`}
                                    />
                                    <ItemStaffInvoice
                                        title="Product Sales"
                                        value={`$ ${product}`}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ ${cash}`}
                                    />
                                    <ItemStaffInvoice
                                        title="Non-Cash"
                                        value={`$ ${nonCash}`}
                                    />
                                    {/* ------------- Dot Border  ----------- */}
                                    <ItemBorderBottom />
                                    {/* ------------- Service payout  ----------- */}
                                    <ItemStaffInvoice
                                        title={`1. Service Payout (${servicePayout && servicePayout.commission ? servicePayout.commission : "0.00"}%)`}
                                        value={`$ ${servicePayout && servicePayout.total ? servicePayout.total : "0.00"}`}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ ${servicePayout && servicePayout.cash ? servicePayout.cash : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ ${servicePayout && servicePayout.check ? servicePayout.check : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    {/* ------------- Working hour ----------- */}
                                    <ItemStaffInvoice
                                        title={`2. Working Hour ($ ${workingHourReceipt && workingHourReceipt.commission ? workingHourReceipt.commission : "0.00"})`}
                                        value={`$ ${workingHourReceipt && workingHourReceipt.total ? workingHourReceipt.total : "0.00"}`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ ${workingHourReceipt && workingHourReceipt.cash ? workingHourReceipt.cash : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ ${workingHourReceipt && workingHourReceipt.check ? workingHourReceipt.check : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    {/* ------------- Product payout  ----------- */}
                                    <ItemStaffInvoice
                                        title={`3. Product Payout (${productPayout && productPayout.commission ? productPayout.commission : "0.00"}%)`}
                                        value={`$ ${productPayout && productPayout.total ? productPayout.total : "0.00"}`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />

                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ ${productPayout && productPayout.cash ? productPayout.cash : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ ${productPayout && productPayout.check ? productPayout.check : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />

                                    {/* -------------  Tip payout  ----------- */}
                                    <ItemStaffInvoice
                                        title="4. Tip Payout"
                                        value={`$ ${tippayout && tippayout.total ? tippayout.total : "0.00"}`}
                                        style={{ marginTop: scaleSzie(15) }}
                                    />

                                    <ItemStaffInvoice
                                        title="Tip Total"
                                        value={`$ ${tippayout && tippayout.subTotal ? tippayout.subTotal : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title={`Tip Fee (${tippayout && tippayout.fee && tippayout.fee.value ? tippayout.fee.value : "0.00%"})`}
                                        value={`$ ${tippayout && tippayout.fee && tippayout.fee.amount ? tippayout.fee.amount : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ ${tippayout && tippayout.check ? tippayout.check : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    {/* ------------- Line   ----------- */}
                                    <View
                                        style={{ height: 2, backgroundColor: "#000", marginVertical: scaleSzie(10) }}
                                    />

                                    {/* ------------- Total payout  ----------- */}
                                    <ItemStaffInvoice
                                        title="Total Payout"
                                        value={`$ ${totalReceipt && totalReceipt.total ? totalReceipt.total : "0.00"}`}
                                        subTitle=" (1+2+3+4)"
                                        styleTilte={{ fontSize: scaleSzie(14), fontWeight: "600" }}
                                        styleValue={{ fontSize: scaleSzie(14), fontWeight: "600" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Cash"
                                        value={`$ ${totalReceipt && totalReceipt.cash ? totalReceipt.cash : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                    />
                                    <ItemStaffInvoice
                                        title="Check"
                                        value={`$ ${totalReceipt && totalReceipt.check ? totalReceipt.check : "0.00"}`}
                                        styleTilte={{ fontSize: scaleSzie(13), fontWeight: "200" }}
                                        styleValue={{ fontSize: scaleSzie(13), fontWeight: "200" }}
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
                    <Text style={{ fontWeight: "200" }} >
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
