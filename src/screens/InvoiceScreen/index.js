import React from "react";
import { NativeModules, Platform, NativeEventEmitter } from "react-native";
import _ from "ramda";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { StarPRNT } from "react-native-star-prnt";
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import {
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getPaymentStringInvoice,
  getQuickFilterStringInvoice,
  checkStatusPrint,
  getInfoFromModelNameOfPrinter,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  localize,
  PaymentTerminalType,
  requestTransactionDejavoo,
  role,
  menuTabs,
  isPermissionToTab,
  stringIsEmptyOrWhiteSpaces,
} from "@utils";
import PrintManager from "@lib/PrintManager";
import * as l from "lodash";
import { parseString } from "react-native-xml2js";

const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

const initalState = {
  isFocus: false,
  visibleCalendar: false,
  searchFilter: {
    keySearch: "",
    paymentMethod: "",
    status: "",
  },
  titleRangeTime: "Time Range",
  visibleEnterPin: true,
  visibleConfirmInvoiceStatus: false,
  visibleProcessingCredit: false,
  transactionId: false,
  visiblePrintInvoice: false,
  titleInvoice: "",
  receiptContentBg: "#fff",
};

class InvoiceScreen extends Layout {
  constructor(props) {
    super(props);
    this.state = initalState;
    this.scrollTabInvoiceRef = React.createRef();
    this.modalCalendarRef = React.createRef();
    this.onEndReachedCalledDuringMomentum = true;
    this.checkInvoicePermissionRef = React.createRef();
    this.confirmInvoiceStatusRef = React.createRef();
    this.popupProcessingCreditRef = React.createRef();
    this.invoicePrintRef = React.createRef();
    this.invoicePrintRef = React.createRef();
    this.viewShotRef = React.createRef();
    this.virtualizedListRef = React.createRef();
    this.invoiceRef = React.createRef();

    //ADD LISTENER FROM CLOVER MODULE
    this.eventEmitter = new NativeEventEmitter(clover);
    this.subscriptions = [];
    this.isProcessVoidPaymentClover = false;
    this.isProcessPrintClover = false;

    this.onResultScanCode = this.onResultScanCode.bind(this);
  }

  registerEvents() {
    const { cloverMachineInfo, language } = this.props;
    clover.changeListenerStatus(true);
    this.subscriptions = [
      this.eventEmitter.addListener("voidPaymentSuccess", (data) => {
        this.isProcessVoidPaymentClover = false;
        let messageUpdate = {
          ...data,
          sn: l.get(cloverMachineInfo, "serialNumber"),
        };
        this.handleResultVoidTransactionCloverSuccess(messageUpdate);
      }),
      this.eventEmitter.addListener("voidPaymentFail", (data) => {
        this.isProcessVoidPaymentClover = false;
        this.handleResultVoidTransactionCloverFailed(
          l.get(data, "errorMessage")
        );
      }),
      this.eventEmitter.addListener("refundPaymentSuccess", (data) => {
        this.isProcessVoidPaymentClover = false;
        let messageUpdate = {
          ...data,
          sn: l.get(cloverMachineInfo, "serialNumber"),
        };
        this.handleResultVoidTransactionCloverSuccess(messageUpdate);
      }),
      this.eventEmitter.addListener("refundPaymentFail", (data) => {
        this.isProcessVoidPaymentClover = false;
        this.handleResultVoidTransactionCloverFailed(
          l.get(data, "errorMessage")
        );
      }),
      this.eventEmitter.addListener("pairingCode", (data) => {
        if (data) {
          const text = `Pairing code: ${l.get(data, "pairingCode")}`;
          if (this.isProcessVoidPaymentClover) {
            this.setState({
              visibleProcessingCredit: false,
            });
          }
          if (this.isProcessPrintClover) {
            this.setState({
              visiblePrintInvoice: false,
            });
          }
        }
      }),
      this.eventEmitter.addListener("pairingSuccess", (data) => {
        this.props.actions.hardware.setCloverToken(l.get(data, "token"));

        if (this.isProcessVoidPaymentClover) {
          this.setState({
            visibleProcessingCredit: true,
          });
        }
      }),

      this.eventEmitter.addListener("deviceDisconnected", () => {
        if (this.isProcessVoidPaymentClover) {
          this.isProcessVoidPaymentClover = false;
          this.handleResultVoidTransactionCloverFailed(
            localize("No connected device", language)
          );
        }
      }),
    ];
  }

  unregisterEvents() {
    clover.changeListenerStatus(false);
    this.subscriptions.forEach((e) => e.remove());
    this.subscriptions = [];
  }

  componentDidMount() {
    this.registerEvents();
    this.didBlurSubscription = this.props.navigation.addListener(
      "blur",
      (payload) => {
        this.setState(initalState);
        this.checkInvoicePermissionRef.current?.setStateFromParent("");
        this.props.actions.invoice.resetInvoiceDetailState();
        this.virtualizedListRef?.current?.scrollToOffset({
          x: 0,
          y: 0,
          animated: false,
        });
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "focus",
      (payload) => {
        this.setState({
          isFocus: true,
        });
        this.checkInvoicePermissionRef.current?.setStateFromParent("");
        this.modalCalendarRef?.current?.selectQuickFilter("Time Range");

        const { profileStaffLogin } = this.props;
        const roleName = profileStaffLogin?.roleName || role.Admin;
        const permission = l.get(profileStaffLogin, "permission", []);
        if (roleName === role.Admin) {
          this.props.actions.invoice.getListInvoicesByMerchant();
          this.props.actions.invoice.resetProfileInvoiceLogin();
        } else if (roleName === role.Manager) {
          if (isPermissionToTab(permission, menuTabs.MENU_INVOICE)) {
            this.props.actions.invoice.getListInvoicesByMerchant();
            this.props.actions.invoice.resetProfileInvoiceLogin();
          } else {
            this.props.actions.invoice.toggleInvoiceTabPermission();
          }
        } else {
          this.props.actions.invoice.toggleInvoiceTabPermission();
        }
      }
    );
  }

  async updateSearchFilterInfo(key, value, keyParent = "") {
    const { searchFilter } = this.state;
    if (keyParent !== "") {
      const temptParent = searchFilter[keyParent];
      const temptChild = { ...temptParent, [key]: value };
      const temptUpdate = { ...searchFilter, [keyParent]: temptChild };
      await this.setState({
        searchFilter: temptUpdate,
      });
    } else {
      const temptUpdate = { ...searchFilter, [key]: value };
      await this.setState({
        searchFilter: temptUpdate,
      });
    }
    if (key !== "keySearch") {
      setTimeout(() => {
        this.searchInvoice();
      }, 100);
      this.virtualizedListRef?.current?.scrollToOffset({
        x: 0,
        y: 0,
        animated: false,
      });
    } else {
      this.props.actions.invoice.updateSearchKeyword(
        this.state.searchFilter.keySearch
      );
    }
  }

  gotoTabPaymentInfomation = () => {
    this.scrollTabInvoiceRef.current?.goToPage(1);
  };

  gotoBasket = () => {
    this.scrollTabInvoiceRef.current?.goToPage(2);
  };

  gotoHistory = () => {
    this.scrollTabInvoiceRef.current?.goToPage(1);
  };

  backTab = () => {
    this.scrollTabInvoiceRef.current?.goToPage(0);
  };

  showCalendar = () => {
    this.setState({
      visibleCalendar: true,
    });
  };

  changeTitleTimeRange = async (title) => {
    await this.setState({
      titleRangeTime: title === "Select" ? "Time Range" : title,
      visibleCalendar: false,
    });
    setTimeout(() => {
      this.searchInvoice();
    }, 200);
  };

  handleLockScreen = () => {
    const { isFocus } = this.state;
    const { profile } = this.props;

    if (isFocus && !this.props.visibleEnterPinInvoice) {
      // this.props.navigation.navigate("Home");
      this.props.navigation.navigate(
        profile.type === "Retailer" ? "retailer.home.order" : "Home"
      );
      this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    }
  };

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  convertBasket(basket) {
    const arrayProducts = getArrayProductsFromAppointment(basket.products);
    const arryaServices = getArrayServicesFromAppointment(basket.services);
    const arrayExtras = getArrayExtrasFromAppointment(basket.extras);
    const arrayGiftCards = getArrayGiftCardsFromAppointment(basket.giftCards);
    const temptBasket = arryaServices.concat(
      arrayExtras,
      arrayProducts,
      arrayGiftCards
    );

    return temptBasket;
  }

  setInvoiceDetail = (invoice) => () => {
    this.props.actions.invoice.getInvoiceDetail(invoice?.checkoutId);
  };

  onRefreshInvoiceList = () => {
    this.searchInvoice(1, false);
  };

  searchInvoiceWithKeyword = () => {
    this.props.actions.invoice.updateSearchKeyword(
      this.state.searchFilter.keySearch
    );
    this.searchInvoice();
    this.virtualizedListRef?.current?.scrollToOffset({
      x: 0,
      y: 0,
      animated: false,
    });
  };

  clearSearchText = async () => {
    await this.updateSearchFilterInfo("keySearch", "");
  };

  searchInvoice = (page = 1, isShowLoading = true, isLoadMore = false) => {
    const { searchKeyword } = this.props;
    const { searchFilter } = this.state;
    const { keySearch, paymentMethod, status } = searchFilter;
    const { isCustomizeDate, startDate, endDate, quickFilter } =
      this.modalCalendarRef.current?.state;

    this.props.actions.invoice.getListInvoicesByMerchant(
      searchKeyword === keySearch ? `${encodeURIComponent(keySearch)}` : "",
      getPaymentStringInvoice(paymentMethod),
      status,
      isCustomizeDate ? startDate : "",
      isCustomizeDate ? endDate : "",
      quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
      page,
      isShowLoading,
      isLoadMore
    );
  };

  loadMoreInvoiceList = ({ distanceFromEnd }) => {
    if (!this.onEndReachedCalledDuringMomentum) {
      const { totalPages, currentPage } = this.props;
      if (currentPage < totalPages) {
        this.searchInvoice(parseInt(currentPage + 1), false, true);
        this.onEndReachedCalledDuringMomentum = true;
      }
    }
  };

  getItemCount = (data) => {
    return data?.length;
  };

  getItem = (data, index) => {
    return {
      ...data[index],
      id: `${data[index]?.checkoutId}_${Math.random()
        .toString(12)
        .substring(0)}`,
    };
  };

  changeStatustransaction = async () => {
    const { invoiceDetail } = this.props;
    this.confirmInvoiceStatusRef.current?.setStateFromParent(invoiceDetail);

    await this.setState({
      visibleConfirmInvoiceStatus: true,
    });
  };

  confirmChangeInvoiceStatus = async () => {
    const {
      paxMachineInfo,
      invoiceDetail,
      cloverMachineInfo,
      paymentMachineType,
      language,
    } = this.props;
    const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
      paxMachineInfo;

    if (invoiceDetail?.paymentMethod === "credit_card") {
      const paymentInformation =
        invoiceDetail?.paymentInformation[0]?.responseData || {};
      const method = l.get(
        invoiceDetail,
        "paymentInformation.0.paymentData.method"
      );

      if (!_.isEmpty(paymentInformation)) {
        await this.setState({
          visibleConfirmInvoiceStatus: false,
          visibleProcessingCredit: true,
        });
        if (Platform.OS === "android") {
          // ------------------ REFUND ----------------
          if (invoiceDetail?.status === "paid") {
            this.popupProcessingCreditRef.current?.setStateFromParent(false);
            setTimeout(() => {
              PoslinkAndroid.refundTransaction(
                ip,
                port,
                "",
                "CREDIT",
                "RETURN",
                paymentInformation.ApprovedAmount,
                `${paymentInformation.RefNum}`,
                `${paymentInformation.ExtData}`,
                (err) => {
                  const errorTrans = JSON.parse(err);
                  this.setState({
                    visibleProcessingCredit: false,
                  });
                  setTimeout(() => {
                    alert(err);
                  }, 300);
                },
                (data) => {
                  this.handleResultRefundTransaction(data);
                }
              );
            }, 100);
            // ------------------ VOID ----------------
          } else if (invoiceDetail?.status === "complete") {
            const transactionId = paymentInformation.RefNum
              ? paymentInformation.RefNum
              : 0;
            this.popupProcessingCreditRef.current?.setStateFromParent(
              transactionId
            );
            setTimeout(() => {
              PoslinkAndroid.voidTransaction(
                ip,
                port,
                "",
                "CREDIT",
                "VOID",
                `${paymentInformation.RefNum}`,
                `${paymentInformation.ExtData}`,
                (err) => {
                  const errorTrans = JSON.parse(err);
                  this.setState({
                    visibleProcessingCredit: false,
                  });
                  setTimeout(() => {
                    alert(err);
                  }, 300);
                },
                (data) => {
                  this.handleResultVoidTransaction(data);
                }
              );
            }, 100);
          }
        } else {
          if (invoiceDetail?.status === "paid") {
            this.popupProcessingCreditRef.current?.setStateFromParent(false);

            if (paymentMachineType == PaymentTerminalType.Clover) {
              if (method != "Clover") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              const portClover = l.get(cloverMachineInfo, "port")
                ? l.get(cloverMachineInfo, "port")
                : 80;
              const ipClover = l.get(cloverMachineInfo, "ip");
              const url = `wss://${ipClover}:${portClover}/remote_pay`;
              this.isProcessVoidPaymentClover = true;
              const paymentInfo = {
                url,
                remoteAppId: REMOTE_APP_ID,
                appName: APP_NAME,
                posSerial: POS_SERIAL,
                token: l.get(cloverMachineInfo, "token")
                  ? l.get(cloverMachineInfo, "token", "")
                  : "",
                orderId: paymentInformation?.orderId || "",
                paymentId: paymentInformation?.id || "",
              };
              clover.refundPayment(paymentInfo);
            } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
              if (method != "Dejavoo") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              const amount = l.get(
                invoiceDetail,
                "paymentInformation.0.amount"
              );

              parseString(paymentInformation, (err, result) => {
                if (err) {
                  setTimeout(() => {
                    alert("Error");
                  }, 300);
                } else {
                  const transactionId = l.get(result, "xmp.response.0.RefId.0");
                  const invNum = l.get(result, "xmp.response.0.InvNum.0");
                  const params = {
                    tenderType: "Credit",
                    transType: "Return",
                    amount: parseFloat(amount).toFixed(2),
                    RefId: transactionId,
                    invNum: `${invNum}`,
                  };
                  requestTransactionDejavoo(params).then((responses) => {
                    this.handleResultRefundTransactionDejavoo(responses);
                  });
                }
              });
            } else {
              //Pax
              const amount = paymentInformation?.ApprovedAmount || 0;
              const transactionId = paymentInformation?.RefNum || 0;
              const extData = paymentInformation?.ExtData || "";
              const invNum = paymentInformation?.InvNum || "";
              const tempIpPax = commType == "TCP" ? ip : "";
              const tempPortPax = commType == "TCP" ? port : "";
              const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;

              if (method != "Pax") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              PosLink.sendTransaction(
                {
                  tenderType: "CREDIT",
                  transType: "RETURN",
                  amount: `${parseFloat(amount)}`,
                  transactionId: transactionId,
                  extData: extData,
                  commType: commType,
                  destIp: tempIpPax,
                  portDevice: tempPortPax,
                  timeoutConnect: "90000",
                  bluetoothAddr: idBluetooth,
                  invNum: `${invNum}`,
                },
                (data) => this.handleResultRefundTransaction(data)
              );
            }
          } else if (invoiceDetail?.status === "complete") {
            if (paymentMachineType == PaymentTerminalType.Clover) {
              if (method != "Clover") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              this.isProcessVoidPaymentClover = true;
              const portClover = l.get(cloverMachineInfo, "port")
                ? l.get(cloverMachineInfo, "port")
                : 80;
              const ipClover = l.get(cloverMachineInfo, "ip");

              const url = `wss://${ipClover}:${portClover}/remote_pay`;
              this.isProcessVoidPaymentClover = true;
              const paymentInfo = {
                url,
                remoteAppId: REMOTE_APP_ID,
                appName: APP_NAME,
                posSerial: POS_SERIAL,
                token: l.get(cloverMachineInfo, "token")
                  ? l.get(cloverMachineInfo, "token", "")
                  : "",
                orderId: paymentInformation?.orderId || "",
                paymentId: paymentInformation?.id || "",
              };
              clover.voidPayment(paymentInfo);
            } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
              if (method != "Dejavoo") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              const amount = l.get(
                invoiceDetail,
                "paymentInformation.0.amount"
              );
              parseString(paymentInformation, (err, result) => {
                if (err) {
                  setTimeout(() => {
                    alert("Error");
                  }, 300);
                } else {
                  const transactionId = l.get(result, "xmp.response.0.RefId.0");
                  const invNum = l.get(result, "xmp.response.0.InvNum.0");
                  const params = {
                    tenderType: "Credit",
                    transType: "Void",
                    amount: parseFloat(amount).toFixed(2),
                    RefId: transactionId,
                    invNum: `${invNum}`,
                  };
                  requestTransactionDejavoo(params).then((responses) => {
                    this.handleResultRefundTransactionDejavoo(responses);
                  });
                }
              });
            } else {
              //Pax
              const transactionId = paymentInformation?.RefNum || 0;
              const extData = paymentInformation?.ExtData || "";
              const invNum = paymentInformation?.InvNum || "";
              const tempIpPax = commType == "TCP" ? ip : "";
              const tempPortPax = commType == "TCP" ? port : "";
              const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
              this.popupProcessingCreditRef.current?.setStateFromParent(
                transactionId
              );
              if (method != "Pax") {
                await this.setState({
                  visibleConfirmInvoiceStatus: true,
                  visibleProcessingCredit: false,
                });
                alert(localize("Your transaction is invalid", language));
                return;
              }
              PosLink.sendTransaction(
                {
                  tenderType: "CREDIT",
                  transType: "VOID",
                  amount: "",
                  transactionId: transactionId,
                  extData: extData,
                  commType: commType,
                  destIp: tempIpPax,
                  portDevice: tempPortPax,
                  timeoutConnect: "90000",
                  bluetoothAddr: idBluetooth,
                  invNum: `${invNum}`,
                },
                (data) => this.handleResultVoidTransaction(data)
              );
            }
          }
        }
      }
    } else {
      //payment method != credit card
      await this.setState({
        visibleConfirmInvoiceStatus: false,
        titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
      });
      this.props.actions.invoice.changeStatustransaction(
        invoiceDetail?.checkoutId,
        this.getParamsSearch()
      );
    }
  };

  getParamsSearch = () => {
    const { searchKeyword } = this.props;
    const { searchFilter } = this.state;
    const { keySearch, paymentMethod, status } = searchFilter;
    const { isCustomizeDate, startDate, endDate, quickFilter } =
      this.modalCalendarRef.current?.state;

    return `page=1&method=${getPaymentStringInvoice(
      paymentMethod
    )}&status=${status}&timeStart=${isCustomizeDate ? startDate : ""}&timeEnd=${
      isCustomizeDate ? endDate : ""
    }&key=${searchKeyword === keySearch ? keySearch : ""}&quickFilter=${
      quickFilter ? getQuickFilterStringInvoice(quickFilter) : ""
    }`;
  };

  handleResultVoidTransactionCloverSuccess = async (result) => {
    const { invoiceDetail, cloverMachineInfo } = this.props;

    await this.setState({
      visibleProcessingCredit: false,
    });

    if (Platform.OS === "ios") {
      this.props.actions.invoice.changeStatustransaction(
        invoiceDetail?.checkoutId,
        this.getParamsSearch(),
        result,
        "clover"
      );
      await this.setState({
        titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
      });
    }
  };

  handleResultVoidTransactionCloverFailed = async (message) => {
    await this.setState({
      visibleProcessingCredit: false,
    });
    setTimeout(() => {
      alert(message);
    }, 300);
  };

  handleResultVoidTransaction = async (result) => {
    const { invoiceDetail } = this.props;
    const data = JSON.parse(result);

    await this.setState({
      visibleProcessingCredit: false,
    });

    if (Platform.OS === "android") {
      if (data.ResultCode == "000000") {
        this.props.actions.invoice.changeStatustransaction(
          invoiceDetail?.checkoutId,
          this.getParamsSearch(),
          result
        );
        await this.setState({
          titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
        });
      } else {
        setTimeout(() => {
          alert(data.ResultTxt);
        }, 300);
      }
    } else {
      if (data.ResultCode === "000000") {
        this.props.actions.invoice.changeStatustransaction(
          invoiceDetail?.checkoutId,
          this.getParamsSearch(),
          result,
          "pax"
        );
        await this.setState({
          titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
        });
      } else {
        PosLink.cancelTransaction();
        setTimeout(() => {
          alert(data.message);
        }, 300);
      }
    }
  };

  handleResultRefundTransaction = async (result) => {
    const { invoiceDetail } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });
    const data = JSON.parse(result);
    if (Platform.OS === "android") {
      if (data.ResultCode == "000000") {
        this.props.actions.invoice.changeStatustransaction(
          invoiceDetail?.checkoutId,
          this.getParamsSearch(),
          result
        );
        await this.setState({
          titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
        });
      } else {
        setTimeout(() => {
          alert(data.ResultTxt);
        }, 300);
      }
    } else {
      if (data.ResultCode === "000000") {
        this.props.actions.invoice.changeStatustransaction(
          invoiceDetail.checkoutId,
          this.getParamsSearch(),
          result,
          "pax"
        );
        await this.setState({
          titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
        });
      } else {
        PosLink.cancelTransaction();
        setTimeout(() => {
          alert(data.message);
        }, 300);
      }
    }
  };

  handleResultRefundTransactionDejavoo = async (responses) => {
    const { invoiceDetail } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });

    parseString(responses, (err, result) => {
      if (err || l.get(result, "xmp.response.0.ResultCode.0") != 0) {
        let detailMessage = l
          .get(result, "xmp.response.0.RespMSG.0", "")
          .replace(/%20/g, " ");
        detailMessage = !stringIsEmptyOrWhiteSpaces(detailMessage)
          ? `: ${detailMessage}`
          : detailMessage;

        const resultTxt =
          `${l.get(result, "xmp.response.0.Message.0")}${detailMessage}` ||
          "Error";
        setTimeout(() => {
          alert(resultTxt);
        }, 300);
      } else {
        this.props.actions.invoice.changeStatustransaction(
          invoiceDetail.checkoutId,
          this.getParamsSearch(),
          responses,
          "dejavoo"
        );
        this.setState({
          titleInvoice: invoiceDetail?.status === "paid" ? "REFUND" : "VOID",
        });
      }
    });
  };

  cancelTransaction = async () => {
    const { paymentMachineType } = this.props;

    if (paymentMachineType == PaymentTerminalType.Dejavoo) {
      alert("Can not cancel request.");
      return;
    }

    if (paymentMachineType == PaymentTerminalType.Clover) {
      clover.cancelTransaction();
    } else {
      PosLink.cancelTransaction();
    }
    await this.setState({
      visibleProcessingCredit: false,
    });
  };

  getBasket = (appointment) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];

    // ------ Push Service -------
    appointment.services.forEach((service) => {
      arryaServicesBuy.push({
        type: "Service",
        data: {
          name: service.serviceName ? service.serviceName : "",
          price: service.price ? service.price : "",
        },
        staff: service.staff ? service.staff : false,
      });
    });

    // ------ Push Product -------
    appointment.products.forEach((product) => {
      arrayProductBuy.push({
        type: "Product",
        data: {
          name: product.productName ? product.productName : "",
          price: product.price ? product.price : "",
        },
        quanlitySet: product.quantity ? product.quantity : "",
      });
    });

    // ------ Push Product -------
    appointment.extras.forEach((extra) => {
      arrayExtrasBuy.push({
        type: "Extra",
        data: {
          name: extra.extraName ? extra.extraName : "",
          price: extra.price ? extra.price : "",
        },
      });
    });

    // ------ Push Gift Card -------
    appointment.giftCards.forEach((gift) => {
      arrayGiftCards.push({
        type: "GiftCards",
        data: {
          name: gift.name ? gift.name : "Gift Card",
          price: gift.price ? gift.price : "",
        },
        quanlitySet: gift.quantity ? gift.quantity : "",
      });
    });

    return {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
    };
  };

  printInvoice = async () => {
    const { invoiceDetail } = this.props;

    const { titleInvoice } = this.state;

    if (!invoiceDetail?.appointmentId) {
      alert("You don't select invoice!");
    } else {
      const printMachine = await checkStatusPrint();
      if (printMachine && printMachine.length > 0) {
        this.props.actions.invoice.togglPopupConfirmPrintInvoice(false);

        const {
          arryaServicesBuy,
          arrayProductBuy,
          arrayExtrasBuy,
          arrayGiftCards,
        } = this.getBasket(invoiceDetail.basket);
        // const basket = arrayProductBuy.concat(arryaServicesBuy, arrayExtrasBuy, arrayGiftCards);
        const basket = arryaServicesBuy.concat(
          arrayExtrasBuy,
          arrayProductBuy,
          arrayGiftCards
        );
        const { subTotal, total, discount, tipAmount, tax, paymentMethod } =
          invoiceDetail;
        const promotionNotes = invoiceDetail?.promotionNotes?.note || "";

        this.invoicePrintRef.current?.setStateFromParent(
          basket,
          subTotal,
          tax,
          discount,
          tipAmount,
          total,
          paymentMethod,
          false,
          printMachine,
          promotionNotes,
          titleInvoice,
          invoiceDetail?.checkoutId || "",
          invoiceDetail?.checkoutPayments || []
        );

        await this.setState({
          visiblePrintInvoice: true,
        });
      } else {
        const { cloverMachineInfo, paymentMachineType } = this.props;
        const { isSetup } = cloverMachineInfo;
        if (paymentMachineType == "Clover" && isSetup) {
          await this.setState({
            visiblePrintInvoice: true,
          });
        } else {
          alert("Please connect to your printer!");
        }
      }
    }
  };

  cancelInvoicePrint = async (isPrintTempt) => {
    await this.setState({ visiblePrintInvoice: false });
    this.updateInvoiceDetailAfterCallServer();
  };

  closePopupConfirmPrintInvoice = () => {
    this.props.actions.invoice.togglPopupConfirmPrintInvoice(false);
    this.updateInvoiceDetailAfterCallServer();
  };

  updateInvoiceDetailAfterCallServer = async () => {};

  doPrintClover(imageUri) {
    this.isProcessPrintClover = true;
    const { cloverMachineInfo } = this.props;
    const port = l.get(cloverMachineInfo, "port")
      ? l.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

    const printInfo = {
      imageUri,
      url,
      remoteAppId: REMOTE_APP_ID,
      appName: APP_NAME,
      posSerial: POS_SERIAL,
      token: l.get(cloverMachineInfo, "token")
        ? l.get(cloverMachineInfo, "token", "")
        : "",
    };
    clover.doPrintWithConnect(printInfo);
    this.isProcessPrintClover = false;
  }

  printCustomerInvoice = async () => {
    try {
      const { printerSelect, printerList } = this.props;
      const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );

      await this.setState({ receiptContentBg: "#00000000" }, async () => {
        if (portName) {
          this.props.actions.app.loadingApp();
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

            await PrintManager.getInstance().print(
              emulation,
              commands,
              portName
            );
            releaseCapture(imageUri);
          }
          this.props.actions.app.stopLoadingApp();
        } else {
          const { cloverMachineInfo, paymentMachineType } = this.props;
          const { isSetup } = cloverMachineInfo;
          if (paymentMachineType == "Clover" && isSetup) {
            this.props.actions.app.loadingApp();
            const imageUri = await captureRef(this.viewShotRef, {
              result: "base64",
            });
            if (imageUri) {
              this.doPrintClover(imageUri);
              releaseCapture(imageUri);
            }
            this.props.actions.app.stopLoadingApp();
          } else {
            alert("Please connect to your printer!");
          }
        }
      });
    } catch (error) {
      this.props.actions.app.stopLoadingApp();
      setTimeout(() => {
        alert("error ", error);
      }, 500);
    }
  };

  shareCustomerInvoice = async () => {
    try {
      await this.setState({ receiptContentBg: "#fff" }, async () => {
        const imageUri = await captureRef(this.viewShotRef, {});
        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(imageUri);
        } else {
          const shareResponse = await Share.open({
            url: `file://${imageUri}`,
          });
        }
      });
    } catch (error) {
      // alert(error)
    }
  };

  closePopupCheckInvoiceTabPermission = () => {
    const { profile } = this.props;

    this.props.actions.invoice.toggleInvoiceTabPermission(false);
    this.props.navigation.navigate(
      profile.type === "Retailer" ? "retailer.home.order" : "Home"
    );
  };

  clearIntervalById = () => {
    const { notiIntervalId } = this.props;
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      this.props.actions.app.resetNotiIntervalId();
    }
  };

  componentWillUnmount() {
    this.didBlurSubscription();
    this.didFocusSubscription();
    this.unregisterEvents();
  }

  async onResultScanCode(scanResult) {
    if (scanResult?.trim()) {
      await this.updateSearchFilterInfo("keySearch", scanResult);

      await this.props.actions.invoice.updateSearchKeyword(scanResult);

      this.searchInvoice();
      this.virtualizedListRef?.current?.scrollToOffset({
        x: 0,
        y: 0,
        animated: false,
      });
    } else {
      setTimeout(() => {
        alert(`Scan code fail ${data}`);
      }, 100);
    }
  }
}

const mapStateToProps = (state) => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  listInvoicesByMerchant: state.invoice.listInvoicesByMerchant,
  refreshListInvoice: state.invoice.refreshListInvoice,
  listInvoicesSearch: state.invoice.listInvoicesSearch,
  isShowSearchInvoice: state.invoice.isShowSearchInvoice,
  totalPages: state.invoice.totalPages,
  currentPage: state.invoice.currentPage,
  visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,
  paxMachineInfo: state.hardware.paxMachineInfo,
  visibleConfirmPrintInvoice: state.invoice.visibleConfirmPrintInvoice,
  isLoadMoreInvoiceList: state.invoice.isLoadMoreInvoiceList,
  searchKeyword: state.invoice.searchKeyword,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  invoiceTabPermission: state.invoice.invoiceTabPermission,

  printerSelect: state.dataLocal.printerSelect,
  printerList: state.dataLocal.printerList,
  profileLoginInvoice: state.dataLocal.profileLoginInvoice,
  notiIntervalId: state.app.notiIntervalId,

  invoiceDetail: state.invoice.invoiceDetail,

  cloverMachineInfo: state.hardware.cloverMachineInfo,
  paymentMachineType: state.hardware.paymentMachineType,
});

export default connectRedux(mapStateToProps, InvoiceScreen);
