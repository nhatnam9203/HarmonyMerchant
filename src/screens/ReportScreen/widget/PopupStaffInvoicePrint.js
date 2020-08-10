import React from "react";
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
  Image,
} from "react-native";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";
import _ from "ramda";

import { Button, ButtonCustom } from "@components";
import {
  scaleSzie,
  localize,
  PRINTER_MACHINE,
  formatWithMoment,
  checkStatusPrint,
} from "@utils";
import connectRedux from "@redux/ConnectRedux";
import PrintManager from "@lib/PrintManager";
import ICON from "@resources";

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
  isProcessingPrint: false,
  isCheck: false,
  isSignature: false,
};

class PopupStaffInvoicePrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = initalState;
    this.viewShotRef = React.createRef();
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
    printMachine
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
    });
  };

  doPrint = async (printMachine) => {
    // const { printMachine,} = this.state;
    // const printMachine = "BT:TSP100"
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
          width: PRINTER_MACHINE[printMachine].widthPaper,
          bothScale: true,
          diffusion: true,
          alignment: "Center",
        });
        commands.push({
          appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
        });

        await PrintManager.getInstance().print(printMachine, commands);
        releaseCapture(imageUri);

        await this.setState({
          isProcessingPrint: false,
        });
      }
    } catch (error) {
      // console.log(error);
      await this.setState({
        isProcessingPrint: false,
      });
    }
  };

  processPrintInvoice = async () => {
    const printMachine = await checkStatusPrint();
    if (printMachine) {
      await this.setState({
        isSignature: true,
      });
      this.doPrint(printMachine);
    } else {
      alert("Please connect to your cash drawer.");
    }
  };

  getHour() {
    const hours =
      parseInt(new Date().getHours()) - 12 > 0
        ? `0${parseInt(new Date().getHours()) - 12}`
        : parseInt(new Date().getHours());
    const surfix = parseInt(new Date().getHours()) - 12 > 0 ? "PM" : "AM";
    const temptDate = `${hours}:${
      new Date().getMinutes() > 10
        ? new Date().getMinutes()
        : `0${new Date().getMinutes()}`
    } ${surfix}`;

    return temptDate;
  }

  getDate() {
    return `${
      new Date().getMonth() + 1
    }/${new Date().getDate()}/${new Date().getFullYear()}`;
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
    const paidAmounts = paymentDetailInfo.paidAmounts
      ? paymentDetailInfo.paidAmounts
      : [{ paymentMethod: "" }];

    return paidAmounts;
  };

  findReceiptType = (type) => {
    const { staff } = this.props;
    if (_.isEmpty(staff)) {
      return false;
    }

    const { receipts = {} } = staff;
    const { receiptType, detail = [] } = receipts;

    if (receiptType === type) {
      return staff.receipts;
    }

    const receipt = detail.find((item) => item.receiptType === type);
    return receipt;
  };

  // -------------- Render --------------

  renderLoadingProcessingPrint() {
    if (this.state.isProcessingPrint) {
      return (
        <View
          style={{
            height: scaleSzie(530),
            width: scaleSzie(290),
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
    const { language, visiblePrintInvoice, staff } = this.props;
    const { receipts = {} } = staff;

    const receiptType = receipts.receiptType ? receipts.receiptType : "";
    const staffName = staff.name ? staff.name : "";
    const fromTime = receipts.from
      ? formatWithMoment(receipts.from, "MM/DD/YYYY")
      : "";
    const toTime = receipts.to
      ? formatWithMoment(receipts.to, "MM/DD/YYYY")
      : "";
    const sales = receipts.serviceSales ? receipts.serviceSales : "0.00";
    const workingHour = receipts.workingHour ? receipts.workingHour : "0";
    const product = receipts.productSales ? receipts.productSales : "0.00";
    const cash = receipts.cash ? receipts.cash : "0.00";
    const nonCash = receipts.nonCash ? receipts.nonCash : "0.00";
    const detail = receipts.detail ?? [];

    // const servicePayout = this.findReceiptType("ServicePayout");
    // const workingHourReceipt = this.findReceiptType("WorkingHour");
    // const productPayout = this.findReceiptType("ProductPayout");
    // const tippayout = this.findReceiptType("Tippayout");
    // const totalReceipt = this.findReceiptType("Total");
    let totalDesc = "";
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
              width: scaleSzie(290),
              // height: scaleSzie(450)
            }}
          >
            <View style={{ height: scaleSzie(480) }}>
              <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                keyboardShouldPersistTaps="always"
              >
                <View style={{ height: scaleSzie(10) }} />
                <View ref={this.viewShotRef} style={{ paddingHorizontal: 20 }}>
                  {/* -------------- Type Invoice + Staff Name -------------- */}
                  <Text
                    style={[
                      styleInvoice.txt_normal,
                      { fontSize: scaleSzie(14), fontWeight: "600" },
                    ]}
                  >
                    {`${receiptType} receipts - ${staffName}`}
                  </Text>
                  {/* -------------- Date -------------- */}
                  <Text
                    style={[
                      styleInvoice.txt_normal,
                      { fontWeight: "600", marginTop: 5 },
                    ]}
                  >
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
                  <ItemStaffInvoice title="Cash" value={`$ ${cash}`} />
                  <ItemStaffInvoice title="Non-Cash" value={`$ ${nonCash}`} />
                  {/* ------------- Dot Border  ----------- */}
                  <ItemBorderBottom />

                  {detail
                    .filter((x) => x.isUsed || x.receiptType === "Total")
                    .map((x, index) => {
                      switch (x.receiptType) {
                        case "Tippayout":
                          totalDesc =
                            totalDesc +
                            (totalDesc.length > 0
                              ? "+" + (index + 1)
                              : index + 1);
                          return (
                            <React.Fragment key={x.receiptType}>
                              <ItemStaffInvoice
                                title={`${index + 1}. ${localize(
                                  x.receiptType,
                                  language
                                )}`}
                                value={`$ ${x.total}`}
                                style={{ marginTop: scaleSzie(15) }}
                              />

                              <ItemStaffInvoice
                                title="Tip Total"
                                value={`$ ${x.subTotal}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title={`Tip Fee (${
                                  x.fee && x.fee.value ? x.fee.value : "0.00%"
                                })`}
                                value={`$ ${
                                  x.fee && x.fee.amount ? x.fee.amount : "0.00"
                                }`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                        case "Total":
                          return (
                            <React.Fragment key={x.receiptType}>
                              {/* ------------- Line   ----------- */}
                              <View
                                style={{
                                  height: 2,
                                  backgroundColor: "#000",
                                  marginVertical: scaleSzie(10),
                                }}
                              />

                              {/* ------------- Total payout  ----------- */}
                              <ItemStaffInvoice
                                title="Total Payout"
                                value={`$ ${x.total}`}
                                subTitle={" (" + totalDesc + ")"}
                                styleTilte={{
                                  fontSize: scaleSzie(14),
                                  fontWeight: "600",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(14),
                                  fontWeight: "600",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                        case "WorkingHour":
                          totalDesc =
                            totalDesc +
                            (totalDesc.length > 0
                              ? "+" + (index + 1)
                              : index + 1);
                          return (
                            <React.Fragment key={x.receiptType}>
                              <ItemStaffInvoice
                                title={`${index + 1}. ${localize(
                                  x.receiptType,
                                  language
                                )} (${x.commission}$)`}
                                value={`$ ${x.total}`}
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                          break;
                        default:
                          totalDesc =
                            totalDesc +
                            (totalDesc.length > 0
                              ? "+" + (index + 1)
                              : index + 1);
                          return (
                            <React.Fragment key={x.receiptType}>
                              <ItemStaffInvoice
                                title={`${index + 1}. ${localize(
                                  x.receiptType,
                                  language
                                )} (${x.commission}%)`}
                                value={`$ ${x.total}`}
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSzie(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                          break;
                      }
                    })}
                </View>
                <View style={{ height: scaleSzie(100) }} />
              </ScrollView>
            </View>

            {/* ------ Button ----- */}
            <View
              style={{
                height: scaleSzie(40),
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
                  fontSize: scaleSzie(10),
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
              <View style={{ width: scaleSzie(35) }} />
              <ButtonCustom
                width={"30%"}
                height={30}
                backgroundColor="#0764B0"
                title={localize("PRINT", language)}
                textColor="#fff"
                onPress={this.processPrintInvoice}
                styleText={{
                  fontSize: scaleSzie(10),
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

const ItemStaffInvoice = ({
  title,
  value,
  style,
  styleTilte,
  styleValue,
  subTitle,
}) => {
  return (
    <View style={[{ flexDirection: "row", marginTop: 7 }, style]}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={[styleInvoice.txt_info, styleTilte]}>
          {title}
          <Text style={{ fontWeight: "200" }}>{subTitle}</Text>
        </Text>
      </View>

      <View
        style={{ flex: 0.6, justifyContent: "center", alignItems: "flex-end" }}
      >
        <Text style={[styleInvoice.txt_info, styleValue]}>{value}</Text>
      </View>
    </View>
  );
};

const ItemBorderBottom = () => {
  return (
    <View style={{ height: 30 }}>
      <Text style={{ fontWeight: "200", fontSize: 22 }}>
        {`- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -`}
      </Text>
    </View>
  );
};

const styleInvoice = StyleSheet.create({
  txt_normal: {
    color: "#000",
    fontSize: scaleSzie(13),
    alignSelf: "center",
    fontWeight: "200",
  },
  txt_info: {
    color: "#000",
    fontSize: scaleSzie(12),
    fontWeight: "400",
  },
  txt_total: {
    color: "#000",
    fontSize: scaleSzie(16),
    fontWeight: "200",
  },
});

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  profile: state.dataLocal.profile,
  groupAppointment: state.appointment.groupAppointment,
  paymentDetailInfo: state.appointment.paymentDetailInfo,
});

export default connectRedux(mapStateToProps, PopupStaffInvoicePrint);
