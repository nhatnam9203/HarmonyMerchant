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
    Modal
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { StarPRNT, AlignmentPosition } from 'react-native-star-prnt';
import ViewShot, { captureRef } from "react-native-view-shot";

import ButtonCustom from './ButtonCustom';
import PopupParent from './PopupParent';
import { scaleSzie, localize } from '../utils';
import connectRedux from '@redux/ConnectRedux';
import PrintManager from '@lib/PrintManager';

class PopupInvoicePrint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            basket: [],
            temptSubTotal:0.00,
            temptTax:0.00,
            temptDiscount:0.00,
            temptTip:0.00,
            temptTotal:0.00,
            paymentSelected:""
        }
        this.viewShotRef = React.createRef();
    }

    setStateFromParent = async (basket,temptSubTotal,temptTax,temptDiscount,temptTip,temptTotal,paymentSelected) => {
        await this.setState({
            basket,
            temptSubTotal,
            temptTax,
            temptDiscount,
            temptTip,
            temptTotal,
            paymentSelected
        })
    }

    doPrint = async () => {
        try {
            const imageUri = await captureRef(this.viewShotRef, {});
            if (imageUri) {
                let commands = [];
                commands.push({ appendLineFeed: 0 });
                commands.push({ appendBitmap: imageUri });
                commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });
                PrintManager.getInstance().print("BT:TSP100", commands);
            }
        } catch (error) {
            console.log("error : ", error);
            alert(error)
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


    // -------------- Render --------------

    render() {
        const { onRequestClose, language, visiblePrintInvoice, profile, profileStaffLogin
        } = this.props;
        const { basket,temptSubTotal,temptTax,temptDiscount,temptTip,temptTotal,paymentSelected } = this.state;

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
                            width: scaleSzie(270)
                        }} >
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
                                    <Text style={[styleInvoice.txt_normal, { fontSize: 15, fontWeight: "600", marginTop: scaleSzie(8) }]} >
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
                                        fontSize: 18, fontWeight: "bold",
                                        marginTop: scaleSzie(6), marginBottom: scaleSzie(6)
                                    }]} >
                                        SALE
                                </Text>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(8), }} >
                                        <Text style={{}} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>
                                    {/* ------------- Invoice Date ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(70) }} >
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
                                        <View style={{ width: scaleSzie(70) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                Staff Name
                                        </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: ${profileStaffLogin.displayName ? profileStaffLogin.displayName : ""}`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Invoice No ----------- */}
                                    <View style={{ flexDirection: "row" }} >
                                        <View style={{ width: scaleSzie(70) }} >
                                            <Text style={styleInvoice.txt_info} >
                                                Invoice No
                                        </Text>
                                        </View>
                                        <View style={{ flex: 1 }} >
                                            <Text style={styleInvoice.txt_info} >
                                                {`: 198832434420324`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginTop: scaleSzie(4) }} >
                                        <Text style={{}} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>

                                    {/* ------------- Header  ----------- */}
                                    <View style={{ flexDirection: "row", marginTop: scaleSzie(6) }} >
                                        <View style={{ flex: 1, justifyContent: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 13 }]} >
                                                {`DESCRIPTION`}
                                            </Text>
                                        </View>
                                        <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 13 }]} >
                                                {`QTY`}
                                            </Text>
                                        </View>
                                        <View style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }} >
                                            <Text style={[styleInvoice.txt_info, { fontSize: 13 }]} >
                                                {`PRICE`}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* ------------- Dot Border  ----------- */}
                                    <View style={{ height: scaleSzie(8), marginBottom: scaleSzie(4) }} >
                                        <Text style={{}} >
                                            {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
                                        </Text>
                                    </View>

                                    {/* ------------- Item Invoice   ----------- */}
                                    {
                                        basket.map((item, index) => <ItemInvoice
                                            key={index}
                                            item={item}
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
                                        title={"TAX"}
                                        value={temptTax}
                                    />
                                    <ItemTotal
                                        title={"Discount"}
                                        value={temptDiscount}
                                    />
                                    <ItemTotal
                                        title={"TIP"}
                                        value={temptTip}
                                    />
                                    <ItemTotal
                                        title={"TOTAL"}
                                        value={temptTotal}
                                        style={{ fontSize: 15, fontWeight: "bold" }}
                                    />
                                    {/* ------------- Entry Method   ----------- */}
                                    <View style={{ flexDirection: "row", marginBottom: scaleSzie(4) }} >
                                        <Text style={[styleInvoice.txt_total,]} >
                                            {`- Entry method : ${paymentSelected}`}
                                        </Text>
                                    </View>

                                    {/* ------------- Credit   ----------- */}
                                    <View style={{ flexDirection: "row", marginBottom: scaleSzie(4) }} >
                                        <Text style={[styleInvoice.txt_total,]} >
                                            {`- Visa : ***********3022`}
                                        </Text>
                                    </View>
                                    {/* ----------- Thanks , see you again -------- */}
                                    <View style={{ height: scaleSzie(50) }} />
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", fontWeight: "bold" }]} >
                                        Thank you !
                                </Text>
                                    <Text style={[styleInvoice.txt_total, { alignSelf: "center", fontWeight: "bold" }]} >
                                        Please come again
                                </Text>
                                    <View style={{ height: scaleSzie(8) }} />
                                </View>


                                <View style={{ height: scaleSzie(30) }} />
                            </ScrollView>
                        </View>


                        {/* ------ Button ----- */}
                        < View style={{
                            height: scaleSzie(35), justifyContent: 'center',
                            flexDirection: "row"
                        }} >
                            <ButtonCustom
                                width={'30%'}
                                height={25}
                                backgroundColor="#0764B0"
                                title={localize('CANCEL', language)}
                                textColor="#fff"
                                onPress={() => onRequestClose()}
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
                            <View style={{ width: scaleSzie(20) }} />
                            <ButtonCustom
                                width={'30%'}
                                height={25}
                                backgroundColor="#0764B0"
                                title={localize('PRINT', language)}
                                textColor="#fff"
                                onPress={this.doPrint}
                                styleText={{
                                    fontSize: scaleSzie(10),
                                    fontWeight: "600"
                                }}
                                style={{
                                    borderRadius: 4
                                }}
                            />
                        </ View>
                    </View>
                </View>


            </Modal>
        );
    }


}

const ItemInvoice = ({ item }) => {
    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {item.data && item.data.name ? item.data.name : ""}
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
            <Text style={[styleInvoice.txt_total, { alignSelf: "flex-start" }, style]} >
                {title}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[styleInvoice.txt_total, { alignSelf: "flex-end" }, style]} >
                {`$ ${value}`}
            </Text>
        </View>
    );
}

const styleInvoice = StyleSheet.create({
    txt_normal: {
        color: "#000",
        fontSize: 11,
        alignSelf: "center"
    },
    txt_info: {
        color: "#000",
        fontSize: 12,
    },
    txt_total: {
        color: "#000",
        fontSize: 14,
    }
})


const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, PopupInvoicePrint);
