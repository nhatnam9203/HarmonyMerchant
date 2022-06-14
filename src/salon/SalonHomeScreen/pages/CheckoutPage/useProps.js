import actions from "@actions";
import { useFocusEffect } from "@react-navigation/native";
import * as AppUtils from "@utils";
import _ from "lodash";
import moment from "moment";
import React from "react";
import { NativeEventEmitter, NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import NavigatorServices from "@navigators/NavigatorServices";
import { ScreenName } from "@src/ScreenName";
import * as Helpers from "../../Helpers";

const signalR = require("@microsoft/signalr");

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

export const useProps = (props) => {
  const dispatch = useDispatch();

  // References
  const subscriptions = React.useRef([]);
  const isProcessPrintClover = React.useRef(false);
  const isProcessPaymentClover = React.useRef(false);
  const eventEmitter = React.useRef(new NativeEventEmitter(clover));
  const categoriesRef = React.useRef(null);
  const amountRef = React.useRef(null);
  const popupAddItemIntoAppointmentsRef = React.useRef(null);
  const modalBillRef = React.useRef(null);
  const blockAppointmentRef = React.useRef(null);
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
  const [visibleConfirm, setVisibleConfirm] = React.useState(false);
  const [visibleErrorMessageFromPax, setVisibleErrorMessageFromPax] =
    React.useState(false);
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
  const [
    visiblePopupCheckDiscountPermission,
    setVisiblePopupCheckDiscountPermission,
  ] = React.useState(false);
  const [visibleAddEditCustomerPopup, setVisibleAddEditCustomerPopup] =
    React.useState(false);
  const [isPayment, setIsPayment] = React.useState(false);

  const setSelectStaffFromCalendar = (staffId, isFirstPressCheckout = null) => {
    if (!staffId) return;
    dispatchLocal(CheckoutState.setSelectStaffFromCalendar(staffId));
    categoriesRef.current?.scrollFlatListToStaffIndex(
      staffId,
      isFirstPressCheckout
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
          appointment.payAppointmentId,
          appointment.amountCredtitForSubmitToServer,
          "clover"
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const _handleResponseCreditCardForCloverFailed = (errorMessage) => {
    setVisibleProcessingCredit(false);

    try {
      if (appointment.payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(
            appointment.payAppointmentId,
            "transaction fail",
            appointment.errorMessage
          )
        );
      }

      setTimeout(() => {
        setVisibleErrorMessageFromPax(true);
        dispatchLocal(
          CheckoutState.updateCreditCardPay({
            visibleErrorMessageFromPax: true,
            errorMessageFromPax: `${result.message}`,
          })
        );
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    clover.changeListenerStatus(true);
    subscriptions.current = [
      eventEmitter.current.addListener("paymentSuccess", (data) => {
        // console.log("paymentSuccess");
        isProcessPaymentClover = false;
        _handleResponseCreditCardForCloverSuccess(data);
      }),
      eventEmitter.current.addListener("paymentFail", (data) => {
        // console.log("paymentSuccess");
        isProcessPaymentClover = false;
        _handleResponseCreditCardForCloverFailed(
          _.get(data, "appointment.errorMessage")
        );
      }),
      eventEmitter.current.addListener("pairingCode", (data) => {
        if (data) {
          const text = `Pairing code: ${_.get(data, "pairingCode")}`;
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
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i].props.appointment.appointmentDetail
            .appointmentId;
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

  const createNewAppointment = async (basket) => {
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
  };

  const removeItemInBlockAppointment = (dataRemove) => {
    let isAppointmentIdOpen = "";
    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i].props.appointment.appointmentDetail
            .appointmentId;
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
    const { ip, port, timeout } = paxMachineInfo;
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
            _handleResponseCreditCard(data, online, moneyUserGiveForStaff);
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
        // setTimeout(()=>{ PosLink.cancelTransaction()}, 100)
        if (appointment.payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              appointment.payAppointmentId,
              "transaction fail",
              result?.message
            )
          );
        }
        if (result?.message === "ABORTED") {
          return;
        }
        setTimeout(() => {
          setVisibleErrorMessageFromPax(true);
          dispatchLocal(
            CheckoutState.updateCreditCardPay({
              visibleErrorMessageFromPax: true,
              errorMessageFromPax: `${result.message}`,
            })
          );
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
        if (appointment.payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              appointment.payAppointmentId,
              "transaction fail",
              resultTxt
            )
          );
        }
        setTimeout(() => {
          // alert(resultTxt);
          setVisibleErrorMessageFromPax(true);
          dispatchLocal(
            CheckoutState.updateCreditCardPay({
              visibleErrorMessageFromPax: true,
              errorMessageFromPax: `${resultTxt}`,
            })
          );
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
          if (hardware.paymentMachineType == PaymentTerminalType.Pax) {
            isSetup = _.get(paxMachineInfo, "isSetup");
          } else if (
            hardware.paymentMachineType == PaymentTerminalType.Dejavoo
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
          : formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
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
  };

  const _addGiftCardIntoBlockAppointment = (code) => {
    let isAppointmentIdOpen = "";
    for (let i = 0; i < blockAppointmentRef.length; i++) {
      if (!blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          blockAppointmentRef[i].props.appointment.appointmentDetail
            .appointmentId;
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
          selectedStaff?.staffId
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
          createNewAppointment(temptBasket);
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
          createNewAppointment(temptBasket);
        }
      }
    }

    dispatchLocal(CheckoutState.selectCategory(null)); // reset
  };

  const _doPrintClover = (imageUri) => {
    isProcessPrintClover.current = true;
    const port = _.get(hardware.cloverMachineInfo, "port")
      ? _.get(hardware.cloverMachineInfo, "port")
      : 80;
    const url = `wss://${_.get(
      hardware.cloverMachineInfo,
      "ip"
    )}:${port}/remote_pay`;
    const printInfo = {
      imageUri,
      url,
      remoteAppId: AppUtils.REMOTE_APP_ID,
      appName: AppUtils.APP_NAME,
      posSerial: AppUtils.POS_SERIAL,
      token: _.get(hardware.cloverMachineInfo, "dataLocal.token")
        ? _.get(hardware.cloverMachineInfo, "dataLocal.token", "")
        : "",
    };
    clover.doPrintWithConnect(printInfo);
    isProcessPrintClover.current = false;
  };

  const _cancelInvoicePrint = (isPrintTempt) => {
    setVisiblePrintInvoice(false);
    if (!isPrintTempt) {
      setIsPayment(false);
      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
      dispatch(actions.appointment.resetBasketEmpty());
      dispatchLocal(CheckoutState.resetState());
      dispatch();
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

  return {
    categoriesRef,
    amountRef,
    popupDiscountRef,
    popupDiscountLocalRef,
    changeTipRef,
    popupCheckDiscountPermissionRef,
    isLoadingService: apis.isGetServiceByStaff || apis.isGetProductByStaff,
    ...dataLocal,
    ...category,
    ...network,
    ...service, // custom service info of merchant
    ...product, // custom service info of merchant
    // loginStaff: dataLocal.profileStaffLogin,
    isPayment, // show categories or payment
    ...appointment,
    ...stateLocal,
    // apis
    ...apis,
    ...extra,

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
        createABlockAppointment();
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
      NavigatorServices.goBack();
      // this.setState(
      //   Object.assign(initState, {
      //     isBookingFromAppointmentTab: true, // book appointment from calendar
      //   })
      // );
      // this.props.actions.appointment.resetGroupAppointment();
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
      blockAppointmentRef.current = [];
      dispatch(actions.appointment.resetGroupAppointment());
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
            this.callBackGetStaffService
          )
        );
      } else {
        // this.setState({ visibleChangeStylist: true });
      }
    },
    toggleCollapses: (appointmentIdSelection) => {
      for (let i = 0; i < blockAppointmentRef.length; i++) {
        const appointmentDetail =
          blockAppointmentRef[i].props.appointmentDetail;
        if (
          appointment.appointmentDetail &&
          appointment.appointmentDetail.appointmentId === appointmentIdSelection
        ) {
          dispatch(
            actions.appointment.updateIdBlockAppointmentOpen(
              appointment.appointmentDetail.appointmentId
            )
          );
          blockAppointmentRef[i].setStateFromParent(false);
        } else {
          blockAppointmentRef[i].setStateFromParent(true);
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
    removeBlockAppointment: () => {
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
    createABlockAppointment: () => {
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
    },
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
    showModalCheckPermission: () => {
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
    visibleConfirm,
    closePopupCheckDiscountPermission: () => {
      dispatch(actions.marketing.switchPopupCheckDiscountPermission(false));
    },
    closePopupConfirm: () => {
      setVisibleConfirm(false);
    },
    clearDataConfirm: () => {
      const { isDrawer } = stateLocal;
      if (!_.isEmpty(appointment.connectionSignalR)) {
        appointment.connectionSignalR.stop();
      }

      if (appointment.payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(appointment.payAppointmentId)
        );
      }

      // reset về page appointment,  // !
      // this.props.gotoPageCurentParent(isDrawer); //!

      // reset local state
      dispatchLocal(CheckoutState.resetState());

      // reset page
      setIsPayment(false);

      // reset basket
      dispatch(props.actions.appointment.resetBasketEmpty());
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
        if (appointment.isBookingFromCalendar) {
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
          !appointment.isBookingFromCalendar &&
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
              app.services.length +
                app.products.length +
                app.giftCards.length ===
              0
            ) {
              const mainAppointmentId = appointment.groupAppointment
                ?.mainAppointmentId
                ? appointment.groupAppointment.mainAppointmentId
                : 0;
              const customerId = appointment.customerInfoBuyAppointment
                .customerId
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

        blockAppointmentRef.current = [];
      }
    },

    //Popup Payment   Confirm
    visibleConfirmPayment,
    closePopupPaymentConfirm: () => {
      setVisibleConfirmPayment(false);
    },
    confirmPaymentClover: () => {},
    rejectPaymentClover: () => {},

    // Popup Error Message
    visibleErrorMessageFromPax,
    closePopupErrorMessageFromPax: () => {
      setVisibleErrorMessageFromPax(false);
    },

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
    printBill: () => {
      // this.pushAppointmentIdOfflineIntoWebview();

      const { portName } = getInfoFromModelNameOfPrinter(
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
    },
    cancelInvoicePrint: _cancelInvoicePrint,
    doPrintClover: _doPrintClover,
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
        } else if (hardware.paymentMachineType == PaymentTerminalType.Dejavoo) {
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
          utils.formatNumberFromCurrency(
            this.modalBillRef.current?.state.quality
          )
        );
        const method = Helpers.getPaymentString(paymentSelected);
        const bodyAction = {
          merchantId: dataLocal.profile.merchantId,
          userId: appointment.customerInfoBuyAppointment?.userId || 0,
          status: "checkin",
          services: [],
          extras: [],
          products: [],
          fromTime: formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
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

    doPrintClover: () => {},

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
    visiblePopupCheckDiscountPermission,
    closePopupCheckDiscountPermission: () => {},

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
      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
    },

    callbackDiscountToParent: () => {},
  };
};
