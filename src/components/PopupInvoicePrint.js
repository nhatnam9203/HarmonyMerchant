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
import { TextInputMask } from 'react-native-masked-text';
import { StarPRNT, AlignmentPosition } from 'react-native-star-prnt';
import ViewShot, { captureRef, releaseCapture } from "react-native-view-shot";

import ButtonCustom from './ButtonCustom';
import Button from './Button';
import { scaleSzie, localize, PRINTER_MACHINE, getPaymentString } from '../utils';
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

class PopupInvoicePrint extends React.Component {

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

        return paidAmounts.reverse();

    }

    getStaffNameForInvoice = () => {
        const { profileStaffLogin } = this.props;
        const { basket } = this.state;

        const staffNameLogin = profileStaffLogin.displayName ? profileStaffLogin.displayName : "";

        let temptName = "";
        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === "Service") {
                temptName = basket[i].staff && basket[i].staff.displayName ? basket[i].staff.displayName : "";
                break;
            }
        }
        return temptName ? temptName : staffNameLogin;
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
        const { language, visiblePrintInvoice, profile, profileStaffLogin, groupAppointment
        } = this.props;
        const { basket, temptSubTotal, temptTax, temptDiscount, temptTip, temptTotal, paymentSelected, isPrintTempt,
            isCheck, isSignature
        } = this.state;

        let invoiceCode = "";
        if (groupAppointment.appointments && groupAppointment.appointments.length > 0) {
            const mainAppointment = groupAppointment.appointments.find(appointment => appointment.isMain === 1);
            invoiceCode = mainAppointment.code ? mainAppointment.code : "";
        }

        const iconCheck = isCheck ? ICON.check_package_pricing : ICON.checkBoxEmpty;

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
                        {
                            isPrintTempt ? null : <View style={{ height: scaleSzie(40), backgroundColor: "#0764B0", flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                                <Button onPress={this.switchCheckbox} style={{ width: scaleSzie(40), height: scaleSzie(40), justifyContent: "center", alignItems: "center" }} >
                                    <Image source={iconCheck} style={{ width: scaleSzie(20), height: scaleSzie(20) }} />
                                </Button>
                                <Text style={{ color: "#fff", fontSize: scaleSzie(10), fontWeight: "600" }} >
                                    Do you want to print customer's receipt?
                             </Text>
                            </View>
                        }

                        <View
                            style={{ height: scaleSzie(450) }}
                        >
                            <ScrollView
                                style={{ flex: 1 }}
                                automaticallyAdjustContentInsets={true}
                            >
                                <View
                                    ref={this.viewShotRef}
                                    style={{ paddingHorizontal: scaleSzie(10) }}
                                // collapsable={false}
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
                                        SALE
                                </Text>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(8), }} >
                                        <Text style={{ fontWeight: "300" }} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>
                                    {/* ------------- Invoice Date ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                Invoice Date
                                        </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${this.getDate()} ${this.getHour()}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Staff ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                Staff Name
                                        </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${this.getStaffNameForInvoice()}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Invoice No ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(90) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                Invoice No
                                        </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${invoiceCode}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginTop: scaleSzie(4) }} >
                                        <Text style={{ fontWeight: "300" }} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>

                                    {/* ------------- Header  ----------- */}
                                    <View style={{ flexDirection: "row", marginTop: scaleSzie(6) }} >
                                        <View style={{ flex: 1, justifyContent: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`DESCRIPTION`}
                                            </Text>
                                        </View>
                                        <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`QTY`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 18, fontWeight: "400" }]} >
                                                {`PRICE`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(4) }} >
                                        <Text style={{ fontWeight: "300" }} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>

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



                                    {/* ------------- Entry Method   ----------- */}

                                    {
                                        !isPrintTempt ? <View>
                                            {
                                                (this.getPaymentMethods()).map((data, index) => <View key={index} style={{ marginBottom: scaleSzie(4) }} >
                                                    <Text style={[styleInvoice.txt_total,]} >
                                                        {`- Entry method : ${getPaymentString(data.paymentMethod)}`}
                                                    </Text>
                                                    {
                                                        data.paymentMethod === "credit_card" ?
                                                            <View style={{ marginTop: scaleSzie(5) }} >
                                                                <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                    {`    ${data.paymentInformation && data.paymentInformation.type ? data.paymentInformation.type : ""}: ***********${data.paymentInformation && data.paymentInformation.number ? data.paymentInformation.number : ""}`}
                                                                </Text>
                                                                <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10) }]} >
                                                                    {`    ${data.paymentInformation && data.paymentInformation.name ? data.paymentInformation.name : ""}`}
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
                                        isSignature ? <View style={{ height: scaleSzie(15), flexDirection: "row", marginTop: scaleSzie(15) }} >
                                            <View style={{ width: scaleSzie(70), justifyContent: "flex-end" }} >
                                                <Text style={[styleInvoice.txt_total, { fontSize: 18, fontWeight: "600" }]} >
                                                    {"Signature :"}
                                                </Text>
                                            </View>
                                            <View style={{ width: scaleSzie(50) }} />
                                            <View style={{ flex: 1, borderBottomColor: "#000", borderBottomWidth: 1, }} />
                                        </View> : <View />
                                    }



                                    {/* ----------- Thanks , see you again -------- */}
                                    <View style={{ height: scaleSzie(20) }} />
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", }]} >
                                        Thank you !
                                </Text>
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", }]} >
                                        Please come again
                                </Text>
                                    <View style={{ height: scaleSzie(8) }} />
                                    {/* ------------- This is not a bill   ----------- */}
                                    {
                                        isPrintTempt ?
                                            <Text style={[styleInvoice.txt_total, { fontSize: scaleSzie(10), fontWeight: "300", alignSelf: "center" }]} >
                                                {"*********** This is not a bill ***********"}
                                            </Text>
                                            : <View />

                                    }
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

export default connectRedux(mapStateToProps, PopupInvoicePrint);
