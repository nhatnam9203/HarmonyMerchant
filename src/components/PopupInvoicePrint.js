import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";
import Dash from "react-native-dash";
import { getFullName } from "@shared/utils";

import ButtonCustom from "./ButtonCustom";
import {
  scaleSize,
  localize,
  getPaymentString,
  formatMoney,
  formatWithMoment,
  getStaffNameForInvoice,
  getInfoFromModelNameOfPrinter,
  checkIsTablet,
} from "../utils";
import connectRedux from "@redux/ConnectRedux";
import PrintManager from "@lib/PrintManager";

const initalState = {
  basket: [],
  temptSubTotal: 0.0,
  temptTax: 0.0,
  temptDiscount: 0.0,
  temptTip: 0.0,
  temptTotal: 0.0,
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

  promotionNotes: "",
};

class PopupInvoicePrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = initalState;
    this.viewShotRef = React.createRef(null);
  }

  setStateFromParent = async (
    basket,
    temptSubTotal,
    temptTax,
    temptDiscount,
    temptTip,
    temptTotal,
    paymentSelected,
    isPrintTempt,
    printMachine,
    promotionNotes,
    titleInvoice = "SALE",
    invoiceNo = "",
    checkoutPayments = [],
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
      promotionNotes,
    });
    const {paymentMachineType, printerSelect} = this.props
    setTimeout(() => {
      if(paymentMachineType == "Clover"){
        if (printerSelect){
            this.doPrint();
        }else{
            this.doPrintClover();
        }
      }else{
          this.doPrint();
      }
    }, 1000);
  };

  doPrint = async () => {
    const { printerSelect, printerList } = this.props;
    const { isSignature } = this.state;
    const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    try {
      await this.setState({
        isProcessingPrint: true,
      });
      const imageUri = await captureRef(this.viewShotRef, {});
      if (imageUri) {
        let commands = [];
        commands.push({ appendLineFeed: 0 });
        commands.push({
          appendBitmap: imageUri,
          width: parseFloat(widthPaper),
          bothScale: true,
          diffusion: true,
          alignment: "Center",
        });
        commands.push({
          appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
        });

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
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => this.doPrintAgain(),
              },
            ],
            { cancelable: false }
          );
        } else {
          await this.setState(initalState);
          this.props.onRequestClose(isPrintTempt);
        }
      }
    } catch (error) {
      alert(error);
      await this.setState({
        isProcessingPrint: false,
      });
    }
  };

  doPrintClover = async () => {
    const { isSignature } = this.state;

    try {
      await this.setState({
        isProcessingPrint: true,
      });
      const imageUri = await captureRef(this.viewShotRef, {result: "base64"});
      console.log(imageUri,'imageUri')
      if (imageUri) {
        if(this.props.doPrintClover){
          this.props.doPrintClover(imageUri)
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
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => this.doPrintAgain(),
                },
              ],
              { cancelable: false }
            );
          } else {
                await this.setState(initalState);
                this.props.onRequestClose(isPrintTempt);
              }
            }
          }
        
    } catch (error) {
      alert(error);
      await this.setState({
        isProcessingPrint: false,
      });
    }
  };

  processPrintInvoice = async () => {
    const { paymentMachineType, printerSelect } = this.props;
    if (paymentMachineType == "Clover") {
      if (printerSelect){
        await this.doPrint();
      }else{
        await this.doPrintClover();
      }
    } else {
      await this.doPrint();
    }
  };

  doPrintAgain = async () => {
    await this.setState({
      isSignature: false,
    });
    const { paymentMachineType, printerSelect } = this.props;
    setTimeout(() => {
      if (paymentMachineType == "Clover") {
        if (printerSelect){
          this.doPrint();
        }else{
          this.doPrintClover();
        }
      } else {
        this.doPrint();
      }
    }, 500);
  };

  getDate() {
    return formatWithMoment(new Date(), "MM/DD/YYYY");
  }

  cancelInvoicePrint = async () => {
    const { isPrintTempt } = this.state;

    let tempt = isPrintTempt;
    await this.setState(initalState);
    this.props.onRequestClose(tempt);
  };

  switchCheckbox = () => {
    this.setState((prevState) => ({
      isCheck: !prevState.isCheck,
    }));
  };

  getPaymentMethods = () => {
    const { paymentDetailInfo } = this.props;
    return paymentDetailInfo.paidAmounts &&
      paymentDetailInfo.paidAmounts.length > 0
      ? paymentDetailInfo.paidAmounts.slice(0).reverse()
      : [];
  };

  // -------------- Render --------------
  renderLoadingProcessingPrint() {
    if (this.state.isProcessingPrint) {
      return (
        <View
          style={{
            height: scaleSize(490),
            width: scaleSize(290),
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            rightL: 0,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0764B0" />
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      language,
      visiblePrintInvoice,
      profile,
      paymentDetailInfo,
      profileStaffLogin,
      invoiceDetail,
      paymentMachineType,
      printerSelect,
    } = this.props;
    const {
      basket,
      temptSubTotal,
      temptTax,
      temptDiscount,
      temptTip,
      temptTotal,
      isPrintTempt,
      isSignature,
      paymentMethods,
      titleInvoice,
      invoiceNo,
      checkoutPayments,
      promotionNotes,
    } = this.state;
    const temtCheckoutPayment =
      paymentMethods.length > 0 ? paymentMethods : checkoutPayments;
    const tempHeight = checkIsTablet() ? scaleSize(400) : scaleSize(450);

    const tempStyle =
      Platform.OS === "android"
        ? { paddingHorizontal: scaleSize(10), backgroundColor: "#FFFFFF" }
        : { paddingHorizontal: scaleSize(10) };

    let invoiceName = getStaffNameForInvoice(profileStaffLogin, basket);
    if (!invoiceName && invoiceDetail?.user?.userId) {
      invoiceName = getFullName(invoiceDetail?.user);
    }
    if (!invoiceName) {
      invoiceName = profileStaffLogin?.displayName;
    }
    let fontWeightClover = paymentMachineType == "Clover" && !printerSelect && {fontWeight: "600"}
    
    return (
      <Modal
        visible={visiblePrintInvoice}
        onRequestClose={() => {}}
        transparent={true}
      >
        <View
          style={[
            {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "#fff",
              width: scaleSize(290),
            }}
          >
            <View style={{ height: tempHeight }}>
              <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                keyboardShouldPersistTaps="always"
              >
               
                <View ref={this.viewShotRef} style={[tempStyle, {backgroundColor: "#fff"}]}>
                {/* ------------- Store Name ----------- */}
                <Text
                  style={[
                    styleInvoice.txt_normal,
                    {
                      fontSize: 24,
                      fontWeight: "600",
                      marginTop: scaleSize(8),
                    },
                  ]}
                >
                  {profile?.businessName || ""}
                </Text>
                {/* ------------- Store Address ----------- */}
                <Text
                  numberOfLines={1}
                  style={[
                    styleInvoice.txt_normal,
                    {
                      paddingHorizontal: scaleSize(10),
                      marginTop: scaleSize(4),
                    },
                    fontWeightClover
                  ]}
                >
                  {profile?.addressFull || ""}
                </Text>
                {/* ------------- Phone Address ----------- */}
                <Text
                  style={[
                    styleInvoice.txt_normal,
                    { paddingHorizontal: scaleSize(10) },
                    fontWeightClover
                  ]}
                >
                  {`Tel : ${profile?.phone || ""}`}
                </Text>
                {/* ------------- Company Website ----------- */}
                {profile.webLink ? (
                  <Text
                    style={[
                      styleInvoice.txt_normal,
                      { paddingHorizontal: scaleSize(10) },
                      fontWeightClover
                    ]}
                  >
                    {profile?.webLink || ""}
                  </Text>
                ) : (
                  <View />
                )}

                {/* ------------- SALE/VOID/REFUND  ----------- */}
                <Text
                  style={[
                    styleInvoice.txt_normal,
                    {
                      fontSize: 20,
                      fontWeight: "600",
                      marginTop: scaleSize(6),
                      marginBottom: scaleSize(6),
                    },
                  ]}
                >
                  {titleInvoice}
                </Text>
                {/* ------------- Dot Border  ----------- */}
                <Dash
                  style={{ width: "100%", height: 1 }}
                  dashGap={5}
                  dashLength={8}
                  dashThickness={1}
                  style={{ marginBottom: scaleSize(10) }}
                />

                {/* ------------- Invoice Date ----------- */}
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>
                      {`Invoice Date`}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>
                      {`: ${formatWithMoment(
                        new Date(),
                        "MM/DD/YYYY hh:mm A"
                      )}`}
                    </Text>
                  </View>
                </View>
                {/* ------------- Staff ----------- */}
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>{`Staff Name`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>
                      {`: ${invoiceName}`}
                    </Text>
                  </View>
                </View>
                {/* ------------- Invoice No ----------- */}
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: scaleSize(90) }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>{`Invoice No`}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styleInvoice.txt_info, fontWeightClover]}>
                      {`: ${
                        invoiceNo
                          ? invoiceNo
                          : paymentDetailInfo?.invoiceNo || ""
                      }`}
                    </Text>
                  </View>
                </View>

                {/* ------------- Dot Border  ----------- */}
                <Dash
                  style={{ width: "100%", height: 1 }}
                  dashGap={5}
                  dashLength={8}
                  dashThickness={1}
                  style={{
                    marginBottom: scaleSize(4),
                    marginTop: scaleSize(10),
                  }}
                />

                {/* ------------- Header  ----------- */}
                <View
                  style={{ flexDirection: "row", marginTop: scaleSize(6) }}
                >
                  <View style={{ flex: 0.8, justifyContent: "center" }}>
                    <Text
                      style={[
                        styleInvoice.txt_info,
                        { fontSize: 18, fontWeight: "400" },
                        fontWeightClover
                      ]}
                    >
                      {`DESCRIPTION`}
                    </Text>
                  </View>
                  <View
                    style={{ justifyContent: "center", width: scaleSize(70) }}
                  >
                    <Text
                      style={[
                        styleInvoice.txt_info,
                        { fontSize: 18, fontWeight: "400" },
                        fontWeightClover
                      ]}
                    >
                      {`PRICE`}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: scaleSize(30),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        styleInvoice.txt_info,
                       { fontSize: 18, fontWeight: "400" },
                       fontWeightClover
                      ]}
                    >
                      {`QTY`}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      style={[
                        styleInvoice.txt_info,
                        { fontSize: 18, fontWeight: "400" },
                        fontWeightClover
                      ]}
                    >
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
                  style={{
                    marginBottom: scaleSize(4),
                    marginTop: scaleSize(10),
                  }}
                />

                {/* ------------- Item Invoice   ----------- */}
                {basket?.map((item, index) => (
                  <ItemInvoice 
                  key={index} 
                  item={item} 
                  index={index} 
                  paymentMachineType={paymentMachineType}
                  printerSelect={printerSelect}/>
                ))}

                {/* ------------- Line end item invoice   ----------- */}
                <View
                  style={{
                    height: 2,
                    backgroundColor: "#000",
                    marginVertical: scaleSize(10),
                  }}
                />
                {/* ------------- SubTotal   ----------- */}
                <ItemTotal title={"Subtotal"} value={temptSubTotal}
                paymentMachineType={paymentMachineType}
                printerSelect={printerSelect}/>
                <ItemTotal title={"Discount"} value={temptDiscount}
                paymentMachineType={paymentMachineType}
                printerSelect={printerSelect}/>
                <ItemTotal title={"Tip"} value={temptTip}
                paymentMachineType={paymentMachineType}
                printerSelect={printerSelect}/>
                <ItemTotal title={"Tax"} value={temptTax}
                paymentMachineType={paymentMachineType}
                printerSelect={printerSelect}/>
                {isPrintTempt ? (
                  <View />
                ) : (
                  <ItemTotal title={"Total"} value={temptTotal}
                  paymentMachineType={paymentMachineType}
                  printerSelect={printerSelect}/>
                )}

                {/* ------------- Enter Tip   ----------- */}
                {isPrintTempt ? (
                  <View
                    style={{
                      height: scaleSize(25),
                      flexDirection: "row",
                      marginBottom: scaleSize(12),
                    }}
                  >
                    <View
                      style={{
                        width: scaleSize(70),
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styleInvoice.txt_total,
                          { fontSize: 20, fontWeight: "600" },
                        ]}
                      >
                        {"Tip :"}
                      </Text>
                    </View>
                    <View style={{ width: scaleSize(50) }} />
                    <View
                      style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: 1,
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}

                {/* ------------- Enter Total   ----------- */}
                {isPrintTempt ? (
                  <View
                    style={{
                      height: scaleSize(25),
                      flexDirection: "row",
                      marginBottom: scaleSize(12),
                    }}
                  >
                    <View
                      style={{
                        width: scaleSize(70),
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styleInvoice.txt_total,
                          { fontSize: 20, fontWeight: "600" },
                        ]}
                      >
                        {"Total :"}
                      </Text>
                    </View>
                    <View style={{ width: scaleSize(50) }} />
                    <View
                      style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: 1,
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}

                {/* ------------- Entry Method   ----------- */}
                {!isPrintTempt ? (
                  <View>
                    {temtCheckoutPayment.map((data, index) => (
                      <View
                        key={index}
                        style={{ marginBottom: scaleSize(4) }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={[styleInvoice.txt_total]}>
                            {`- Entry method: ${getPaymentString(
                              data?.paymentMethod || ""
                            )}`}
                          </Text>
                          <View
                            style={{
                              flex: 1,
                              alignItems: "flex-end",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              style={[
                                styleInvoice.txt_total,
                                paymentMachineType == "Clover" && !printerSelect ?
                                { fontSize: scaleSize(15) }
                                : { fontSize: scaleSize(10) },
                              ]}
                            >
                              {`$${data?.amount || ""}`}
                            </Text>
                          </View>
                        </View>
                        {(data.paymentMethod &&
                          data.paymentMethod === "credit_card") ||
                        data.paymentMethod === "debit_card" ? (
                          <View style={{ marginTop: scaleSize(5) }}>
                            <Text
                              style={[
                                styleInvoice.txt_total,
                                paymentMachineType == "Clover" && !printerSelect ?
                                { fontSize: scaleSize(15) } 
                                : { fontSize: scaleSize(10) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.type || ""
                              }: ***********${
                                data?.paymentInformation?.number || ""
                              }`}
                            </Text>
                            <Text
                              style={[
                                styleInvoice.txt_total,
                                paymentMachineType == "Clover" && !printerSelect ?
                                { fontSize: scaleSize(15) } :
                                { fontSize: scaleSize(10) },
                              ]}
                            >
                              {`    ${data?.paymentInformation?.name || ""}`}
                            </Text>
                            <Text
                              style={[
                                styleInvoice.txt_total,
                                paymentMachineType == "Clover" && !printerSelect ?
                                { fontSize: scaleSize(15) } :
                                { fontSize: scaleSize(10) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.sn
                                  ? `Terminal ID: ${data?.paymentInformation?.sn}`
                                  : ""
                              }`}
                            </Text>
                            <Text
                              style={[
                                styleInvoice.txt_total,
                                paymentMachineType == "Clover" && !printerSelect ?
                                { fontSize: scaleSize(15) } :
                                { fontSize: scaleSize(10) },
                              ]}
                            >
                              {`    ${
                                data?.paymentInformation?.refNum
                                  ? `Transaction #: ${data?.paymentInformation?.refNum}`
                                  : ""
                              }`}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : (
                  <View />
                )}

                {isSignature && !isPrintTempt ? (
                  <View
                    style={{
                      height: scaleSize(15),
                      flexDirection: "row",
                      marginTop: scaleSize(15),
                    }}
                  >
                    <View
                      style={{
                        width: scaleSize(70),
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styleInvoice.txt_total,
                          { fontSize: 18, fontWeight: "600" },
                        ]}
                      >
                        {"Signature:"}
                      </Text>
                    </View>
                    <View style={{ width: scaleSize(50) }} />
                    <View
                      style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: 1,
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}

                {isPrintTempt ? (
                  <View
                    style={{
                      height: scaleSize(15),
                      flexDirection: "row",
                      marginTop: scaleSize(15),
                    }}
                  >
                    <View
                      style={{
                        width: scaleSize(70),
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text
                        style={[
                          styleInvoice.txt_total,
                          { fontSize: 18, fontWeight: "600" },
                        ]}
                      >
                        {"Signature:"}
                      </Text>
                    </View>
                    <View style={{ width: scaleSize(50) }} />
                    <View
                      style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: 1,
                      }}
                    />
                  </View>
                ) : (
                  <View />
                )}

                {promotionNotes ? (
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginTop: scaleSize(10),
                    }}
                  >
                    {`Discount note: `}
                    <Text style={{ fontWeight: "500" }}>
                      {`${promotionNotes}`}
                    </Text>
                  </Text>
                ) : null}

                {/* ----------- Thanks , see you again -------- */}
                <View style={{ height: scaleSize(20) }} />
                <Text
                  style={[styleInvoice.txt_total, { alignSelf: "center" },
                  fontWeightClover]}
                >
                  {`Thank you!`}
                </Text>
                <Text
                  style={[styleInvoice.txt_total, { alignSelf: "center" }, fontWeightClover]}
                >
                  {`Please come again`}
                </Text>
                <View style={{ height: scaleSize(8) }} />
                {/* ------------- This is not a bill   ----------- */}
                <Text
                  style={[
                    styleInvoice.txt_total,
                    {fontWeight: "600"}
                  ]}
                >
                  {`*********** ${
                    isPrintTempt
                      ? "Customer's Receipt"
                      : isSignature
                      ? "Merchant's Receipt"
                      : "Customer's Receipt"
                  } ***********`}
                </Text>
              </View>
                
                <View style={{ height: scaleSize(30) }} />
              </ScrollView>
            </View>

            {/* ------ Button ----- */}
            <View
              style={{
                height: scaleSize(40),
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <ButtonCustom
                width={"30%"}
                height={30}
                backgroundColor="#0764B0"
                title={localize("CANCEL", language)}
                textColor="#fff"
                onPress={this.cancelInvoicePrint}
                styleText={{
                  fontSize: scaleSize(10),
                  fontWeight: "600",
                  color: "#404040",
                }}
                style={{
                  borderRadius: 4,
                  borderColor: "#CCCCCC",
                  borderWidth: 1,
                  backgroundColor: "#F1F1F1",
                }}
              />
              <View style={{ width: scaleSize(35) }} />
              <ButtonCustom
                width={"30%"}
                height={30}
                backgroundColor="#0764B0"
                title={localize("PRINT", language)}
                textColor="#fff"
                onPress={this.processPrintInvoice}
                styleText={{
                  fontSize: scaleSize(10),
                  fontWeight: "600",
                }}
                style={{
                  borderRadius: 4,
                }}
              />
            </View>

            {this.renderLoadingProcessingPrint()}
          </View>
        </View>
      </Modal>
    );
  }
}

const ItemInvoice = ({ item, index, paymentMachineType, printerSelect }) => {
  const price = item.data && item.data.price ? item.data.price : 0;
  const quanlitySet = item.quanlitySet ? item.quanlitySet : 1;
  const total = formatMoney(price * quanlitySet);
  const note = item.note ? item.note : "";
  let txt_info = paymentMachineType == "Clover" && !printerSelect
                   ? [styleInvoice.txt_info, { fontSize: 18, marginLeft: 8, fontWeight: "700" }]
                   : [styleInvoice.txt_info, { fontSize: 18, marginLeft: 8, fontWeight: "600" }]

  return (
    <View style={{ flexDirection: "row", marginTop: scaleSize(3) }}>
      <View style={{ flex: 0.8, justifyContent: "center" }}>
        <Text style={[txt_info]}>
          {`${index + 1}. ${item.data && item.data.name ? item.data.name : ""}`}
        </Text>
        {/* ------------ Note -------- */}
        {note ? (
          <Text
            style={txt_info}
          >
            {`(Note: ${note})`}
          </Text>
        ) : null}
      </View>
      <View style={{ justifyContent: "center", width: scaleSize(70) }}>
        <Text style={txt_info}>{`$ ${price}`}</Text>
      </View>
      <View
        style={{
          // width: scaleSize(50), justifyContent: "center", alignItems: "center",
          width: scaleSize(30),
          justifyContent: "center",
          alignItems: "center",
          // paddingLeft: scaleSize(6)
        }}
      >
        <Text style={txt_info}>{quanlitySet}</Text>
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text style={txt_info}>{`$ ${total ? total : ""}`}</Text>
      </View>
    </View>
  );
};

const ItemTotal = ({ title, value, style, paymentMachineType, printerSelect }) => {

  return (
    <View style={{ flexDirection: "row", marginBottom: scaleSize(4) }}>
      <Text
        style={[
          styleInvoice.txt_total,
          { alignSelf: "flex-start", fontWeight: "600" },
          style,
        ]}
      >
        {title}
      </Text>
      <View style={{ flex: 1 }} />
      <Text
        style={[
          styleInvoice.txt_total,
          paymentMachineType == "Clover" && !printerSelect ?
          { alignSelf: "flex-end", fontWeight: "600" }
          : { alignSelf: "flex-end", fontWeight: "400" },
          style,
        ]}
      >
        {`$ ${value}`}
      </Text>
    </View>
  );
};

const styleInvoice = StyleSheet.create({
  txt_normal: {
    color: "#000",
    fontSize: 18,
    alignSelf: "center",
    fontWeight: "500",
  },
  txt_info: {
    color: "#000",
    fontSize: 18,
    fontWeight: "500",
  },
  txt_total: {
    color: "#000",
    fontSize: 20,
    fontWeight: "500",
  },
});

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  profile: state.dataLocal.profile,
  paymentDetailInfo: state.appointment.paymentDetailInfo,

  printerSelect: state.dataLocal.printerSelect,
  printerList: state.dataLocal.printerList,

  invoiceDetail: state.invoice.invoiceDetail,
  paymentMachineType: state.hardware.paymentMachineType,
});

export default connectRedux(mapStateToProps, PopupInvoicePrint);
