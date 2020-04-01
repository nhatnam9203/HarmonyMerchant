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
        this.viewShotRef = React.createRef();
    }

    testPrint = async () => {
        try {
            captureRef(this.viewShotRef, {
                // snapshotContentContainer: true,
                // snapshotContentContainer: true
            }).then(
                imageUri => {
                    let commands = [];
                    commands.push({ appendLineFeed: 0 });
                    commands.push({ appendBitmap: imageUri });
                    commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });
                    PrintManager.getInstance().print("BT:TSP100", commands);
                },
                error => console.error('Oops, snapshot failed', error)
            );

            // let imageUri = await this.viewShotRef.current.capture();
            // console.log("imageUri : ", imageUri);
            // let commands = [];
            // commands.push({ appendLineFeed: 0 });
            // commands.push({ appendBitmap: imageUri });
            // commands.push({ appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed });
            // PrintManager.getInstance().print("BT:TSP100", commands);

        } catch (error) {
            console.log("error : ", error);
        }

    }

    onCapture = uri => {
        console.log("----do something with ", uri);
    }

    // -------------- Render --------------

    render() {
        const { title, visibleEnterPin, isOfflineMode, onRequestClose, confimYes, hideCloseButton, isShowButtonEnterPinCode,
            language
        } = this.props;
        const { value, customStyle, loading } = this.state;

        return (
            <Modal
                visible={false}
                onRequestClose={() => onRequestClose()}
                transparent={true}
            // presentationStyle="fullScreen"
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
                            style={{ height: scaleSzie(350) }}
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
                                        AAA Store
                                </Text>
                                    {/* ------------- Store Address ----------- */}
                                    <Text numberOfLines={1} style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10), marginTop: scaleSzie(4) }]} >
                                        30 Cộng Hoà , phường 4 , Q. Tân Bình - HCM
                            </Text>
                                    {/* ------------- Phone Address ----------- */}
                                    <Text style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                        Tel : 0123-456-789
                            </Text>
                                    {/* ------------- Company Website ----------- */}
                                    <Text style={[styleInvoice.txt_normal, { paddingHorizontal: scaleSzie(10) }]} >
                                        https://www.harmonypayment.com
                            </Text>
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
                                                {`: 20/03/2020 12:11 AM`}
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
                                                {`: Luis Nani`}
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
                                    <ItemInvoice />
                                    <ItemInvoice />
                                    <ItemInvoice />

                                    {/* ------------- Line end item invoice   ----------- */}

                                    <View
                                        style={{ height: 2, backgroundColor: "#000", marginVertical: scaleSzie(10) }}
                                    />
                                    {/* ------------- SubTotal   ----------- */}
                                    <ItemTotal
                                        title={"Subtotal"}
                                        value={"20.00"}
                                    />
                                    <ItemTotal
                                        title={"TAX"}
                                        value={"20.00"}
                                    />
                                    <ItemTotal
                                        title={"Discount"}
                                        value={"20.00"}
                                    />
                                    <ItemTotal
                                        title={"TIP"}
                                        value={"20.00"}
                                    />
                                    <ItemTotal
                                        title={"TOTAL"}
                                        value={"20.00"}
                                        style={{ fontSize: 15, fontWeight: "bold" }}
                                    />
                                    {/* ------------- Entry Method   ----------- */}
                                    <View style={{ flexDirection: "row", marginBottom: scaleSzie(4) }} >
                                        <Text style={[styleInvoice.txt_total,]} >
                                            {`- Entry method : Cash`}
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
                            height: scaleSzie(30), justifyContent: 'center',
                            flexDirection: "row"
                        }} >
                            <ButtonCustom
                                width={'30%'}
                                height={25}
                                backgroundColor="#0764B0"
                                title={localize('CANCEL', language)}
                                textColor="#fff"
                                onPress={this.testPrint}
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
                                onPress={this.testPrint}
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

const ItemInvoice = () => {
    return (
        <View style={{ flexDirection: "row", marginTop: scaleSzie(3) }} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`Medicure 12`}
                </Text>
            </View>
            <View style={{ width: scaleSzie(35), justifyContent: "center", alignItems: "center" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`2`}
                </Text>
            </View>
            <View style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }} >
                <Text style={[styleInvoice.txt_info,]} >
                    {`$ 100.00`}
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
    isShowButtonEnterPinCode: state.staff.isShowButtonEnterPinCode,
    visibleEnterPin: state.app.visibleEnterPin,
    isOfflineMode: state.network.isOfflineMode
});

export default connectRedux(mapStateToProps, PopupInvoicePrint);
