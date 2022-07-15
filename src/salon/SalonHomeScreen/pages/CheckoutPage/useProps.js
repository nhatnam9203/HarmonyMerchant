import actions from "@actions";
import NavigatorServices from "@navigators/NavigatorServices";
import { ScreenName } from "@src/ScreenName";
import * as AppUtils from "@utils";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { NativeEventEmitter, NativeModules, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Helpers from "../../Helpers";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import * as controllers from "../../controllers";
import { parseString } from "react-native-xml2js";
import env from "react-native-config";
import Configs from "@configs";

const signalR = require("@microsoft/signalr");

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

export const useProps = (props) => {
  const dispatch = useDispatch();
  const { navigation, isBookingFromCalendar } = props || {};
  const homePageCtx = React.useContext(controllers.SalonHomePageContext);

  // References
  let isProcessPaymentClover = React.useRef(false);
  const subscriptions = React.useRef([]);
  const isProcessPrintClover = React.useRef(false);
  const eventEmitter = React.useRef(new NativeEventEmitter(clover));
  const categoriesRef = React.useRef(null);
  const amountRef = React.useRef(null);
  const popupAddItemIntoAppointmentsRef = React.useRef(null);
  const modalBillRef = React.useRef(null);
  const blockAppointmentRef = React.useRef([]).current;
  const changePriceAmountProductRef = React.useRef(null);
  const popupDiscountRef = React.useRef(null);
  const popupDiscountLocalRef = React.useRef(null);
  const popupCheckDiscountPermissionRef = React.useRef(null);
  const changeTipRef = React.useRef(null);
  const cashBackRef = React.useRef(null);
  const changeStylistRef = React.useRef(null);
  const popupEnterAmountGiftCardRef = React.useRef(null);
  const popupSendLinkInstallRef = React.useRef(null);
  const activeGiftCardRef = React.useRef(null);
  const invoicePrintRef = React.useRef(null);
  const popupCustomerInfoRef = React.useRef(null);
  const addEditCustomerInfoRef = React.useRef(null);
  const invoiceRef = React.useRef(null);
  const popupEnterAmountCustomServiceRef = React.useRef(null);
  const payAppointmentId = React.useRef(0);
  const moneyUserGiveForStaffRef = React.useRef(0);

  // Redux state
  const appointment = useSelector((state) => state.appointment) || {};
  const category = useSelector((state) => state.category) || {};
  const dataLocal = useSelector((state) => state.dataLocal) || {};
  const network = useSelector((state) => state.network);
  const extra = useSelector((state) => state.extra);
  const service = useSelector((state) => state.service) || {};
  const product = useSelector((state) => state.product) || {};
  const staff = useSelector((state) => state.staff) || {};
  const hardware = useSelector((state) => state.hardware) || {};
  const marketing = useSelector((state) => state.marketing) || {};
  const isTipOnPaxMachine = useSelector(
    (state) => state.dataLocal.isTipOnPaxMachine
  );
  const isCreditPaymentToServer = useSelector(
    (state) => state.appointment.isCreditPaymentToServer
  );
  const lastGroupAppointmentPay = useSelector(
    (state) => state.appointment.lastGroupAppointmentPay
  );
  const errorMessage = useSelector((state) => state.appointment.errorMessage);

  // Local state
  const [stateLocal, dispatchLocal] = React.useReducer(
    CheckoutState.reducer,
    CheckoutState.initState
  );

  // Api call
  const apis = useCallApis({
    dispatchLocal,
  });

  // State
  const [visibleConfirmPayment, setVisibleConfirmPayment] =
    React.useState(false);
  // const [visibleConfirm, setVisibleConfirm] = React.useState(false);
  const [visibleErrorMessageFromPax, setVisibleErrorMessageFromPax] =
    React.useState(false);
  const [errorMessageFromPax, setErrorMessageFromPax] = React.useState("");
  const [visibleChangeMoney, setVisibleChangeMoney] = React.useState(false);
  const [visibleChangeStylist, setVisibleChangeStylist] = React.useState(false);
  const [visibleChangePriceAmountProduct, setVisibleChangePriceAmountProduct] =
    React.useState(false);
  const [visibleChangeTip, setVisibleChangeTip] = React.useState(false);
  const [visibleProcessingCredit, setVisibleProcessingCredit] =
    React.useState(false);
  const [visibleBillOfPayment, setVisibleBillOfPayment] = React.useState(false);
  const [visibleSendLinkPopup, setVisibleSendLinkPopup] = React.useState(false);
  const [visiblePopupPaymentDetails, setVisiblePopupPaymentDetails] =
    React.useState(false);
  const [visibleScanCode, setVisibleScanCode] = React.useState(false);
  const [visiblePrintInvoice, setVisiblePrintInvoice] = React.useState(false);
  const [visiblePopupAddItemIntoBasket, setVisiblePopupAddItemIntoBasket] =
    React.useState(false);

  const [visibleAddEditCustomerPopup, setVisibleAddEditCustomerPopup] =
    React.useState(false);
  const [isPayment, setIsPayment] = React.useState(false);
  const [isGetResponsePaymentPax, setIsGetResponsePaymentPax] =
    React.useState(false);
  const [moneyUserGiveForStaff, setMoneyUserGiveForStaff] = React.useState(0);
  const [isShowRefreshButton, setIsShowRefreshButton] = React.useState(false);

  const setSelectStaffFromCalendar = (staffId, isFirstPressCheckout = null) => {
    if (!staffId) return;
    dispatchLocal(CheckoutState.setSelectStaffFromCalendar(staffId));
    categoriesRef.current?.scrollFlatListToStaffIndex(
      staffId,
      isFirstPressCheckout
    );
  };

  const sendTransactionToPaymentMachine = () => {
    if (hardware.paymentMachineType == AppUtils.PaymentTerminalType.Clover) {
      setIsGetResponsePaymentPax(false);
      setVisibleProcessingCredit(true);
      const moneyCreditCard = Number(
        AppUtils.formatNumberFromCurrency(moneyUserGiveForStaff) * 100
      ).toFixed(2);
      const port = _.get(hardware.cloverMachineInfo, "port")
        ? _.get(hardware.cloverMachineInfo, "port")
        : 80;
      const url = `wss://${_.get(
        hardware.cloverMachineInfo,
        "ip"
      )}:${port}/remote_pay`;

      isProcessPaymentClover.current = true;
      // dispatch(actions.appointment.isProcessPaymentClover(true));

      setVisibleProcessingCredit(true);

      clover.sendTransaction({
        url,
        remoteAppId: AppUtils.REMOTE_APP_ID,
        appName: AppUtils.APP_NAME,
        posSerial: AppUtils.POS_SERIAL,
        token: _.get(hardware.cloverMachineInfo, "token")
          ? _.get(hardware.cloverMachineInfo, "token", "")
          : "",
        tipMode: isTipOnPaxMachine ? "ON_SCREEN_BEFORE_PAYMENT" : "NO_TIP",
        amount: `${parseFloat(moneyCreditCard)}`,
        externalId: `${appointment.payAppointmentId}`,
      });
    } else if (
      hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo
    ) {
      setVisibleProcessingCredit(true);
      setIsShowRefreshButton(false);
      const tenderType = "Credit";

      const parameter = {
        tenderType: tenderType,
        transType: "Sale",
        amount: Number(moneyUserGiveForStaff).toFixed(2),
        RefId: appointment.payAppointmentId,
        invNum: `${appointment.groupAppointment?.checkoutGroupId || 0}`,
      };
      AppUtils.requestTransactionDejavoo(parameter).then((responses) => {
        handleResponseCreditCardDejavoo(
          responses,
          true,
          moneyUserGiveForStaff,
          parameter
        );
      });
    } else {
      //send by Pax
      sendTransactionIOS();
    }
  };

  const handleResponseCreditCardDejavoo = async (
    message,
    online,
    moneyUserGiveForStaff,
    parameter
  ) => {
    try {
      parseString(message, (err, result) => {
        let errorCode = _.get(result, "xmp.response.0.ResultCode.0");
        if (
          err ||
          errorCode != 0 ||
          _.get(result, "xmp.response.0.Message.0") != "Approved"
        ) {
          if (
            errorCode == "999" &&
            appointment.groupAppointment?.checkoutGroupId ==
              lastGroupAppointmentPay?.checkoutGroupId
          ) {
            //time out
            const param = {
              RefId: appointment.payAppointmentId,
            };
            requestPreviousTransactionReportDejavoo(param).then((response) => {
              handleResponseCreditCardDejavoo(
                response,
                online,
                moneyUserGiveForStaff,
                parameter
              );
            });
          } else {
            let detailMessage = _.get(
              result,
              "xmp.response.0.RespMSG.0",
              ""
            ).replace(/%20/g, " ");
            detailMessage = !AppUtils.stringIsEmptyOrWhiteSpaces(detailMessage)
              ? `: ${detailMessage}`
              : detailMessage;

            const resultTxt =
              `${_.get(result, "xmp.response.0.Message.0")}${detailMessage}` ||
              "Transaction failed";

            if (errorCode == 2) {
              //Can not connect Dejavoo, show error without refresh button
              setIsShowRefreshButton(true);
            } else {
              //Show error with refresh button
              setIsShowRefreshButton(false);
            }

            setTimeout(() => {
              setVisibleErrorMessageFromPax(true);
              setVisibleProcessingCredit(false);
              setErrorMessageFromPax(resultTxt);
            }, 400);
          }
        } else {
          setVisibleProcessingCredit(false);
          const SN = _.get(result, "xmp.response.0.SN.0");
          if (!AppUtils.stringIsEmptyOrWhiteSpaces(SN)) {
            dispatch(actions.hardware.setDejavooMachineSN(SN));
          }

          dispatch(
            actions.appointment.submitPaymentWithCreditCard(
              dataLocal.profile?.merchantId || 0,
              message,
              appointment.payAppointmentId,
              moneyUserGiveForStaff,
              "dejavoo",
              parameter
            )
          );
        }
      });
    } catch (error) {}
  };

  const sendTransactionIOS = () => {
    setIsGetResponsePaymentPax(false);
    setVisibleProcessingCredit(true);
    const moneyCreditCard = Number(
      AppUtils.formatNumberFromCurrency(moneyUserGiveForStaff) * 100
    ).toFixed(2);
    const { ip, port, commType, bluetoothAddr } = hardware.paxMachineInfo;
    const tenderType = "CREDIT";
    const tempIpPax = commType == "TCP" ? ip : "";
    const tempPortPax = commType == "TCP" ? port : "";
    const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
    const extData = isTipOnPaxMachine
      ? "<TipRequest>1</TipRequest><Force>T</Force>"
      : "<Force>T</Force>";

    // Send Trans to pax
    PosLink.sendTransaction(
      {
        tenderType: tenderType,
        transType: "SALE",
        amount: `${parseFloat(moneyCreditCard)}`,
        transactionId: "1",
        extData: extData,
        commType: commType,
        destIp: tempIpPax,
        portDevice: tempPortPax,
        timeoutConnect: "90000",
        bluetoothAddr: idBluetooth,
        invNum: `${appointment.groupAppointment?.checkoutGroupId || 0}`,
      },
      (message) => {
        setIsGetResponsePaymentPax(true);
        _handleResponseCreditCard(message, true, moneyUserGiveForStaff);
      }
    );
  };

  // Functions
  const _handleResponseCreditCardForCloverSuccess = (message) => {
    setVisibleProcessingCredit(false);
    let messageUpdate = {
      ...message,
      sn: _.get(hardware.cloverMachineInfo, "serialNumber"),
    };
    try {
      dispatch(
        actions.appointment.submitPaymentWithCreditCard(
          dataLocal.profile?.merchantId || 0,
          JSON.stringify(messageUpdate),
          payAppointmentId.current,
          moneyUserGiveForStaffRef.current,
          "clover",
          null
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const _handleResponseCreditCardForCloverFailed = (errorMessage) => {
    setVisibleProcessingCredit(false);

    try {
      setTimeout(() => {
        setVisibleErrorMessageFromPax(true);
        setErrorMessageFromPax(errorMessage);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  const _addBlockAppointment = async (customService) => {
    const {
      categoryTypeSelected,
      productSeleted,
      arrSelectedExtra,
      customServiceSelected,
      selectedStaff,
    } = stateLocal || {};

    let isAppointmentIdOpen = "";

    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i]?.state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i]?.props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : appointment.isOpenBlockAppointmentId;

    if (categoryTypeSelected === "Product") {
      const tempItem = Helpers.createProductItemAddAppointment(
        productSeleted,
        amountRef.current?.state.quanlity
      );
      dispatch(
        actions.appointment.addItemIntoAppointment(
          tempItem,
          appointmentId,
          false,
          true
        )
      );
    } else {
      // ------------- Buy online Extra , Service ---------

      const temptExtra = [];
      for (let i = 0; i < arrSelectedExtra.length; i++) {
        temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
      }
      const tempItem = Helpers.createServiceItemAddAppointment(
        productSeleted ?? customServiceSelected ?? customService,
        selectedStaff?.staffId,
        temptExtra
      );
      dispatch(
        actions.appointment.addItemIntoAppointment(
          tempItem,
          appointmentId,
          false,
          true
        )
      );
    }

    dispatchLocal(CheckoutState.selectCategory(null)); // reset
  };

  const _createNewAppointment = async (basket) => {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      selectedStaff,
    } = stateLocal || {};

    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      Helpers.createItemAddBasket(basket, selectedStaff?.staffId);

    const moneyUserGiveForStaff = parseFloat(
      AppUtils.formatNumberFromCurrency(modalBillRef.current?.state.quality)
    );

    const method = Helpers.getPaymentString(paymentSelected);

    dispatch(
      actions.appointment.createAnymousAppointment(
        dataLocal.profile.merchantId,
        appointment.customerInfoBuyAppointment?.userId || 0,
        appointment.customerInfoBuyAppointment?.customerId || 0,
        // dataLocal.profileStaffLogin.staffId,
        selectedStaff?.staffId,
        arrayProductBuy,
        arryaServicesBuy,
        arrayExtrasBuy,
        method,
        true,
        customDiscountFixedLocal,
        customDiscountPercentLocal,
        appointment.customerInfoBuyAppointment?.firstName || "",
        appointment.customerInfoBuyAppointment?.lastName || "",
        appointment.customerInfoBuyAppointment?.phone || "",
        moneyUserGiveForStaff,
        false,
        false
      )
    );

    dispatchLocal(
      CheckoutState.setBasket({
        basket: [],
        customDiscountPercentLocal: 0,
        customDiscountFixedLocal: 0,
      })
    );

    // block change other tab when there are appointments
    homePageCtx.homePageDispatch(controllers.blockChangeTab());
  };

  const removeItemInBlockAppointment = (dataRemove) => {
    let isAppointmentIdOpen = "";
    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i]?.props?.appointmentDetail.appointmentId;
        break;
      }
    }
    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : appointment.blockAppointments[0].appointmentId;

    dispatch(
      actions.appointment.removeItemIntoAppointment(
        dataRemove,
        appointmentId,
        false,
        true
      )
    );
  };

  const _handlePaymentOffLineMode = () => {};
  const _setupSignalR = (
    profile,
    token,
    checkoutGroupId,
    deviceId,
    method,
    moneyUserGiveForStaff
  ) => {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${Configs.SOCKET_URL}notification/?merchantId=${dataLocal.profile.merchantId}&Title=Merchant&kind=app&dataLocal.deviceId=${dataLocal.deviceId}&dataLocal.token=${dataLocal.token}`,
          {
            transport:
              signalR.HttpTransportType.LongPolling |
              signalR.HttpTransportType.WebSockets,
          }
        )
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on("ListWaNotification", (data) => {
        const temptData = JSON.parse(data);
        if (
          temptData.data &&
          !_.isEmpty(temptData.data) &&
          temptData.data.isPaymentHarmony &&
          temptData.data.checkoutGroupId == checkoutGroupId
        ) {
          _handleHarmonyPayment(temptData.data.checkoutPayment);
          connection.stop();
        }
        // ---------- Handle reload Tip in Customer App ---------
        if (
          temptData.data &&
          !_.isEmpty(temptData.data) &&
          temptData.data.isTipAppointment
        ) {
          dispatch(
            actions.appointment.getGroupAppointmentById(
              temptData.data.appointmentId,
              false,
              false,
              true
            )
          );
        }
      });

      connection.onclose(async (error) => {
        dispatch(actions.appointment.resetConnectSignalR());
      });

      connection
        .start()
        .then(() => {
          dispatch(actions.app.stopLoadingApp());
          dispatch(actions.appointment.referenceConnectionSignalR(connection));
          dispatchLocal(CheckoutState.signalPayment());

          dispatch(
            actions.appointment.paymentAppointment(
              checkoutGroupId,
              method,
              moneyUserGiveForStaff
            )
          );
        })
        .catch((error) => {
          dispatch(actions.app.stopLoadingApp());
          setTimeout(() => {
            alert(error);
          }, 1000);
        });
    } catch (error) {
      dispatch(actions.app.stopLoadingApp());
      setTimeout(() => {
        alert(error);
      }, 1000);
    }
  };

  const _handleCreditCardProcess = (online = true, moneyUserGiveForStaff) => {
    const { paymentSelected, isCancelAppointment } = stateLocal;
    const { ip, port, timeout } = hardware.paxMachineInfo;
    const moneyCreditCard = Number(
      AppUtils.formatNumberFromCurrency(moneyUserGiveForStaff) * 100
    ).toFixed(2);
    const tenderType = paymentSelected === "Credit Card" ? "CREDIT" : "DEBIT";

    if (Platform.OS === "android") {
      // 1. Show modal processing

      setVisibleProcessingCredit(true);
      setTimeout(() => {
        PoslinkAndroid.sendTransaction(
          ip,
          port,
          "",
          tenderType,
          `${parseInt(moneyCreditCard)}`,
          "SALE",
          (err) => {
            const errorTrans = JSON.parse(err);
            setVisibleProcessingCredit(false);
            dispatchLocal(CheckoutState.changeButtonDone(false));
            setTimeout(() => {
              alert(errorTrans.Code);
            }, 500);
          },
          (data) => {
            _handleResponseCreditCard(
              data,
              online,
              moneyUserGiveForStaff,
              null
            );
          }
        );
      }, 100);
    } else {
      dispatch(
        actions.appointment.checkCreditPaymentToServer(
          appointment.groupAppointment?.checkoutGroupId || 0,
          moneyUserGiveForStaff,
          moneyCreditCard
        )
      );
    }
  };

  const _handleResponseCreditCard = (
    message,
    online,
    moneyUserGiveForStaff,
    parameter
  ) => {
    setVisibleProcessingCredit(false);
    try {
      const result = JSON.parse(message);
      const tempEnv = env.IS_PRODUCTION;

      if (_.get(result, "status", 0) == 0) {
        setTimeout(() => {
          setVisibleErrorMessageFromPax(true);
          setErrorMessageFromPax(result.message);
        }, 300);
      } else if (result.ResultCode && result.ResultCode == "000000") {
        if (tempEnv == "Production" && result.Message === "DEMO APPROVED") {
          if (appointment.payAppointmentId) {
            dispatch(
              actions.appointment.cancelHarmonyPayment(
                appointment.payAppointmentId
              )
            );
          }

          setVisibleProcessingCredit(false);
          setTimeout(() => {
            alert("You're running your Pax on DEMO MODE!");
          }, 1000);
        } else {
          dispatch(
            actions.appointment.submitPaymentWithCreditCard(
              dataLocal.profile?.merchantId || 0,
              message,
              appointment.payAppointmentId,
              moneyUserGiveForStaff,
              "pax",
              parameter
            )
          );
        }
      } else {
        const resultTxt = result?.ResultTxt || "Transaction failed:";

        setTimeout(() => {
          // alert(resultTxt);
          setVisibleErrorMessageFromPax(true);
          setErrorMessageFromPax(resultTxt);
        }, 300);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _handleDoneBill = (amountPayment = false) => {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      customerInfoByPhone,
    } = stateLocal;

    const moneyUserGiveForStaff =
      amountPayment !== false
        ? amountPayment
        : parseFloat(
            AppUtils.formatNumberFromCurrency(
              modalBillRef.current?.state.quality
            )
          );
    setMoneyUserGiveForStaff(moneyUserGiveForStaff);
    moneyUserGiveForStaffRef.current = moneyUserGiveForStaff;

    const method = Helpers.getPaymentString(paymentSelected);
    const total = appointment.groupAppointment?.total
      ? parseFloat(
          AppUtils.formatNumberFromCurrency(appointment.groupAppointment.total)
        )
      : 0;

    const dueAmount = appointment.paymentDetailInfo.dueAmount
      ? parseFloat(
          AppUtils.formatNumberFromCurrency(
            appointment.paymentDetailInfo.dueAmount
          )
        )
      : 0;
    if (network.isOfflineMode) {
      _handlePaymentOffLineMode();
      return;
    }

    if (
      moneyUserGiveForStaff == 0 &&
      appointment.groupAppointment &&
      total != 0
    ) {
      alert("Enter amount!");
    } else if (
      (method === "harmony" ||
        method === "credit_card" ||
        method === "debit_card") &&
      moneyUserGiveForStaff > dueAmount
    ) {
      alert("The change not bigger than total money!");
    } else {
      setVisibleBillOfPayment(false);

      modalBillRef.current?.setStateFromParent("0");
      if (!_.isEmpty(appointment.groupAppointment)) {
        if (method === "harmony") {
          dispatch(actions.app.loadingApp());
          _setupSignalR(
            dataLocal.profile,
            dataLocal.token,
            appointment.groupAppointment?.checkoutGroupId,
            dataLocal.deviceId,
            method,
            moneyUserGiveForStaff
          );
        } else if (method === "credit_card" || method === "debit_card") {
          let isSetup = false;
          if (hardware.paymentMachineType == AppUtils.PaymentTerminalType.Pax) {
            isSetup = _.get(hardware.paxMachineInfo, "isSetup");
          } else if (
            hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo
          ) {
            isSetup = _.get(hardware.dejavooMachineInfo, "isSetup");
          } else {
            isSetup = _.get(hardware.cloverMachineInfo, "isSetup");
          }
          if (isSetup) {
            if (moneyUserGiveForStaff == 0) {
              alert("Enter amount!");
            } else {
              _handleCreditCardProcess(true, moneyUserGiveForStaff);
            }
          } else {
            setTimeout(() => {
              alert("Please connect your Payment terminal to take payment.");
            }, 300);
          }
        } else if (method === "giftcard") {
          setTimeout(() => {
            alert("giftcard");
          }, 500);
        } else {
          dispatch(
            actions.appointment.paymentAppointment(
              appointment.groupAppointment?.checkoutGroupId,
              method,
              moneyUserGiveForStaff
            )
          );
        }
      } else {
        // ------ Handle Buy at store -------
        if (method === "credit_card" || method === "debit_card") {
          _handleCreditCardProcess(false, moneyUserGiveForStaff);
        } else if (method === "harmony") {
          popupSendLinkInstallRef.current?.setStateFromParent("");
          setVisibleSendLinkPopup(true);
        }
      }
    }
  };

  const _extractBill = () => {
    const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      stateLocal;

    if (_.isEmpty(appointment.paymentDetailInfo)) {
      if (network.isOfflineMode) {
        const temptTotal = Number(
          AppUtils.formatNumberFromCurrency(subTotalLocal) +
            AppUtils.formatNumberFromCurrency(tipLocal) +
            AppUtils.formatNumberFromCurrency(taxLocal) -
            AppUtils.formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2);
        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      } else {
        const temptTotal = _.isEmpty(appointment.groupAppointment)
          ? Number(
              AppUtils.formatNumberFromCurrency(subTotalLocal) +
                AppUtils.formatNumberFromCurrency(tipLocal) +
                AppUtils.formatNumberFromCurrency(taxLocal) -
                AppUtils.formatNumberFromCurrency(discountTotalLocal)
            ).toFixed(2)
          : appointment.groupAppointment?.total;
        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      }
    } else {
      const totalExact = appointment.paymentDetailInfo.dueAmount
        ? appointment.paymentDetailInfo.dueAmount
        : 0;
      modalBillRef.current?.setStateFromParent(`${totalExact}`);
    }
  };

  const _changeStylistBasketLocal = (serviceId, staffId, tip, price) => {
    const { basket } = stateLocal;
    // staff.productsByMerchantId
    if (staffId) {
      const temptStaff = AppUtils.getStaffInfoById(
        staff.productsByMerchantId,
        staffId
      );

      const temptBasket = basket.map((item, index) => {
        if (item.type === "Service" && item.data.serviceId === serviceId) {
          return {
            ...item,
            data: {
              ...item.data,
              price: price,
            },
            staff: {
              staffId: staffId,
              imageUrl: temptStaff?.imageUrl || "",
              displayName: temptStaff?.displayName || "",
              tip: tip,
            },
          };
        }
        return item;
      });

      let temptTip = 0;
      for (let i = 0; i < temptBasket.length; i++) {
        if (temptBasket[i].type === "Service") {
          if (temptBasket[i].staff && temptBasket[i].staff.tip) {
            temptTip =
              temptTip +
              AppUtils.formatNumberFromCurrency(temptBasket[i].staff.tip);
          }
        }
      }

      dispatchLocal(
        CheckoutState.updateBasket({
          basket: temptBasket,
          tipLocal: temptTip,
        })
      );
    }
  };

  const addAppointmentOfflineMode = (isHarmonyOffline = false) => {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      infoUser,
      tipLocal,
      subTotalLocal,
      taxLocal,
      discountTotalLocal,
      staffIdOfline,
      fromTime,
      basket,
      selectedStaff,
    } = stateLocal || {};

    let method = Helpers.getPaymentString(paymentSelected);
    const dataAnymousAppoitment = Helpers.getBasketOffline(
      basket,
      selectedStaff?.staffId
    );
    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      dataAnymousAppoitment;

    const appointmentOfflineMode = {
      appointmentId: appointment.appointmentIdOffline,
      firstName: infoUser.firstName,
      lastName: infoUser.lastName,
      phoneNumber: infoUser.phoneNumber,
      subTotal: subTotalLocal ? parseFloat(subTotalLocal) : 0,
      tax: taxLocal ? parseFloat(taxLocal) : 0,
      tipAmount: tipLocal ? parseFloat(tipLocal) : 0,
      discount: discountTotalLocal ? parseFloat(discountTotalLocal) : 0,
      merchantId: dataLocal.profile.merchantId,
      services: arryaServicesBuy,
      extras: arrayExtrasBuy,
      products: arrayProductBuy,
      fromTime:
        fromTime !== ""
          ? fromTime
          : AppUtils.formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
      staffId:
        staffIdOfline !== 0
          ? staffIdOfline
          : dataLocal.profileStaffLogin.staffId,
      customDiscountFixed: customDiscountPercentLocal,
      customDiscountPercent: customDiscountFixedLocal,
      paymentMethod: method,
      paymentTransactionId: 0,
    };

    if (isHarmonyOffline) {
      // this.setState({
      //   appointmentOfflineMode: appointmentOfflineMode,
      // });
    } else {
      dispatch(
        actions.dataLocal.addAppointmentOfflineMode(appointmentOfflineMode)
      );
    }
  };

  const _onRequestCloseBillModal = () => {
    dispatchLocal(CheckoutState.closeBillOfPayment());
    dispatch(actions.appointment.resetPayment());
    setVisibleBillOfPayment(false);
  };

  const _addGiftCardIntoBlockAppointment = (code) => {
    let isAppointmentIdOpen = "";
    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i]?.props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : appointment.isOpenBlockAppointmentId;

    dispatch(
      actions.appointment.addGiftCardIntoBlockAppointment(code, appointmentId)
    );
  };

  const _addAmount = async (customService) => {
    const {
      categoryTypeSelected,
      productSeleted,
      arrSelectedExtra,
      selectedStaff,
      customServiceSelected,
    } = stateLocal || {};

    // ------------ Block Booking -------------
    if (appointment.blockAppointments.length > 0) {
      _addBlockAppointment(customService);
      return;
    }

    // -------------  Group Appointment  ------------
    if (!_.isEmpty(appointment.groupAppointment)) {
      const appointments = appointment.groupAppointment?.appointments || [];
      const mainAppointmentId =
        appointment.groupAppointment?.mainAppointmentId || 0;
      let body = {};
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        body = Helpers.createProductItemAddAppointment(
          productSeleted,
          amountRef.current?.state.quanlity
        );
      } else {
        //  -------------Add Extra , Service ---------
        const mainAppointment = appointments.find(
          (appointment) => appointment.appointmentId === mainAppointmentId
        );
        const temptExtra = [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
        }

        body = Helpers.createServiceItemAddAppointment(
          productSeleted ?? customServiceSelected ?? customService,
          selectedStaff?.staffId,
          temptExtra
        );
      }

      if (appointments.length > 1) {
        popupAddItemIntoAppointmentsRef.current?.setStateFromParent(
          body,
          mainAppointmentId
        );
      } else {
        dispatch(
          actions.appointment.addItemIntoAppointment(
            body,
            mainAppointmentId,
            true
          )
        );
      }
    }
    // ------------- Create  Group Appointment  ------------
    else {
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        const temptBasket = [];
        temptBasket.unshift(
          Helpers.createProductItemAddBasket(
            productSeleted,
            amountRef?.current?.state.quanlity
          )
        );

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: Helpers.getPriceOfBasket(temptBasket),
            taxLocal: Helpers.getTotalTaxOfBasket(temptBasket, dataLocal),
          })
        );

        if (!network.isOfflineMode) {
          _createNewAppointment(temptBasket);
        }
      } else {
        //  -------------Add Extra , Service ---------
        const temptBasket = [];

        const staffInfo = {
          staffId: dataLocal.profileStaffLogin.staffId,
          imageUrl: dataLocal.profileStaffLogin.imageUrl,
          displayName: dataLocal.profileStaffLogin.displayName,
          tip: 0.0,
        };

        temptBasket.unshift(
          Helpers.createServiceItemAddBasket(
            productSeleted ?? customServiceSelected ?? customService,
            staffInfo
          )
        );

        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptBasket.unshift(
            Helpers.createExtraItemAddBasket(
              arrSelectedExtra[i],
              productSeleted?.name
            )
          );
        }

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: Helpers.getPriceOfBasket(temptBasket),
            taxLocal: Helpers.getTotalTaxOfBasket(temptBasket, dataLocal),
          })
        );

        if (!network.isOfflineMode) {
          _createNewAppointment(temptBasket);
        }
      }
    }

    dispatchLocal(CheckoutState.selectCategory(null)); // reset
  };

  const _cancelInvoicePrint = async (isPrintTempt) => {
    setVisiblePrintInvoice(false);
    if (!isPrintTempt) {
      setIsPayment(false);
      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
      dispatch(actions.appointment.resetBasketEmpty());
      dispatchLocal(CheckoutState.resetState());
      await homePageCtx.homePageDispatch(
        controllers.resetCheckOut(ScreenName.SALON.APPOINTMENT)
      );
    }
  };

  const _checkStatusCashier = () => {
    const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
      dataLocal.printerList,
      dataLocal.printerSelect
    );

    if (portName) {
      Helpers.openCashDrawer(portName);
    } else {
      if (hardware.paymentMachineType == AppUtils.PaymentTerminalType.Clover) {
        Helpers.openCashDrawerClover(hardware);
      } else {
        alert("Please connect to your cash drawer.");
      }
    }
  };

  const _cancelHarmonyPayment = () => {
    dispatchLocal(CheckoutState.resetPayment());
    if (appointment.payAppointmentId) {
      dispatch(
        actions.appointment.cancelHarmonyPayment(appointment.payAppointmentId)
      );
    }

    if (!_.isEmpty(appointment.connectionSignalR)) {
      appointment.connectionSignalR.stop();
    }
  };

  const _handleHarmonyPayment = (checkoutPaymentInfo) => {
    dispatchLocal(CheckoutState.changeButtonDone(false));
    const dueAmount =
      checkoutPaymentInfo && checkoutPaymentInfo.dueAmount
        ? parseFloat(checkoutPaymentInfo.dueAmount).toFixed(2)
        : 0;

    dispatch(
      actions.appointment.updatePaymentInfoByHarmonyPayment(checkoutPaymentInfo)
    );

    if (dueAmount === 0) {
      // ----- Transaction Completed --------
      dispatch(actions.appointment.completeTransaction());
    } else if (dueAmount < 0) {
      dispatch(actions.appointment.showPopupChangeMoney(dueAmount));
    } else {
      dispatch(actions.appointment.showPopupPaymentDetails());
    }
  };

  const _createABlockAppointment = () => {
    const { selectedStaff } = stateLocal || {};

    let fromTime = appointment.fromTimeBlockAppointment;
    if (
      appointment.blockAppointments &&
      appointment.blockAppointments.length > 0
    ) {
      fromTime = _.get(appointment.blockAppointments, "0.fromTime")
        ? moment(_.get(appointment.blockAppointments, "0.fromTime"))
            .local()
            .format()
        : new Date();
    }

    const firstAppointment = appointment.blockAppointments[0];

    if (
      firstAppointment &&
      firstAppointment.status &&
      firstAppointment.status === "waiting"
    ) {
      dispatch(
        actions.appointment.createAppointmentWaiting(
          dataLocal.profile.merchantId,
          fromTime,
          appointment.customerInfoBuyAppointment?.userId || 0,
          appointment.customerInfoBuyAppointment?.customerId || 0,
          appointment.customerInfoBuyAppointment?.firstName || "",
          appointment.customerInfoBuyAppointment?.lastName || "",
          appointment.customerInfoBuyAppointment?.phone || "",
          appointment.bookingGroupId,
          selectedStaff?.staffId ?? 0
        )
      );
    } else {
      dispatch(
        actions.appointment.createBlockAppointment(
          dataLocal.profile.merchantId,
          fromTime,
          appointment.customerInfoBuyAppointment?.userId || 0,
          appointment.customerInfoBuyAppointment?.customerId || 0,
          appointment.customerInfoBuyAppointment?.firstName || "",
          appointment.customerInfoBuyAppointment?.lastName || "",
          appointment.customerInfoBuyAppointment?.phone || "",
          appointment.bookingGroupId,
          selectedStaff?.staffId ?? 0
        )
      );
    }

    // block change other tab when there are appointments
    homePageCtx.homePageDispatch(controllers.blockChangeTab());
  };

  const titleExitCheckoutTab = React.useMemo(() => {
    const {
      groupAppointment,
      appointmentIdBookingFromCalendar,
      isCancelAppointment,
    } = appointment || {};

    let app0 = null;
    if (groupAppointment && groupAppointment?.appointments?.length > 0) {
      app0 = groupAppointment?.appointments[0];
    }

    return (isCancelAppointment &&
      app0 &&
      app0.services.length + app0.products.length + app0.giftCards.length ===
        0) ||
      (isBookingFromCalendar &&
        appointmentIdBookingFromCalendar &&
        app0 &&
        app0.services.length + app0.products.length + app0.giftCards.length ===
          0) ||
      (!isBookingFromCalendar &&
        appointmentIdBookingFromCalendar == 0 &&
        app0 &&
        app0.services.length + app0.products.length + app0.giftCards.length ===
          0)
      ? "The appointment will be canceled if you do not complete your payment. Are you sure you want to exit Check-out? "
      : "Are you sure you want to exit Check-Out?";
  }, [appointment, isBookingFromCalendar]);

  const _onHandleGoBack = () => {
    homePageCtx.homePageDispatch(controllers.showPopupConfirmCancelCheckout());
  };

  React.useEffect(() => {
    if (appointment.startProcessingPax) {
      dispatch(actions.appointment.resetStateCheckCreditPaymentToServer(false));
      sendTransactionToPaymentMachine();
    }
  }, [appointment.startProcessingPax]);

  React.useEffect(() => {
    if (appointment.isCreditPaymentToServer) {
      setTimeout(() => {
        setVisibleErrorMessageFromPax(true);
        setVisibleProcessingCredit(false);
        setErrorMessageFromPax(errorMessage);
      }, 400);
    }
  }, [isCreditPaymentToServer]);

  React.useEffect(() => {
    payAppointmentId.current = appointment.payAppointmentId;
  }, [appointment.payAppointmentId]);

  React.useEffect(() => {
    const { blockAppointments, isLoadingRemoveBlockAppointment } =
      appointment || {};
    if (blockAppointments.length > 0) {
      updateBlockAppointmentRef();
    }
  }, [
    appointment?.blockAppointments,
    appointment.isLoadingRemoveBlockAppointment,
  ]);

  React.useEffect(() => {
    clover.changeListenerStatus(true);
    subscriptions.current = [
      eventEmitter.current.addListener("paymentSuccess", (data) => {
        isProcessPaymentClover.current = false;
        _handleResponseCreditCardForCloverSuccess(data);
      }),
      eventEmitter.current.addListener("paymentFail", (data) => {
        isProcessPaymentClover.current = false;
        _handleResponseCreditCardForCloverFailed(_.get(data, "errorMessage"));
      }),
      eventEmitter.current.addListener("pairingCode", (data) => {
        if (data) {
          if (isProcessPaymentClover.current) {
            setVisibleProcessingCredit(false);
          }
          if (isProcessPrintClover.current) {
            setVisiblePrintInvoice(false);
          }
        }
      }),
      eventEmitter.current.addListener("pairingSuccess", (data) => {
        if (isProcessPaymentClover.current) {
          setVisibleProcessingCredit(true);
        }
      }),
      eventEmitter.current.addListener("confirmPayment", () => {
        setVisibleProcessingCredit(false);
        setVisibleConfirmPayment(true);
      }),
      eventEmitter.current.addListener("printInProcess", () => {}),

      eventEmitter.current.addListener("deviceDisconnected", () => {
        if (isProcessPaymentClover.current) {
          isProcessPaymentClover.current = false;
          _handleResponseCreditCardForCloverFailed("No connected device");
          clover.cancelTransaction();
        }
        if (isProcessPrintClover.current) {
          isProcessPrintClover.current = false;
          setVisiblePrintInvoice(false);
        }
      }),
    ];

    return () => {
      if (subscriptions.current?.length > 0) {
        subscriptions.current.forEach((e) => e.remove());
      }
      subscriptions.current = [];
    };
  }, []);

  return {
    categoriesRef,
    amountRef,
    popupDiscountRef,
    popupDiscountLocalRef,
    changeTipRef,
    popupCheckDiscountPermissionRef,
    isLoadingService: apis.isGetServiceByStaff || apis.isGetProductByStaff,
    isBookingFromCalendar,
    ...dataLocal,
    ...category,
    ...network,
    ...service, //  services
    ...product, // products
    ...extra, // extras
    // loginStaff: dataLocal.profileStaffLogin,
    isPayment, // show tab categories or payment
    ...appointment,
    ...stateLocal,
    // apis
    ...apis,
    titleExitCheckoutTab,
    onHandleGoBack: _onHandleGoBack,

    setSelectStaffFromCalendar,
    setBlockStateFromCalendar: (bl) => {
      dispatchLocal(CheckoutState.setBlockStateFromCalendar(bl));
    },
    // Customer
    displayCustomerInfoPopup: () => {
      const customerId =
        appointment.customerInfoBuyAppointment?.customerId || 0;
      dispatch(actions.customer.getCustomerInfoById(customerId, true));
    },

    displayEnterUserPhonePopup: () => {
      const { firstName, lastName, phone } =
        appointment.customerInfoBuyAppointment || {};
      popupCustomerInfoRef.current?.setStateFromParent(
        firstName,
        lastName,
        phone
      );
      dispatch(actions.appointment.switchVisibleEnterCustomerPhonePopup(true));
    },

    addAppointmentCheckout: () => {
      if (appointment.blockAppointments?.length > 0) {
        _createABlockAppointment();
        return;
      }

      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
    },
    cancelHarmonyPayment: _cancelHarmonyPayment,
    payBasket: () => {
      const { paymentSelected } = stateLocal || {};
      const method = Helpers.getPaymentString(paymentSelected);
      if (network.isOfflineMode && method === "harmony") {
        NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
        setIsPayment(true);
        addAppointmentOfflineMode(true);
      } else if (
        network.isOfflineMode &&
        (method === "credit_card" || method === "debit_card")
      ) {
        alert("Not Support Offline Mode");
      } else if (
        method === "harmony" &&
        _.isEmpty(appointment.groupAppointment)
      ) {
        popupSendLinkInstallRef.current?.setStateFromParent("");
        setVisibleSendLinkPopup(true);
      } else {
        if (method === "harmony" || method === "credit_card") {
          const dueAmount = appointment.paymentDetailInfo?.dueAmount || 0;
          modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
        }

        setVisibleBillOfPayment(true);
      }
    },
    confimPayOfflinemode: () => {
      setVisibleScanCode(true);
    },
    bookAppointmentFromCalendar: () => {
      // this.setState(
      //   Object.assign(initState, {
      //     isBookingFromAppointmentTab: true, // book appointment from calendar
      //   })
      // );
      // this.props.actions.appointment.resetGroupAppointment();

      NavigatorServices.goBack();
      dispatchLocal(CheckoutState.resetState());
      blockAppointmentRef.length = 0; // clean refs
      dispatch(actions.appointment.resetGroupAppointment());
      homePageCtx.homePageDispatch(controllers.unBlockChangeTab());
    },
    selectPayment: () => {
      setIsPayment(true);
    },
    selectedPayment: async (payment) => {
      const { paymentSelected, changeButtonDone } = stateLocal;
      if (
        changeButtonDone &&
        !appointment.isDonePayment &&
        paymentSelected === "HarmonyPay"
      ) {
      } else {
        await dispatchLocal(CheckoutState.setPayment(payment));
        if (paymentSelected === "Gift Card") {
          activeGiftCardRef.current?.setStateFromParent();
          dispatch(actions.appointment.handleVisibleActiveGiftCard());
        }
      }
    },
    bookBlockAppointment: () => {
      NavigatorServices.goBack();
      dispatch(actions.appointment.bookBlockAppointment());
      dispatchLocal(CheckoutState.resetState());
      blockAppointmentRef.length = 0; // clean refs
      dispatch(actions.appointment.resetGroupAppointment());
      homePageCtx.homePageDispatch(controllers.unBlockChangeTab());
    },
    checkBlockAppointment: Helpers.isBookingBlockAppointment,
    onSelectGiftCard: (category) => {
      const { categorySelected } = stateLocal;
      if (categorySelected?.categoryId !== category?.categoryId) {
        dispatchLocal(CheckoutState.selectGiftCard(category));
        activeGiftCardRef.current?.setStateFromParent();
        dispatch(actions.appointment.handleVisibleActiveGiftCard());
      } else {
        // reset về categories column
        dispatchLocal(CheckoutState.selectCategory(null));
      }
    },
    displayCategoriesColumn: (staff) => {
      if (!network.isOfflineMode) {
        apis.getCategoriesByStaff(staff.staffId);
      }
      dispatchLocal(CheckoutState.selectStaff(staff));
    },
    onPressSelectCategory: (category) => {
      if (_.isNil(category) || _.isEmpty(category)) return;

      const { categorySelected, isBlockBookingFromCalendar, selectedStaff } =
        stateLocal;
      const { categoryId, categoryType } = category;
      if (categorySelected?.categoryId !== categoryId) {
        if (!network.isOfflineMode && !isBlockBookingFromCalendar) {
          if (categoryType?.toString().toLowerCase() === "service") {
            apis.getServiceByStaff({
              categoryId,
              staffId: selectedStaff?.staffId,
            });
          } else if (categoryType?.toString().toLowerCase() === "product") {
            apis.getProductByStaff(categoryId);
          }
        }
        dispatchLocal(CheckoutState.selectCategory(category));
      } else {
        dispatchLocal(CheckoutState.selectCategory(null));
      }
    },
    showCustomServiceAmount: (itemService) => {
      const { selectedStaff } = stateLocal || {};
      // reset to select categories
      dispatchLocal(CheckoutState.selectCategoryItem(null, false));

      popupEnterAmountCustomServiceRef.current?.showPopup(
        selectedStaff,
        itemService
      );
    },
    showColAmount: (item) => {
      const { categorySelected, productSeleted } = stateLocal || {};
      const categoryType = categorySelected?.categoryType;
      let isExist = false;

      if (
        categoryType === "Service" &&
        productSeleted?.serviceId == item?.serviceId
      ) {
        isExist = true;
      } else if (
        categoryType === "Product" &&
        productSeleted?.productId == item?.productId
      ) {
        isExist = true;
      }

      dispatchLocal(CheckoutState.selectCategoryItem(item, isExist));
    },
    getExtrasFromRedux: (product) => {
      const extrasBySort = [];

      for (let i = 0; i < extra.extrasByMerchant.length; i++) {
        for (let j = 0; j < product?.extras?.length; j++) {
          const extraLocal = product?.extras[j];
          const extralGlobal = extra.extrasByMerchant[i];
          if (
            extralGlobal.extraId === extraLocal.extraId &&
            extralGlobal.isDisabled === 0
          ) {
            extrasBySort.push(extralGlobal);
            break;
          }
        }
      }

      return extrasBySort;
    },
    onPressSelectExtra: (extra) => {
      const { arrSelectedExtra } = stateLocal || {};

      let tempArrSelectedExtra;
      let isExist = false;
      for (let i = 0; i < arrSelectedExtra?.length; i++) {
        if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
          isExist = true;
          break;
        }
      }
      if (isExist) {
        tempArrSelectedExtra = arrSelectedExtra.filter(
          (selectedExtra) => selectedExtra?.extraId !== extra?.extraId
        );
      } else {
        tempArrSelectedExtra = [...arrSelectedExtra];
        tempArrSelectedExtra.push(extra);
      }

      dispatchLocal(CheckoutState.selectExtraItem(tempArrSelectedExtra));
    },
    //  func add service/product/extra items to basket
    addAmount: _addAmount,
    removeItemBasket: (item, appointmentId = -1, isGroup = false) => {
      const { basket } = stateLocal || {};

      if (appointmentId !== -1) {
        // ----- Remove With Appointmnet
        let dataRemove = {};
        switch (item.type) {
          case "Product":
            dataRemove = {
              services: [],
              extras: [],
              products: [{ bookingProductId: item.data.bookingProductId }],
            };
            break;
          case "Service":
            dataRemove = {
              services: [{ bookingServiceId: item.data.bookingServiceId }],
              extras: [],
              products: [],
            };
            break;
          case "Extra":
            dataRemove = {
              services: [],
              extras: [{ bookingExtraId: item.data.bookingExtraId }],
              products: [],
            };
            break;
          case "GiftCards":
            dataRemove = {
              services: [],
              extras: [{ bookingExtraId: item.data.bookingExtraId }],
              products: [],
              giftCards: [{ bookingGiftCardId: item.data.bookingGiftCardId }],
            };
            break;
        }
        if (appointment.blockAppointments.length > 0) {
          removeItemInBlockAppointment(dataRemove);
        } else {
          dispatch(
            actions.appointment.removeItemIntoAppointment(
              dataRemove,
              appointmentId,
              isGroup
            )
          );
        }
      } else {
        // -------- Remove Offline --------
        const temptBasket = basket.filter(
          (itemBasket) => itemBasket.id !== item.id
        );

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: Helpers.getPriceOfBasket(temptBasket),
            taxLocal: Helpers.getTotalTaxOfBasket(temptBasket, dataLocal),
          })
        );
      }
    },
    changeStylist: async (service, appointmentId) => {
      const { fromTime = new Date() } =
        appointment.groupAppointment?.appointments?.find(
          (appointment) => appointment.appointmentId === appointmentId
        ) || {};

      changeStylistRef.current?.setStateFromParent(service, appointmentId);

      if (!network.isOfflineMode) {
        dispatch(
          actions.staff.getStaffService(
            service?.data?.serviceId,
            AppUtils.formatWithMoment(fromTime, "MM/DD/YYYY"), // Fix for case custom service not contains by staff, so get staff no data here!
            callBackGetStaffService
          )
        );
      } else {
        // this.setState({ visibleChangeStylist: true });
      }
    },
    toggleCollapses: (appointmentIdSelection) => {
      for (let i = 0; i < blockAppointmentRef.length; i++) {
        const appointmentDetail =
          blockAppointmentRef[i]?.props.appointmentDetail;
        if (
          appointment.appointmentDetail &&
          appointment.appointmentDetail.appointmentId === appointmentIdSelection
        ) {
          dispatch(
            actions.appointment.updateIdBlockAppointmentOpen(
              appointment.appointmentDetail.appointmentId
            )
          );
          blockAppointmentRef[i]?.setStateFromParent(false);
        } else {
          blockAppointmentRef[i]?.setStateFromParent(true);
        }
      }
    },
    changeProduct: (product, appointmentId) => {
      changePriceAmountProductRef.current?.setStateFromParent(
        product,
        appointmentId
      );

      dispatchLocal(CheckoutState.visibleEditProductForm(true));
    },
    removeBlockAppointment: (appointmentId) => {
      const customerId = appointment.customerInfoBuyAppointment.customerId
        ? appointment.customerInfoBuyAppointment.customerId
        : 0;

      dispatch(
        actions.appointment.cancleAppointment(
          appointmentId,
          dataLocal.profile.merchantId,
          customerId,
          true,
          false
        )
      );
    },
    createABlockAppointment: _createABlockAppointment,
    addBlockAppointment: _addBlockAppointment,
    onRequestClosePopupDiscountLocal: async () => {
      dispatchLocal(CheckoutState.visiblePopupDiscountLocal(false)); // reset
    },
    showModalDiscount: (appointmentId) => {
      if (_.isEmpty(appointment.connectionSignalR)) {
        const {
          subTotalLocal,
          discountTotalLocal,
          customDiscountPercentLocal,
          customDiscountFixedLocal,
        } = stateLocal || {};

        if (appointmentId !== -1) {
          const { services, products, extras, giftCards } =
            appointment.groupAppointment?.appointments?.find(
              (appointment) => appointment.appointmentId === appointmentId
            ) || {};

          const arrayProducts =
            AppUtils.getArrayProductsFromAppointment(products);
          const arryaServices =
            AppUtils.getArrayServicesFromAppointment(services);
          const arrayExtras = AppUtils.getArrayExtrasFromAppointment(extras);
          const arrayGiftCards =
            AppUtils.getArrayGiftCardsFromAppointment(giftCards);
          const temptBasket = arrayProducts.concat(
            arryaServices,
            arrayExtras,
            arrayGiftCards
          );

          if (temptBasket.length > 0) {
            dispatch(
              actions.marketing.getPromotionByAppointment(appointmentId)
            );
          }
        } else {
          popupDiscountLocalRef.current?.setStateFromParent(
            subTotalLocal,
            discountTotalLocal,
            customDiscountPercentLocal,
            customDiscountFixedLocal
          );

          dispatchLocal(CheckoutState.visiblePopupDiscountLocal(true)); // reset
        }
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    showModalTipAppointment: (appointmentId, tip, subTotal, tipPercent) => {
      if (_.isEmpty(appointment.connectionSignalR)) {
        changeTipRef.current?.setStateFromParent(
          appointmentId,
          tip,
          subTotal,
          tipPercent
        );
        // dispatchLocal(CheckoutState.visibleChangeTip(true));
        setVisibleChangeTip(true);
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    showModalCheckPermission: (appointmentId, isBlock) => {
      popupCheckDiscountPermissionRef?.current?.setStateFromParent(
        "",
        appointmentId,
        isBlock
      );
      dispatch(actions.marketing.switchPopupCheckDiscountPermission(true));
    },

    // Popup
    changeStylistBasketLocal: _changeStylistBasketLocal,

    // PopupConfirm
    visibleConfirm: homePageCtx.visiblePopupConfirmCancelCheckout,
    closePopupConfirm: () => {
      // setVisibleConfirm(false);
      homePageCtx.homePageDispatch(
        controllers.hidePopupConfirmCancelCheckout()
      );
    },
    clearDataConfirm: async () => {
      const { isDrawer } = stateLocal;

      if (!_.isEmpty(appointment.connectionSignalR)) {
        appointment.connectionSignalR.stop();
      }

      if (appointment.payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(appointment.payAppointmentId)
        );
      }

      homePageCtx.homePageDispatch(controllers.unBlockChangeTab());

      // reset local state
      dispatchLocal(CheckoutState.resetState());

      // reset page
      setIsPayment(false);

      // reset basket
      dispatch(actions.appointment.resetBasketEmpty());
      dispatch(actions.appointment.resetPayment());
      dispatch(actions.appointment.changeFlagSigninAppointment());
      dispatch(actions.appointment.resetGroupAppointment());

      if (appointment.isCancelAppointment) {
        const app =
          appointment.groupAppointment?.appointments?.length > 0
            ? appointment.groupAppointment.appointments[0]
            : null;

        // Cancel appointment
        if (
          app &&
          appointment.groupAppointment?.appointments &&
          appointment.groupAppointment?.appointments.length === 1
        ) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const mainAppointmentId = appointment.groupAppointment
              ?.mainAppointmentId
              ? appointment.groupAppointment.mainAppointmentId
              : 0;
            const customerId = appointment.customerInfoBuyAppointment.customerId
              ? appointment.customerInfoBuyAppointment.customerId
              : 0;
            dispatch(
              actions.appointment.cancleAppointment(
                mainAppointmentId,
                dataLocal.profile.merchantId,
                customerId
              )
            );
          }
        }

        // Book from calendar
      }

      if (isBookingFromCalendar) {
        if (appointment.blockAppointments?.length > 0) {
          const app =
            appointment.blockAppointments?.length > 0
              ? appointment.blockAppointments[0]
              : null;
          if (
            app &&
            appointment.blockAppointments &&
            appointment.blockAppointments?.length === 1
          ) {
            if (
              app.services.length +
                app.products.length +
                app.giftCards.length ===
              0
            ) {
              const customerId = appointment.customerInfoBuyAppointment
                .customerId
                ? appointment.customerInfoBuyAppointment.customerId
                : 0;
              dispatch(
                actions.appointment.cancleAppointment(
                  appointment.isOpenBlockAppointmentId,
                  dataLocal.profile.merchantId,
                  customerId
                )
              );
            }
          }
        }

        if (
          appointment.groupAppointment?.appointments?.length > 0 &&
          appointment.appointmentIdBookingFromCalendar
        ) {
          const app =
            appointment.groupAppointment?.appointments?.length > 0
              ? appointment.groupAppointment.appointments[0]
              : null;

          const mainAppointmentId = appointment.groupAppointment
            ?.mainAppointmentId
            ? appointment.groupAppointment.mainAppointmentId
            : 0;

          if (
            app &&
            appointment.groupAppointment?.appointments &&
            appointment.groupAppointment?.appointments.length === 1
          ) {
            if (
              app.services.length +
                app.products.length +
                app.giftCards.length ===
              0
            ) {
              const customerId = appointment.customerInfoBuyAppointment
                .customerId
                ? appointment.customerInfoBuyAppointment.customerId
                : 0;

              dispatch(
                actions.appointment.cancleAppointment(
                  appointment.appointmentIdBookingFromCalendar,
                  dataLocal.profile.merchantId,
                  customerId
                )
              );
            }
          }
        }
      }

      if (
        !isBookingFromCalendar &&
        appointment.appointmentIdBookingFromCalendar == 0
      ) {
        const app =
          appointment.groupAppointment?.appointments?.length > 0
            ? appointment.groupAppointment.appointments[0]
            : null;

        if (
          app &&
          appointment.groupAppointment?.appointments &&
          appointment.groupAppointment?.appointments.length === 1
        ) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const mainAppointmentId = appointment.groupAppointment
              ?.mainAppointmentId
              ? appointment.groupAppointment.mainAppointmentId
              : 0;
            const customerId = appointment.customerInfoBuyAppointment.customerId
              ? appointment.customerInfoBuyAppointment.customerId
              : 0;

            dispatch(
              actions.appointment.cancleAppointment(
                mainAppointmentId,
                dataLocal.profile.merchantId,
                customerId
              )
            );
          }
        }
      }

      if (appointment.isOpenBlockAppointmentId) {
        const app =
          appointment.blockAppointments?.length > 0
            ? appointment.blockAppointments[0]
            : null;

        if (
          app &&
          appointment.blockAppointments &&
          appointment.blockAppointments?.length === 1
        ) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const customerId = appointment.customerInfoBuyAppointment.customerId
              ? appointment.customerInfoBuyAppointment.customerId
              : 0;

            dispatch(
              actions.appointment.cancleAppointment(
                appointment.isOpenBlockAppointmentId,
                dataLocal.profile.merchantId,
                customerId
              )
            );
          }
        }
      }

      blockAppointmentRef.length = 0; // clean refs
    },

    //Popup Payment   Confirm
    visibleConfirmPayment,
    closePopupPaymentConfirm: () => {
      setVisibleConfirmPayment(false);
    },
    confirmPaymentClover: () => {
      clover.confirmPayment();
      setVisibleProcessingCredit(true);
      setVisibleConfirmPayment(false);
    },
    rejectPaymentClover: () => {
      clover.rejectPayment();
      setVisibleConfirmPayment(false);
    },

    // Popup Error Message
    visibleErrorMessageFromPax,

    // PopupChangeMoney
    cashBackRef,
    visibleChangeMoney,
    closePopupChangeMoney: () => {
      setVisibleChangeMoney(false);
    },
    doneBillByCash: () => {},

    // PopupChangeStylist
    changeStylistRef,
    visibleChangeStylist,
    closePopupChangeStylist: () => {
      setVisibleChangeStylist(false);
    },

    // PopupChangePriceAmountProduct
    changePriceAmountProductRef,
    visibleChangePriceAmountProduct,
    closePopupChangePriceAmountProduct: () => {
      setVisibleChangePriceAmountProduct(false);
    },
    changeProductBasketLocal: (productIdLocal, price, quantity) => {},

    // PopupChangeTip
    changeTipRef,
    visibleChangeTip,
    closePopupChangeTip: () => {
      setVisibleChangeTip(false);
    },

    // DialogPayCompleted
    printBill: async () => {
      // this.pushAppointmentIdOfflineIntoWebview();

      const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
        dataLocal.printerList,
        dataLocal.printerSelect
      );
      const { paymentSelected } = stateLocal;
      if (!_.isEmpty(appointment.connectionSignalR)) {
        appointment.connectionSignalR.stop();
      }

      dispatch(actions.appointment.closeModalPaymentCompleted());
    },
    donotPrintBill: async () => {
      // this.props.pushAppointmentIdOfflineIntoWebview();
      const { paymentSelected } = stateLocal;

      if (!_.isEmpty(appointment.connectionSignalR)) {
        appointment.connectionSignalR.stop();
      }

      if (paymentSelected === "Cash" || paymentSelected === "Other") {
        const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
          dataLocal.printerList,
          dataLocal.printerSelect
        );

        if (portName) {
          if (
            (paymentSelected === "Other" && dataLocal.profile?.isOpenCashier) ||
            paymentSelected === "Cash"
          ) {
            Helpers.openCashDrawer(portName);
          }
          setIsPayment(false);
          dispatch(actions.appointment.closeModalPaymentCompleted());
          NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
          dispatch(actions.appointment.resetBasketEmpty());
          dispatchLocal(CheckoutState.resetState());
          dispatch(actions.appointment.resetPayment());
        } else {
          if (
            (paymentSelected === "Other" && dataLocal.profile?.isOpenCashier) ||
            paymentSelected === "Cash"
          ) {
            if (
              hardware.paymentMachineType == AppUtils.PaymentTerminalType.Clover
            ) {
              Helpers.openCashDrawerClover(hardware);
            } else {
              setTimeout(() => {
                alert("Please connect to your cash drawer.");
              }, 700);
            }
          }

          setIsPayment(false);
          dispatch(actions.appointment.closeModalPaymentCompleted());
          NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
          dispatch(actions.appointment.resetBasketEmpty());
          dispatchLocal(CheckoutState.resetState());
          dispatch(actions.appointment.resetPayment());
        }
      } else {
        setIsPayment(false);
        dispatch(actions.appointment.closeModalPaymentCompleted());
        NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
        dispatch(actions.appointment.resetBasketEmpty());
        dispatchLocal(CheckoutState.resetState());
        dispatch(actions.appointment.resetPayment());
      }

      await homePageCtx.homePageDispatch(
        controllers.resetCheckOut(ScreenName.SALON.APPOINTMENT)
      );
    },
    cancelInvoicePrint: _cancelInvoicePrint,
    mainAppointmentId: appointment.groupAppointment?.mainAppointmentId || 0,

    // PopupProcessingCredit
    visibleProcessingCredit,
    cancelTransaction: () => {
      if (Platform.OS === "android") {
        PoslinkAndroid.cancelTransaction((data) => {});
      } else {
        if (hardware.paymentMachineType == "Clover") {
          if (isProcessPrintClover.current) {
            alert(i18n.t("PleaseWait"));
            return;
          }
        } else if (
          hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo
        ) {
          //Dejavoo can not cancel transaction by api
          alert(i18n.t("PleaseWait"));
          return;
        } else {
          if (!isGetResponsePaymentPax.current) {
            alert(i18n.t("PleaseWait", language));
            return;
          }
          PosLink.cancelTransaction();
        }

        if (appointment.payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              appointment.payAppointmentId
            )
          );
        }
        setVisibleProcessingCredit(false);
        dispatchLocal(CheckoutState.changeButtonDone(false));
      }
    },

    // PopupBill
    modalBillRef,
    visibleBillOfPayment,
    onRequestCloseBillModal: _onRequestCloseBillModal,

    // PopupEnterAmountGiftCard
    popupEnterAmountGiftCardRef,
    onRequestCloseBillModal: _onRequestCloseBillModal,

    extractBill: _extractBill,
    doneBill: _handleDoneBill,

    // PopupSendLinkInstall
    popupSendLinkInstallRef,
    visibleSendLinkPopup,
    closePopupSendLinkInstall: () => {
      setVisibleSendLinkPopup(false);
    },
    sendLinkInstallApp: () => {
      const phone = popupSendLinkInstallRef.current?.state.value;
      const codeAreaPhone =
        popupSendLinkInstallRef.current?.state.codeAreaPhone;
      if (phone.length > 6) {
        setVisibleSendLinkPopup(false);
        dispatch(actions.app.sendLinkInstallApp(`${codeAreaPhone}${phone}`));
      } else {
        alert("Phone is invalid !");
      }
    },

    // PopupActiveGiftCard
    activeGiftCardRef,
    closePopupActiveGiftCard: () => {
      dispatch(actions.appointment.handleVisibleActiveGiftCard(false));
      dispatchLocal(CheckoutState.selectCategory(null));
    },
    submitSerialCode: (code) => {
      const {
        paymentSelected,
        customDiscountPercentLocal,
        customDiscountFixedLocal,
      } = stateLocal;

      if (appointment.blockAppointments?.length > 0) {
        _addGiftCardIntoBlockAppointment(code);
        return;
      }

      if (!_.isEmpty(appointment.groupAppointment)) {
        if (paymentSelected === "Gift Card") {
          dispatch(
            actions.appointment.checkSerialNumber(code, false, false, true)
          );
        } else {
          dispatch(actions.appointment.checkSerialNumber(code));
        }
      } else {
        const moneyUserGiveForStaff = parseFloat(
          AppUtils.formatNumberFromCurrency(modalBillRef.current?.state.quality)
        );
        const method = Helpers.getPaymentString(paymentSelected);
        const bodyAction = {
          merchantId: dataLocal.profile.merchantId,
          userId: appointment.customerInfoBuyAppointment?.userId || 0,
          status: "checkin",
          services: [],
          extras: [],
          products: [],
          fromTime: AppUtils.formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
          staffId: dataLocal.profileStaffLogin?.staffId || 0,
          customDiscountFixed: customDiscountFixedLocal,
          customDiscountPercent: customDiscountPercentLocal,
          firstName: appointment.customerInfoBuyAppointment?.firstName || "",
          lastName: appointment.customerInfoBuyAppointment?.lastName || "",
          phoneNumber: appointment.customerInfoBuyAppointment?.phone || "",
          customerId: appointment.customerInfoBuyAppointment?.customerId || 0,
        };
        const optionAction = {
          method: "POST",
          token: true,
          api: `${Configs.API_URL}appointment`,
          paymentMethod: method,
          isLoading: true,
          paidAmount: moneyUserGiveForStaff,
          creditCardInfo: false,
          merchantId: dataLocal.profile.merchantId,
          isPayment: false,
        };

        dispatch(
          actions.appointment.checkSerialNumber(code, bodyAction, optionAction)
        );

        dispatchLocal(CheckoutState.selectCategory(null));
      }
    },

    // PopupPaymentDetails
    visiblePopupPaymentDetails,
    closePopupProductPaymentDetails: () => {
      setVisiblePopupPaymentDetails(false);
    },
    nextPayment: () => {
      setVisiblePopupPaymentDetails(false);
    },

    // PopupScanCode
    visibleScanCode,
    onRequestCloseScanCode: () => {
      setVisibleScanCode(false);
    },
    resultScanCode: (e) => {
      setVisibleScanCode(false);
      const { appointmentOfflineMode } = stateLocal;
      const tempDate = {
        ...appointmentOfflineMode,
        paymentTransactionId: e.data,
      };
      dispatch(actions.dataLocal.addAppointmentOfflineMode(tempDate));
      dispatch(actions.appointment.showModalPrintReceipt());
    },

    // PopupInvoicePrint
    invoicePrintRef,
    visiblePrintInvoice,

    // EnterCustomerPhonePopup
    popupCustomerInfoRef,
    closePopupEnterCustomerPhone: () => {},

    // PopupAddItemIntoAppointments
    popupAddItemIntoAppointmentsRef,
    visiblePopupAddItemIntoBasket,
    closePopupAddItemIntoAppointments: () => {},

    // PopupGiftCardDetail
    closePopupProductPaymentDetails: () => {},
    nextPayment: () => {},
    cancelGiftCardPayment: () => {},

    // PopupCheckStaffPermission
    popupCheckDiscountPermissionRef,
    visiblePopupCheckDiscountPermission:
      marketing.visiblePopupCheckDiscountPermission,
    closePopupCheckDiscountPermission: () => {
      dispatch(actions.marketing.switchPopupCheckDiscountPermission(false));
    },

    // PopupAddEditCustomer
    addEditCustomerInfoRef,
    visibleAddEditCustomerPopup,
    closePopupAddEditCustomer: () => {
      setVisibleAddEditCustomerPopup(false);
    },
    editCustomerInfo: (customerId, customer) => {
      dispatch(actions.customer.editCustomer(customerId, customer, true));
    },
    addCustomerInfo: (customer) => {
      dispatch(actions.customer.addCustomer(customer, true));
    },

    // PopupReceipt
    invoiceRef,

    // PopupEnterAmountCustomService
    popupEnterAmountCustomServiceRef,
    submitAddCustomService: async (args) => {
      await dispatchLocal(CheckoutState.setCustomService(args));
      _addAmount(args);
    },

    backAddBasket: () => {
      _cancelHarmonyPayment();
      // link to tab appointment
      // NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
      setIsPayment(false);
    },

    callbackDiscountToParent: () => {},
    isShowCountdown:
      hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo,
    addBlockAppointmentRef: (ref, index) => {
      blockAppointmentRef?.push(ref);
    },

    printTemptInvoice: async () => {
      await invoiceRef.current?.show({
        isPrintTempt: true,
        isAppointmentTab: false,
      });
    },
    shareTemptInvoice: async () => {
      await invoiceRef.current?.share({
        isPrintTempt: true,
        isAppointmentTab: false,
      });
    },
    checkStatusCashier: async () => {
      const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
        dataLocal.printerList,
        dataLocal.printerSelect
      );

      if (portName) {
        Helpers.openCashDrawer(portName);
      } else {
        if (
          hardware.paymentMachineType == AppUtils.PaymentTerminalType.Clover
        ) {
          Helpers.openCashDrawerClover(hardware);
        } else {
          alert("Please connect to your cash drawer.");
        }
      }
    },
    isShowCountdown:
      hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo,
    closePopupErrorMessageFromPax: () => {
      setVisibleErrorMessageFromPax(false);
      if (appointment.payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(
            appointment.payAppointmentId,
            "transaction fail",
            errorMessageFromPax
          )
        );
      }
    },
    handleYes: () => {
      setVisibleErrorMessageFromPax(false);
      if (appointment.payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(
            appointment.payAppointmentId,
            "transaction fail",
            errorMessageFromPax
          )
        );
      }
    },
    isShowRefreshButton,
    onConfirmRefresh: () => {
      if (hardware.paymentMachineType == AppUtils.PaymentTerminalType.Dejavoo) {
        setVisibleErrorMessageFromPax(false);
        const param = {
          RefId: appointment.payAppointmentId,
        };
        AppUtils.requestPreviousTransactionReportDejavoo(param).then(
          (response) => {
            try {
              parseString(response, (err, result) => {
                let errorCode = _.get(result, "xmp.response.0.ResultCode.0");
                if (errorCode == 2) {
                  //Can not connect Dejavoo, show error without refresh button
                  setIsShowRefreshButton(true);
                } else {
                  //Show error with refresh button
                  setIsShowRefreshButton(false);
                }
                if (
                  err ||
                  errorCode != 0 ||
                  _.get(result, "xmp.response.0.Message.0") != "Approved"
                ) {
                  let detailMessage = _.get(
                    result,
                    "xmp.response.0.RespMSG.0",
                    ""
                  ).replace(/%20/g, " ");
                  detailMessage = !AppUtils.stringIsEmptyOrWhiteSpaces(
                    detailMessage
                  )
                    ? `: ${detailMessage}`
                    : detailMessage;

                  const resultTxt =
                    `${_.get(
                      result,
                      "xmp.response.0.Message.0"
                    )}${detailMessage}` || "Transaction failed";

                  if (
                    _.get(result, "xmp.response.0.Message.0") == "Not found"
                  ) {
                    //call transaction again
                    setVisibleProcessingCredit(true);
                    AppUtils.requestTransactionDejavoo(parameter).then(
                      (responsesPayment) => {
                        const parameter = {
                          tenderType: "Credit",
                          transType: "Sale",
                          amount: Number(moneyUserGiveForStaff).toFixed(2),
                          RefId: appointment.payAppointmentId,
                          invNum: `${
                            appointment.groupAppointment?.checkoutGroupId || 0
                          }`,
                        };
                        handleResponseCreditCardDejavoo(
                          responsesPayment,
                          true,
                          moneyUserGiveForStaff,
                          parameter
                        );
                      }
                    );
                  } else {
                    setTimeout(() => {
                      setVisibleErrorMessageFromPax(true);
                      setVisibleProcessingCredit(false);
                      setErrorMessageFromPax(resultTxt);
                    }, 400);
                  }
                } else {
                  setVisibleProcessingCredit(false);
                  const SN = _.get(result, "xmp.response.0.SN.0");
                  if (!AppUtils.stringIsEmptyOrWhiteSpaces(SN)) {
                    dispatch(actions.hardware.setDejavooMachineSN(SN));
                  }

                  dispatch(
                    actions.appointment.submitPaymentWithCreditCard(
                      dataLocal.profile?.merchantId || 0,
                      message,
                      appointment.payAppointmentId,
                      moneyUserGiveForStaff,
                      "dejavoo",
                      parameter
                    )
                  );
                }
              });
            } catch (error) {}
          }
        );
      }
    },
  };
};
