import React from "react";
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Modal,
    Alert
} from 'react-native';
import { StarPRNT } from 'react-native-star-prnt';
import { captureRef, releaseCapture } from "react-native-view-shot";
import Dash from 'react-native-dash';

import ButtonCustom from './ButtonCustom';
import {
    scaleSzie, localize, getPaymentString, formatMoney, formatWithMoment,
    getStaffNameForInvoice, getInfoFromModelNameOfPrinter, checkIsTablet
} from '../utils';
import connectRedux from '@redux/ConnectRedux';
import PrintManager from '@lib/PrintManager';


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
    isProcessingPrint: true,
    isCheck: false,
    isSignature: true,

    paymentMethods: [],
    titleInvoice: "SALE",
    invoiceNo: "",
    checkoutPayments: [],

    promotionNotes: ""
}

class PopupInvoicePrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.viewShotRef = React.createRef();
    }

    setStateFromParent = async (
        basket, temptSubTotal, temptTax, temptDiscount,
        temptTip, temptTotal, paymentSelected, isPrintTempt, printMachine, promotionNotes,
        titleInvoice = "SALE", invoiceNo = "", checkoutPayments = []
    ) => {

        await this.setState({
            basket,
            temptSubTotal,
            temptTax,
            temptDiscount,
            temptTip,
            temptTotal,
            paymentSelected,
            isPrintTempt,
            printMachine,
            paymentMethods: this.getPaymentMethods(),
            titleInvoice,
            invoiceNo,
            checkoutPayments: checkoutPayments,
            promotionNotes
        });
        setTimeout(() => {
            this.doPrint();
        }, 1000)

    }

    doPrint = async () => {
        const { printerSelect, printerList } = this.props;
        const { isSignature } = this.state;
        const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(printerList, printerSelect);

        try {
            await this.setState({
                isProcessingPrint: true
            });
            const imageUri = await captureRef(this.viewShotRef, {});
            if (imageUri) {
                let commands = [];
                commands.push({ appendLineFeed: 0 });
                commands.push({ appendBitmap: imageUri, width: parseFloat(widthPaper), bothScale: true, diffusion: true, alignment: "Center" });
                commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });

                await PrintManager.getInstance().print(emulation, commands, portName);
                const { isPrintTempt } = this.state;
                releaseCapture(imageUri);

                if (!isPrintTempt && isSignature) {
                    Alert.alert(
                        "Would you like to print  customer's receipt?",
                        "",
                        [

                            {
                                text: "Cancel",
                                onPress: () => {
                                    this.setState(initalState);
                                    this.props.onRequestClose(isPrintTempt);
                                },
                                style: "cancel"
                            },
                            {
                                text: "OK", onPress: () => this.doPrintAgain()
                            }
                        ],
                        { cancelable: false }
                    );
                } else {
                    await this.setState(initalState);
                    this.props.onRequestClose(isPrintTempt);
                }
            }
        } catch (error) {
            // console.log("---- errror : ",);
            alert(error)
            await this.setState({
                isProcessingPrint: false
            });

        }
    }



    processPrintInvoice = async () => {
        await this.doPrint();
    }

    doPrintAgain = async () => {
        await this.setState({
            isSignature: false
        });
        setTimeout(() => {
            this.doPrint();
        }, 500)
    }

    getDate() {
        return formatWithMoment(new Date(), "MM/DD/YYYY");
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
        return paymentDetailInfo.paidAmounts && paymentDetailInfo.paidAmounts.length > 0 ? (paymentDetailInfo.paidAmounts).slice(0).reverse() : [];
    }


    // -------------- Render --------------
    renderLoadingProcessingPrint() {
        if (this.state.isProcessingPrint) {
            return (
                <View style={{
                    height: scaleSzie(490), width: scaleSzie(290),
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
        const { language, visiblePrintInvoice, profile, paymentDetailInfo, profileStaffLogin } = this.props;
        const { basket, temptSubTotal, temptTax, temptDiscount, temptTip, temptTotal, isPrintTempt,
            isSignature, paymentMethods, titleInvoice, invoiceNo, checkoutPayments, promotionNotes
        } = this.state;
        const temtCheckoutPayment = paymentMethods.length > 0 ? paymentMethods : checkoutPayments;
        const tempHeight = checkIsTablet() ? scaleSzie(400) : scaleSzie(450);

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
                        }} >

                        <View
                            style={{ height: tempHeight }}
                        >
                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={true}
                                keyboardShouldPersistTaps="always"
                            >
                                <View
                                    ref={this.viewShotRef}
                                    style={{ paddingHorizontal: scaleSzie(10), backgroundColor: '#FFFFFF' }}
                                >
                                    {/* ------------- Store Name ----------- */}
                                    <Text style={[styleInvoice.txt_normal, { fontSize: 24, fontWeight: "600", marginTop: scaleSzie(8) }]} >
                                        {profile.businessName ? profile.businessName : ""}
                                    </Text>
                                    {/* ------------- Store Address ----------- */}
                                    <Text numberOfLines={1} style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10), marginTop: scaleSzie(4) }]} >
                                        {profile.addressFull ? profile.addressFull : ''}
                                    </Text>
                                    {/* ------------- Phone Address ----------- */}
                                    <Text style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                        {`Tel : ${profile.phone ? profile.phone : ""}`}
                                    </Text>
                                    {/* ------------- Company Website ----------- */}
                                    {
                                        profile.webLink ? <Text style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                            {profile.webLink ? profile.webLink : ""}
                                        </Text> : <View />
                                    }

                                    {/* ------------- SALE/VOID/REFUND  ----------- */}
                                    <Text style={[styleInvoice.txt_normal, {
                                        fontSize: 20, fontWeight: "600",
                                        marginTop: scaleSzie(6), marginBottom: scaleSzie(6)
                                    }]} >
                                        {titleInvoice}
                                    </Text>
                                    {/* ------------- Dot Border  ----------- */}
                                    <Dash
                                        style={{ width: "100%", height: 1 }}
                                        dashGap={5}
                                        dashLength={8}
                                        dashThickness={1}
                                        style={{ marginBottom: scaleSzie(10) }}
                                    />

                                    {/* ------------- Invoice Date ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`Invoice Date`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Staff ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`Staff Name`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${getStaffNameForInvoice(profileStaffLogin, basket)}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Invoice No ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`Invoice No`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${invoiceNo ? invoiceNo : (paymentDetailInfo.invoiceNo ? paymentDetailInfo.invoiceNo : "")}`}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* ------------- Dot Border  ----------- */}
                                    <Dash
                                        style={{ width: "100%", height: 1 }}
                                        dashGap={5}
                                        dashLength={8}
                                        dashThickness={1}
                                        style={{ marginBottom: scaleSzie(4), marginTop: scaleSzie(10) }}
                                    />

                                    {/* ------------- Header  ----------- */}
                                    <View style={{ flexDirection: "row", marginTop: scaleSzie(6) }} >
                                        <View style={{ flex: 0.8, justifyContent: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`DESCRIPTION`}
                                            </Text>
                                        </View>
                                        <View style={{ justifyContent: "center", width: scaleSzie(70) }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`PRICE`}
                                            </Text>
                                        </View>
                                        <View style={{ width: scaleSzie(30), justifyContent: "center", alignItems: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`QTY`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.5, justifyContent: "center", alignItems: "flex-end" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`TOTAL`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Dot Border  ----------- */}
                                    <Dash
                                        style={{ width: "100%", height: 1 }}
                                        dashGap={5}
                                        dashLength={8}
                                        dashThickness={1}
                                        style={{ marginBottom: scaleSzie(4), marginTop: scaleSzie(10) }}
                                    />

                                    {/* ------------- Item Invoice   ----------- */}
                                    {
                                        basket.map((item, index) => <ItemInvoice
                                            key={index}
                                            item={item}
                                            index={index}
                                        />)
                                    }

                                    {/* ------------- Line end item invoice   ----------- */}
                                    <View
                                        style={{ height: 2, backgroundColor: "#000", marginVertical: scaleSzie(10) }}
                                    />
                                    {/* ------------- SubTotal   ----------- */}
                                    <ItemTotal
                                        title={"Subtotal"}
                                        value={temptSubTotal}
                                    />
                                    <ItemTotal
                                        title={"Discount"}
                                        value={temptDiscount}
                                    />
                                    <ItemTotal
                                        title={"Tip"}
                                        value={temptTip}
                                    />
                                    <ItemTotal
                                        title={"Tax"}
                                        value={temptTax}
                                    />
                                    {
                                        isPrintTempt ? <View /> : <ItemTotal
                                            title={"Total"}
                                            value={temptTotal}
                                        // style={{ fontSize: 15, }}
                                        />

                                    }

                                    {/* ------------- Enter Tip   ----------- */}
                                    {
                                        isPrintTempt ? <View style={{ height: scaleSzie(25), flexDirection: "row", marginBottom: scaleSzie(12) }} >
                                            <View style={{ width: scaleSzie(70), justifyContent: "flex-end" }} >
                                                <Text style={[styleInvoice.txt_total, { fontSize: 20, fontWeight: "600" }]} >
                                                    {"Tip :"}
                                                </Text>
                                            </View>
                                            <View style={{ width: scaleSzie(50) }} />
                                            <View style={{ flex: 1, borderBottomColor: "#000", borderBottomWidth: 1, }} />
                                        </View> : <View />
                                    }

                                    {/* ------------- Enter Total   ----------- */}
                                    {
                                        isPrintTempt ? <View style={{ height: scaleSzie(25), flexDirection: "row", marginBottom: scaleSzie(12) }} >
                                            <View style={{ width: scaleSzie(70), justifyContent: "flex-end" }} >
                                                <Text style={[styleInvoice.txt_total, { fontSize: 20, fontWeight: "600" }]} >
                                                    {"Total :"}
                                                </Text>
                                            </View>
                                            <View style={{ width: scaleSzie(50) }} />
                                            <View style={{ flex: 1, borderBottomColor: "#000", borderBottomWidth: 1, }} />
                                        </View> : <View />
                                    }


                                    {/* ------------- Entry Method   ----------- */}

                                    {
                                        !isPrintTempt ? <View>
                                            {
                                                temtCheckoutPayment.map((data, index) => <View key={index} style={{ marginBottom: scaleSzie(4) }} >
                                                    <View style={{ flexDirection: "row" }} >
                                                        <Text style={[styleInvoice.txt_total,]} >
                                                            {`- Entry method: ${getPaymentString(data.paymentMethod ? data.paymentMethod : "")}`}
                                                        </Text>
                                                        <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }} >
                                                            <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                {`$${data.amount ? data.amount : ""}`}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    {
                                                        data.paymentMethod && data.paymentMethod === "credit_card" || data.paymentMethod === "debit_card" ?
                                                            <View style={{ marginTop: scaleSzie(5) }} >
                                                                <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                    {`    ${data.paymentInformation && data.paymentInformation.type ? data.paymentInformation.type : ""}: ***********${data.paymentInformation && data.paymentInformation.number ? data.paymentInformation.number : ""}`}
                                                                </Text>
                                                                <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                    {`    ${data.paymentInformation && data.paymentInformation.name ? data.paymentInformation.name : ""}`}
                                                                </Text>
                                                                <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                    {`    ${data.paymentInformation && data.paymentInformation.refNum ? `Transaction #: ${data.paymentInformation.refNum}` : ""}`}
                                                                </Text>
                                                            </View>
                                                            : null
                                                    }
                                                </View>)
                                            }
                                        </View>
                                            : <View />
                                    }

                                    {
                                        isSignature && !isPrintTempt ? <View style={{ height: scaleSzie(15), flexDirection: "row", marginTop: scaleSzie(15) }} >
                                            <View style={{ width: scaleSzie(70), justifyContent: "flex-end" }} >
                                                <Text style={[styleInvoice.txt_total, { fontSize: 18, fontWeight: "600" }]} >
                                                    {"Signature:"}
                                                </Text>
                                            </View>
                                            <View style={{ width: scaleSzie(50) }} />
                                            <View style={{ flex: 1, borderBottomColor: "#000", borderBottomWidth: 1, }} />
                                        </View> : <View />
                                    }

                                    {
                                        isPrintTempt ? <View style={{ height: scaleSzie(15), flexDirection: "row", marginTop: scaleSzie(15) }} >
                                            <View style={{ width: scaleSzie(70), justifyContent: "flex-end" }} >
                                                <Text style={[styleInvoice.txt_total, { fontSize: 18, fontWeight: "600" }]} >
                                                    {"Signature:"}
                                                </Text>
                                            </View>
                                            <View style={{ width: scaleSzie(50) }} />
                                            <View style={{ flex: 1, borderBottomColor: "#000", borderBottomWidth: 1, }} />
                                        </View> : <View />
                                    }


                                    {
                                        promotionNotes ? <Text style={{
                                            fontSize: 16, fontWeight: "bold",
                                            marginTop: scaleSzie(10)
                                        }} >
                                            {`Discount note: `}
                                            <Text style={{ fontWeight: "500" }} >
                                                {`${promotionNotes}`}
                                            </Text>
                                        </Text> : null
                                    }



                                    {/* ----------- Thanks , see you again -------- */}
                                    <View style={{ height: scaleSzie(20) }} />
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", }]} >
                                        {`Thank you!`}
                                    </Text>
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", }]} >
                                        {`Please come again`}
                                    </Text>
                                    <View style={{ height: scaleSzie(8) }} />
                                    {/* ------------- This is not a bill   ----------- */}
                                    <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10), fontWeight: "300", alignSelf: "center" }]} >
                                        {`*********** ${isPrintTempt ? "Customer's Receipt" : (isSignature ? "Merchant's Receipt" : "Customer's Receipt")} ***********`}
                                    </Text>

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
    const price = item.data && item.data.price ? item.data.price : 0;
    const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
    const total = formatMoney(price * quanlitySet);
    const note = item.note ? item.note : "";

    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 0.8, justifyContent: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
                </Text>
                {/* ------------ Note -------- */}
                {
                    note ?
                        <Text style={[styleInvoice.txt_info, { fontSize: 13, marginLeft: 8 }]} >
                            {`(Note: ${note})`}
                        </Text> : null
                }
            </View>
            <View style={{ justifyContent: "center", width: scaleSzie(70) }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`$ ${price}`}
                </Text>
            </View>
            <View style={{
                // width: scaleSzie(50), justifyContent: "center", alignItems: "center",
                width: scaleSzie(30), justifyContent: "center", alignItems: "center",
                // paddingLeft: scaleSzie(6)
            }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {quanlitySet}
                </Text>
            </View>
            <View style={{
                flex: 0.5, justifyContent: "center", alignItems: "flex-end",
            }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`$ ${total ? total : ""}`}
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
    paymentDetailInfo: state.appointment.paymentDetailInfo,

    printerSelect: state.dataLocal.printerSelect,
    printerList: state.dataLocal.printerList
});

export default connectRedux(mapStateToProps, PopupInvoicePrint);
