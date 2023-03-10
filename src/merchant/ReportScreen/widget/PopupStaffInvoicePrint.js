import { ButtonCustom } from "@components";
import PrintManager from "@lib/PrintManager";
import connectRedux from "@redux/ConnectRedux";
import {
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  localize,
  scaleSize,
} from "@utils";
import _ from "ramda";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";

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

    const { printerSelect, printerList } = this.props;
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
          width: widthPaper,
          bothScale: true,
          diffusion: true,
          alignment: "Center",
        });
        commands.push({
          appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
        });

        await PrintManager.getInstance().print(emulation, commands, portName);
        releaseCapture(imageUri);

        await this.setState({
          isProcessingPrint: false,
        });
      }
    } catch (error) {
      await this.setState({
        isProcessingPrint: false,
      });
    }
  };

  processPrintInvoice = async () => {
    // const printMachine = await checkStatusPrint();
    const { printerSelect, printerList } = this.props;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );
    if (portName) {
      await this.setState({
        isSignature: true,
      });
      this.doPrint(portName);
    } else {
      alert("Please connect to your printer.");
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
            height: scaleSize(530),
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
    const sales = receipts?.serviceSales || "0.00";
    const workingHour = receipts?.workingHour || "0";
    const product = receipts?.productSales || "0.00";
    const cash = receipts?.cash || "0.00";
    const nonCash = receipts?.nonCash || "0.00";
    const detail = receipts?.detail || [];
    const netServiceSales = receipts?.netServiceSales || "0.00";

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
              width: scaleSize(290),
              // height: scaleSize(450)
            }}
          >
            <View style={{ height: scaleSize(480) }}>
              <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                keyboardShouldPersistTaps="always"
              >
                <View style={{ height: scaleSize(10) }} />
                <View ref={this.viewShotRef} style={{ paddingHorizontal: 20 }}>
                  {/* -------------- Type Invoice + Staff Name -------------- */}
                  <Text
                    style={[
                      styleInvoice.txt_normal,
                      { fontSize: scaleSize(14), fontWeight: "600" },
                    ]}
                  >
                    {`${receiptType} receipts 111 - ${staffName}`}
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
                    title="Net Service Sale"
                    value={`$ ${netServiceSales}`}
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
                                style={{ marginTop: scaleSize(15) }}
                              />

                              <ItemStaffInvoice
                                title="Tip Total"
                                value={`$ ${x.subTotal}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
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
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
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
                                  marginVertical: scaleSize(10),
                                }}
                              />

                              {/* ------------- Total payout  ----------- */}
                              <ItemStaffInvoice
                                title="Total Payout"
                                value={`$ ${x.total}`}
                                subTitle={" (" + totalDesc + ")"}
                                styleTilte={{
                                  fontSize: scaleSize(14),
                                  fontWeight: "600",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(14),
                                  fontWeight: "600",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
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
                                )} ($ ${x.commission})`}
                                value={`$ ${x.total}`}
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                        case "DiscountByStaff":
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
                              />
                              <ItemStaffInvoice
                                title="Cash"
                                value={`$ ${x.cash}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
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
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                              <ItemStaffInvoice
                                title="Check"
                                value={`$ ${x.check}`}
                                styleTilte={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                                styleValue={{
                                  fontSize: scaleSize(13),
                                  fontWeight: "200",
                                }}
                              />
                            </React.Fragment>
                          );
                      }
                    })}
                </View>
                <View style={{ height: scaleSize(100) }} />
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
    fontSize: scaleSize(13),
    alignSelf: "center",
    fontWeight: "200",
  },
  txt_info: {
    color: "#000",
    fontSize: scaleSize(12),
    fontWeight: "400",
  },
  txt_total: {
    color: "#000",
    fontSize: scaleSize(16),
    fontWeight: "200",
  },
});

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  profile: state.dataLocal.profile,
  groupAppointment: state.appointment.groupAppointment,
  paymentDetailInfo: state.appointment.paymentDetailInfo,
  printerSelect: state.dataLocal.printerSelect,
  printerList: state.dataLocal.printerList,
});

export default connectRedux(mapStateToProps, PopupStaffInvoicePrint);
