import React from "react";
import { NativeModules, Alert, Platform } from "react-native";
import _ from "ramda";
import env from "react-native-config";
import SendSMS from "react-native-sms";
import { parseString } from "react-native-xml2js";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import {
  formatNumberFromCurrency,
  formatMoney,
  scaleSize,
  roundFloatNumber,
  requestAPI,
  formatWithMoment,
} from "@utils";
import Configs from "@configs";
import * as l from "lodash";

const PosLink = NativeModules.report;
const PoslinkAndroid = NativeModules.PoslinkModule;

class TabFirstSettle extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      creditCount: 0,
      creditAmount: 0,
      editPaymentByHarmony: 0.0,
      editPaymentByCreditCard: 0.0,
      editPaymentByCash: 0.0,
      editOtherPayment: 0.0,
      discountSettlement: 0.0,
      paymentByGiftcard: 0.0,
      total: 0.0,
      note: "",
      isShowKeyboard: false,
      isEditOtherAmount: false,
      isEditCashAmount: false,
      visible: false,
      isGetReportFromPax: true,
      terminalID: null,
    };
    this.arrayStaffRef = [];
    this.inputHarmonyPaymentRef = React.createRef();
    this.inputCashPaymentRef = React.createRef();
    this.inputOtherPaymentRef = React.createRef();
    this.totalCustomRef = React.createRef();
    this.scrollRef = React.createRef();
    this.otherAmountRef = React.createRef();
    this.cashAmountRef = React.createRef();
    this.creditAmountRef = React.createRef();
  }

  setStateFromParent = async () => {
    await this.setState({
      isGetReportFromPax: true,
    });
  };

  keyboardDidShow = async () => {
    if (this.scrollRef.current) {
      this.scrollRef.current?.scrollToEnd();
    }
  };

  keyboardDidHide = async () => {
    this.scrollTo(0);
  };

  scrollTo = (number) => {
    if (this.scrollRef.current) {
      this.scrollRef.current?.scrollTo({
        x: 0,
        y: scaleSize(number),
        animated: true,
      });
    }
  };

  resetNoteFromParent = async () => {
    await this.setState({
      note: "",
      creditCount: 0,
      creditAmount: 0,
      editPaymentByCreditCard: 0.0,
    });
  };

  pushStaffIntoArrayStaff = (ref) => {
    if (ref) {
      this.arrayStaffRef.push(ref);
    }
  };

  handleErrorPaxOnAndroid = (msgError) => {
    this.setState({
      visible: false,
      creditCount: 0,
      editPaymentByCreditCard: 0.0,
    });
    this.props.actions.app.connectPaxMachineError(`${msgError}`);
  };

  handlePAXReport = () => {
    if (Platform.OS === "android") {
      this.handlePAXReport_Android();
    } else {
      const { cloverMachineInfo, paymentMachineType } = this.props;
      if(paymentMachineType == "Clover") {
        if(l.get(cloverMachineInfo, 'isSetup')){
          
          this.handleRequestAPIByTerminalID(l.get(cloverMachineInfo, 'serialNumber'), "clover")
        }else{
          this.props.actions.app.connectPaxMachineError(
            "Don't have setup in Hardware Tab!"
          );
        }
      }else{
        this.handlePAXReport_IOS();
      }
    }
  };

  handlePAXReport_Android = async () => {
    const { paxMachineInfo } = this.props;
    const { ip, port, timeout, isSetup } = paxMachineInfo;
    if (isSetup) {
      await this.setState({
        visible: true,
      });
      let totalReport = 0;
      let totalRecord = 0;
      let isError = false;
      const tempEnv = env.ENV;

      setTimeout(() => {
        PoslinkAndroid.startReport(
          ip,
          port,
          "",
          "LOCALDETAILREPORT",
          "ALL",
          "UNKNOWN",
          "UNKNOWN",
          (err) => {
            const errorDetailReport = JSON.parse(err);
            this.handleErrorPaxOnAndroid(errorDetailReport?.Msg);
          },
          (data) => {
            this.setState({
              visible: false,
            });
            const result = JSON.parse(data);
            if (result?.ResultTxt && result?.ResultTxt == "OK") {
              if (
                tempEnv == "Production" &&
                result?.Message === "DEMO APPROVED"
              ) {
                this.setState({
                  visible: false,
                  isGetReportFromPax: false,
                });

                setTimeout(() => {
                  alert("You're running your Pax on DEMO MODE!");
                }, 500);
                this.props.actions.app.connectPaxMachineError(
                  `You're running your Pax on DEMO MODE!`
                );
              } else {
                totalRecord = result.TotalRecord
                  ? parseInt(result.TotalRecord)
                  : 0;
                // ----------- Total Report --------
                PoslinkAndroid.startReport(
                  ip,
                  port,
                  "",
                  "LOCALTOTALREPORT",
                  "ALL",
                  "UNKNOWN",
                  "",
                  (error) => {
                    const errorTotalReport = JSON.parse(error);
                    this.handleErrorPaxOnAndroid(errorTotalReport?.Msg);
                  },
                  (amountData) => {
                    let amountResult = JSON.parse(amountData);
                    totalReport = amountResult.CreditAmount
                      ? parseFloat(amountResult.CreditAmount)
                      : 0;
                    this.props.actions.app.ConnectPaxMachineSuccess();
                    const moneyInPax = formatMoney(
                      roundFloatNumber(totalReport / 100)
                    );
                    this.setState({
                      creditCount: totalRecord,
                      // editPaymentByCreditCard: moneyInPax
                    });
                    this.setState({
                      visible: false,
                      isGetReportFromPax: false,
                    });

                    if ((totalRecord = 0)) {
                      this.setState({
                        editPaymentByCreditCard: 0.0,
                      });
                    }
                  }
                );
              }
            }
          }
        );
      }, 100);
    } else {
      this.props.actions.app.connectPaxMachineError(
        "Don't have setup in Hardware Tab!"
      );
      await this.setState({
        editPaymentByCreditCard: 0.0,
      });
    }
  };

  handlePAXReport_IOS = async () => {
    const { paxMachineInfo } = this.props;
    const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
      paxMachineInfo;

    if (isSetup) {
      await this.setState({
        visible: true,
      });
      // let totalReport = 0;
      let totalRecord = 0;
      let isError = false;

      try {
        const tempEnv = env.ENV;
        const tempIpPax = commType == "TCP" ? ip : "";
        const tempPortPax = commType == "TCP" ? port : "";
        const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
        // ----------- Total Amount --------
        let data = await PosLink.reportTransaction({
          transType: "LOCALDETAILREPORT",
          edcType: "ALL",
          cardType: "",
          paymentType: "",
          commType: commType,
          destIp: tempIpPax,
          portDevice: tempPortPax,
          timeoutConnect: "90000",
          bluetoothAddr: idBluetooth,
          refNum: "",
        });
        let result = JSON.parse(data);
        const ExtData = result?.ExtData || "";
        const xmlExtData =
          "<xml>" + ExtData.replace("\\n", "").replace("\\/", "/") + "</xml>";

        if (result?.ResultCode && result?.ResultCode == "000000") {
          if (tempEnv == "Production" && result?.Message === "DEMO APPROVED") {
            await this.setState({
              visible: false,
              isGetReportFromPax: false,
            });

            setTimeout(() => {
              alert("You're running your Pax on DEMO MODE!");
            }, 500);

            throw "You're running your Pax on DEMO MODE!";
          } else {
            totalRecord = parseInt(result?.TotalRecord || 0);

            parseString(xmlExtData, (err, result) => {
              if (err) {
                this.handleRequestAPIByTerminalID(null, "pax");
              } else {
                const terminalID = `${result?.xml?.SN || null}`;
                this.handleRequestAPIByTerminalID(terminalID, "pax");
              }
            });
          }
        } else {
          throw `${result.ResultTxt}`;
        }
      } catch (error) {
        isError = true;
        this.handleRequestAPIByTerminalID(null, "pax");
        this.props.actions.app.connectPaxMachineError(`${error}`);
      }

      if (!isError) {
        this.props.actions.app.ConnectPaxMachineSuccess();
        // const moneyInPax = formatMoney(roundFloatNumber(totalReport / 100));
        await this.setState({
          creditCount: totalRecord,
          // editPaymentByCreditCard: moneyInPax
        });
      }

      await this.setState({
        visible: false,
        isGetReportFromPax: false,
      });

      if ((totalRecord = 0)) {
        await this.setState({
          editPaymentByCreditCard: 0.0,
        });
      }
    } else {
      this.handleRequestAPIByTerminalID(null, "pax");
      this.props.actions.app.connectPaxMachineError(
        "Don't have setup in Hardware Tab!"
      );
      await this.setState({
        editPaymentByCreditCard: 0.0,
      });
    }
  };

  continueSettlement = () => {
    const { settleWaiting } = this.props;
    const {
      creditCount,
      editPaymentByHarmony,
      editPaymentByCreditCard,
      editPaymentByCash,
      editOtherPayment,
      note,
      discountSettlement,
      paymentByGiftcard,
      terminalID,
    } = this.state;
    this.props.gotoTabSecondSettle(
      {
        paymentByHarmony: editPaymentByHarmony,
        paymentByCreditCard: editPaymentByCreditCard,
        paymentByCash: editPaymentByCash,
        otherPayment: editOtherPayment,
        discount: discountSettlement,
        paymentByCashStatistic: settleWaiting.paymentByCash
          ? settleWaiting.paymentByCash
          : 0.0,
        otherPaymentStatistic: settleWaiting.otherPayment
          ? settleWaiting.otherPayment
          : 0.0,
        paymentByGiftcard: paymentByGiftcard,
        total: roundFloatNumber(
          formatNumberFromCurrency(editPaymentByHarmony) +
            formatNumberFromCurrency(editPaymentByCreditCard) +
            formatNumberFromCurrency(editPaymentByCash) +
            formatNumberFromCurrency(editOtherPayment) +
            formatNumberFromCurrency(discountSettlement) +
            formatNumberFromCurrency(paymentByGiftcard)
        ),
        note,
        terminalID,
      },
      creditCount
    );
  };

  gotoTabSecondSettle = async () => {
    const { versionApp, profileStaffLogin } = this.props;
    try {
      this.props.actions.app.loadingApp();
      const getSettlementWarning = await requestAPI({
        type: "GET_SETTLEMENT_WARNING",
        method: "GET",
        token: profileStaffLogin.token,
        api: `settlement/warning`,
        versionApp: versionApp,
      });
      this.props.actions.app.stopLoadingApp();

      const isWarning = getSettlementWarning.data
        ? getSettlementWarning.data
        : false;
      if (isWarning) {
        setTimeout(() => {
          Alert.alert(
            "Warning",
            "Please review your calendar. There are appointments that have not checked-out yet. Do you want to continue with settlement and cancel all unpaid appointments?",
            [
              {
                text: "No",
                onPress: () => {},
                style: "cancel",
              },
              { text: "Yes", onPress: () => this.continueSettlement() },
            ],
            { cancelable: false }
          );
        }, 300);
      } else {
        this.continueSettlement();
      }
    } catch (error) {
      this.props.actions.app.stopLoadingApp();
      this.props.actions.app.catchError(error);
    }
  };

  getInvoicesOfStaff = async (staffId) => {
    this.props.actions.invoice.invoicesOfStaff(staffId);
    for (let i = 0; i < this.arrayStaffRef.length; i++) {
      if (this.arrayStaffRef[i].props.staffId === staffId) {
        this.arrayStaffRef[i].setStateFromParent(true);
      } else {
        this.arrayStaffRef[i].setStateFromParent(false);
      }
    }
  };

  updateTotalCustom = async (key, value) => {
    await this.setState({
      [key]: value,
    });
  };

  // ----------- New code -----------
  onPressStaff = (staffId) => {
    this.props.onPressStaff(staffId);
  };

  onPressGiftCardTotal = () => {
    const { gitfCardSales } = this.props;
    if (gitfCardSales.length > 0) {
      this.props.onPressGiftCardTotal();
    }
  };

  editCashAmount = () => {
    this.setState({
      isEditCashAmount: true,
    });
    this.cashAmountRef.current?.setStateFromParent(this.state.editPaymentByCash);
  };

  cancelEditCashAmount = () => {
    this.setState({
      isEditCashAmount: false,
    });
    this.scrollTo(0);
  };

  saveEditCashAmount = () => {
    const changeAmount = this.cashAmountRef.current?.state.amount;
    this.setState({
      isEditCashAmount: false,
      editPaymentByCash: changeAmount,
    });

    this.scrollTo(0);
  };

  editOtherAmount = () => {
    this.setState({
      isEditOtherAmount: true,
    });
    this.otherAmountRef.current?.setStateFromParent(this.state.editOtherPayment);
  };

  cancelEditOtherAmount = () => {
    this.setState({
      isEditOtherAmount: false,
    });
    this.scrollTo(0);
  };

  saveEditOtherAmount = () => {
    const changeAmount = this.otherAmountRef.current?.state.amount;
    this.setState({
      isEditOtherAmount: false,
      editOtherPayment: changeAmount,
    });

    this.scrollTo(0);
  };

  refreshSettlement = async () => {
    this.handlePAXReport();
  };

  handleRequestAPIByTerminalID = (terminalID, paymentTerminal) => {
    this.setState({
      terminalID,
    });
    this.props.actions.app.updatePaxTerminalID(terminalID ? terminalID : "");
    this.props.actions.invoice.getSettlementWating(terminalID, paymentTerminal);
    this.props.actions.invoice.getListStaffsSales(terminalID);
    this.props.actions.invoice.getListGiftCardSales(terminalID);
    if (terminalID) {
      this.props.actions.app.ConnectPaxMachineSuccess();
    }
  };

  sendTotalViaSMS = async (data) => {
    try {
      const { listStaffByMerchant } = this.props;
      const staffInfo = listStaffByMerchant.find(
        (staff) => staff.staffId === data.staffId
      );
      if (staffInfo) {
        const displayName = staffInfo.displayName ? staffInfo.displayName : "";
        const total = data.total ? data.total : 0.0;
        const phone = staffInfo.phone ? staffInfo.phone : "";
        const today = formatWithMoment(new Date(), "MM/DD/YYYY");

        SendSMS.send(
          {
            body: `Hello ${displayName}, your total today ${today} is $${total}. Thank you :)`,
            recipients: [`${phone}`],
            successTypes: ["sent", "queued"],
            allowAndroidSendWithoutReadPermission: true,
            // attachment: attachment,
          },
          (completed, cancelled, error) => {
            // console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
          }
        );
      }
    } catch (error) {
      // alert(error)
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      isGettingSettlement,
      settleWaiting,
      isHandleInternalFirstSettlemetTab,
    } = this.props;

    if (
      isHandleInternalFirstSettlemetTab &&
      prevProps.isHandleInternalFirstSettlemetTab !==
        isHandleInternalFirstSettlemetTab
    ) {
      this.props.actions.invoice.resetInternalFirstSettlementState(false);
      this.handlePAXReport();
    }

    if (
      prevProps.isGettingSettlement === "loading" &&
      isGettingSettlement === "success" &&
      !_.isEmpty(settleWaiting) &&
      !isHandleInternalFirstSettlemetTab
    ) {
      // console.log("SettScreen");
      this.props.actions.app.changeFlagVisibleEnteerPinCode(false);
      this.props.actions.invoice.resetStateIsGettingSettlement();
      await this.setState({
        editPaymentByHarmony: settleWaiting?.paymentByHarmony || 0.0,
        editPaymentByCash: settleWaiting?.paymentByCash || 0.0,
        editOtherPayment: settleWaiting?.otherPayment || 0.0,
        total: settleWaiting?.total || 0.0,
        discountSettlement: settleWaiting?.discount || 0.0,
        editPaymentByCreditCard: settleWaiting?.paymentByCreditCard || 0.0,
        paymentByGiftcard: settleWaiting?.paymentByGiftcard || 0.0,
      });
    }
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  paxMachineInfo: state.hardware.paxMachineInfo,
  settleWaiting: state.invoice.settleWaiting,
  invoicesOfStaff: state.invoice.invoicesOfStaff,
  loading: state.app.loading,
  refreshingSettle: state.invoice.refreshingSettle,
  isGettingSettlement: state.invoice.isGettingSettlement,
  versionApp: state.dataLocal.versionApp,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  staffSales: state.invoice.staffSales,
  gitfCardSales: state.invoice.gitfCardSales,
  listStaffByMerchant: state.staff.listStaffByMerchant,
  isHandleInternalFirstSettlemetTab:
  state.invoice.isHandleInternalFirstSettlemetTab,
  cloverMachineInfo: state.hardware.cloverMachineInfo,
  paymentMachineType: state.hardware.paymentMachineType,
});

export default connectRedux(mapStateToProps, TabFirstSettle);
