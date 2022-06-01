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

const signalR = require("@microsoft/signalr");

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

export const useProps = ({ params }) => {
  const dispatch = useDispatch();

  const { bookingStaffId } = params || {};

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
  const {
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    staffListCurrentDate,
    bookingGroupId,
    fromTimeBlockAppointment,
    isOpenBlockAppointmentId,
    payAppointmentId,
    appointmentDetail,
    isGetAppointmentSucces,
    connectionSignalR,
    flagSignInAppointment,
    isCancelAppointment,
    webviewRef,
    appointmentIdOffline,
    isLoadingGetBlockAppointment,
    isLoadingRemoveBlockAppointment,
    idNextToAppointmentRemove,
    startProcessingPax,
    paxAmount,
    amountCredtitForSubmitToServer,
    isCancelPayment,
    isCreditPaymentToServer,
    lastTransactionAppointmentId,
    lastGroupAppointmentPay,
    errorMessage,
    appointmentIdBookingFromCalendar,
  } = useSelector((state) => state.appointment);

  const categoriesByMerchant = useSelector(
    (state) => state.category.categoriesByMerchant
  );
  const {
    profileStaffLogin,
    profile,
    language,
    token,
    deviceId,
    versionApp,
    printerSelect,
    printerList,
    isTipOnPaxMachine,
    bluetoothPaxInfo,
  } = useSelector((state) => state.dataLocal) || {};
  const isOfflineMode = useSelector((state) => state.network?.isOfflineMode);
  const extrasByMerchant = useSelector((state) => state.extra.extrasByMerchant);
  const { customService, servicesByMerchant } =
    useSelector((state) => state.service) || {};
  const { productsByMerchantId } = useSelector((state) => state.product) || {};
  const { listStaffByMerchant } =
    useSelector((state) => state.staff.listStaffByMerchant) || {};
  const { dejavooMachineInfo, paymentMachineType, cloverMachineInfo } =
    useSelector((state) => state.hardware) || {};

  // Local state
  const [stateLocal, dispatchLocal] = React.useReducer(
    CheckoutState.reducer,
    CheckoutState.initState
  );

  // Api call
  const {
    isGetCategoriesByStaff,
    getCategoriesByStaff,
    isGetServiceByStaff,
    getServiceByStaff,
    isGetProductByStaff,
    getProductByStaff,
  } = useCallApis({
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

  // Effects
  useFocusEffect(
    React.useCallback(() => {
      if (bookingStaffId) {
        if (!isOfflineMode)
          getCategoriesByStaff(profileStaffLogin?.staffId, () => {});

        setSelectStaffFromCalendar(bookingStaffId, false);
      } else if (profileStaffLogin?.staffId && _.isEmpty(groupAppointment)) {
        if (!isOfflineMode)
          getCategoriesByStaff(profileStaffLogin?.staffId, () => {});

        setSelectStaffFromCalendar(profileStaffLogin?.staffId, true);
      }
    }, [profileStaffLogin?.staffId, bookingStaffId])
  );

  // Functions
  const _handleResponseCreditCardForCloverSuccess = (message) => {
    setVisibleProcessingCredit(false);
    let messageUpdate = {
      ...message,
      sn: _.get(cloverMachineInfo, "serialNumber"),
    };

    try {
      dispatch(
        actions.appointment.submitPaymentWithCreditCard(
          profile?.merchantId || 0,
          JSON.stringify(messageUpdate),
          payAppointmentId,
          amountCredtitForSubmitToServer,
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
      if (payAppointmentId) {
        dispatch(
          actions.appointment.cancelHarmonyPayment(
            payAppointmentId,
            "transaction fail",
            errorMessage
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
        handleResponseCreditCardForCloverSuccess(data);
      }),
      eventEmitter.current.addListener("paymentFail", (data) => {
        // console.log("paymentSuccess");
        isProcessPaymentClover = false;
        handleResponseCreditCardForCloverFailed(_.get(data, "errorMessage"));
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
          handleResponseCreditCardForCloverFailed("No connected device");
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

  const addBlockAppointment = () => {};
  const getPriceOfline = (basket) => {
    let total = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        total =
          total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
      } else {
        total = total + AppUtils.formatNumberFromCurrency(basket[i].data.price);
      }
    }
    return total;
  };

  const calculateTotalTaxLocal = (basket) => {
    const taxService = profile.taxService
      ? AppUtils.formatNumberFromCurrency(profile.taxService)
      : 0;
    const taxProduct = profile.taxProduct
      ? AppUtils.formatNumberFromCurrency(profile.taxProduct)
      : 0;
    let taxTotal = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        taxTotal =
          taxTotal +
          (parseFloat(basket[i].data.price) *
            basket[i].quanlitySet *
            taxProduct) /
            100;
      } else if (basket[i].type === "Service") {
        taxTotal =
          taxTotal +
          (AppUtils.formatNumberFromCurrency(basket[i].data.price) *
            taxService) /
            100;
      }
    }
    return Number(taxTotal).toFixed(2);
  };

  const createItemsAddBasket = (basket) => {
    const { selectedStaff } = stateLocal || {};

    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        arrayProductBuy.push({
          ...basket[i],
          productId: basket[i].data.productId,
          quantity: basket[i].quanlitySet,
        });
      } else if (basket[i].type === "Service") {
        arryaServicesBuy.push({
          ...basket[i],
          serviceId: basket[i].data.serviceId,
          staffId: selectedStaff?.staffId,
          tipAmount: 0,
        });
      } else if (basket[i].type === "Extra") {
        arrayExtrasBuy.push({
          ...basket[i],
          extraId: basket[i].data.extraId,
        });
      }
    }
    return {
      arrayProductBuy,
      arryaServicesBuy,
      arrayExtrasBuy,
      staffId: selectedStaff?.staffId,
    };
  };

  const getBasketOnline = (appointments) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];
    const promotionNotes = [];
    appointments.forEach((appointment) => {
      const note = appointment?.promotionNotes?.note || "";
      if (note) {
        promotionNotes.push(note);
      }
      // ------ Push Service -------
      appointment?.services.forEach((service) => {
        arryaServicesBuy.push({
          type: "Service",
          data: {
            name: service?.serviceName || "",
            price: service?.price || "",
          },
          staff: service?.staff || false,
          note: service?.note || "",
        });
      });

      // ------ Push Product -------
      appointment?.products.forEach((product) => {
        arrayProductBuy.push({
          type: "Product",
          data: {
            name: product?.productName || "",
            price: product?.price || "",
          },
          quanlitySet: product?.quantity || "",
        });
      });

      // ------ Push Product -------
      appointment?.extras.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment?.giftCards.forEach((gift) => {
        arrayGiftCards.push({
          type: "GiftCards",
          data: {
            name: gift?.name || "Gift Card",
            price: gift?.price || "",
          },
          quanlitySet: gift?.quantity || "",
        });
      });
    });

    return {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    };
  };

  const getPaymentString = (type) => {
    let method = "";
    switch (type) {
      case "HarmonyPay":
        method = "harmony";
        break;
      case "Cash":
        method = "cash";
        break;
      case "Credit Card":
        method = "credit_card";
        break;
      case "Debit Card":
        method = "credit_card";
        break;
      case "Gift Card":
        method = "giftcard";
        break;
      case "Other":
        method = "other";
        break;
      default:
        method = "";
    }
    return method;
  };

  const createNewAppointment = async (basket) => {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      selectedStaff,
    } = stateLocal || {};

    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      createItemsAddBasket(basket);

    const moneyUserGiveForStaff = parseFloat(
      AppUtils.formatNumberFromCurrency(modalBillRef.current?.state.quality)
    );

    const method = getPaymentString(paymentSelected);

    dispatch(
      actions.appointment.createAnymousAppointment(
        profile.merchantId,
        customerInfoBuyAppointment?.userId || 0,
        customerInfoBuyAppointment?.customerId || 0,
        // profileStaffLogin.staffId,
        selectedStaff?.staffId,
        arrayProductBuy,
        arryaServicesBuy,
        arrayExtrasBuy,
        method,
        true,
        customDiscountFixedLocal,
        customDiscountPercentLocal,
        customerInfoBuyAppointment?.firstName || "",
        customerInfoBuyAppointment?.lastName || "",
        customerInfoBuyAppointment?.phone || "",
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
          blockAppointmentRef[i].props.appointmentDetail.appointmentId;
        break;
      }
    }
    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : blockAppointments[0].appointmentId;

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
          `${Configs.SOCKET_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app&deviceId=${deviceId}&token=${token}`,
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
          this.handleHarmonyPayment(temptData.data.checkoutPayment);
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
          groupAppointment?.checkoutGroupId || 0,
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
        if (payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              payAppointmentId,
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
          if (payAppointmentId) {
            dispatch(
              actions.appointment.cancelHarmonyPayment(payAppointmentId)
            );
          }

          setVisibleProcessingCredit(false);
          setTimeout(() => {
            alert("You're running your Pax on DEMO MODE!");
          }, 1000);
        } else {
          dispatch(
            actions.appointment.submitPaymentWithCreditCard(
              profile?.merchantId || 0,
              message,
              payAppointmentId,
              moneyUserGiveForStaff,
              "pax",
              parameter
            )
          );
        }
      } else {
        const resultTxt = result?.ResultTxt || "Transaction failed:";
        if (payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              payAppointmentId,
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

    const method = getPaymentString(paymentSelected);
    const total = groupAppointment?.total
      ? parseFloat(AppUtils.formatNumberFromCurrency(groupAppointment.total))
      : 0;

    const dueAmount = paymentDetailInfo.dueAmount
      ? parseFloat(
          AppUtils.formatNumberFromCurrency(paymentDetailInfo.dueAmount)
        )
      : 0;
    if (isOfflineMode) {
      _handlePaymentOffLineMode();
      return;
    }

    if (moneyUserGiveForStaff == 0 && groupAppointment && total != 0) {
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

      modalBillRef.current?.setStateFromParent(`0`);
      if (!_.isEmpty(groupAppointment)) {
        if (method === "harmony") {
          dispatch(actions.app.loadingApp());
          _setupSignalR(
            profile,
            token,
            groupAppointment?.checkoutGroupId,
            deviceId,
            method,
            moneyUserGiveForStaff
          );
        } else if (method === "credit_card" || method === "debit_card") {
          let isSetup = false;
          if (paymentMachineType == PaymentTerminalType.Pax) {
            isSetup = _.get(paxMachineInfo, "isSetup");
          } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
            isSetup = _.get(dejavooMachineInfo, "isSetup");
          } else {
            isSetup = _.get(cloverMachineInfo, "isSetup");
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
              groupAppointment?.checkoutGroupId,
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

    if (_.isEmpty(paymentDetailInfo)) {
      if (isOfflineMode) {
        const temptTotal = Number(
          AppUtils.formatNumberFromCurrency(subTotalLocal) +
            AppUtils.formatNumberFromCurrency(tipLocal) +
            AppUtils.formatNumberFromCurrency(taxLocal) -
            AppUtils.formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2);
        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      } else {
        const temptTotal = _.isEmpty(groupAppointment)
          ? Number(
              AppUtils.formatNumberFromCurrency(subTotalLocal) +
                AppUtils.formatNumberFromCurrency(tipLocal) +
                AppUtils.formatNumberFromCurrency(taxLocal) -
                AppUtils.formatNumberFromCurrency(discountTotalLocal)
            ).toFixed(2)
          : groupAppointment?.total;
        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      }
    } else {
      const totalExact = paymentDetailInfo.dueAmount
        ? paymentDetailInfo.dueAmount
        : 0;
      modalBillRef.current?.setStateFromParent(`${totalExact}`);
    }
  };

  const _changeStylistBasketLocal = (serviceId, staffId, tip, price) => {
    const { basket } = stateLocal;
    // listStaffByMerchant
    if (staffId) {
      const temptStaff = AppUtils.getStaffInfoById(
        listStaffByMerchant,
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

  const getBasketOffline = () => {
    const { basket, selectedStaff } = stateLocal;
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        arrayProductBuy.push({
          ...basket[i],
          productId: basket[i].data.productId,
          quantity: basket[i].quanlitySet,
        });
      } else if (basket[i].type === "Service") {
        arryaServicesBuy.push({
          ...basket[i],
          serviceId: basket[i].data.serviceId,
          staffId: selectedStaff?.staffId,
          tipAmount: 0,
        });
      } else if (basket[i].type === "Extra") {
        arrayExtrasBuy.push({
          ...basket[i],
          extraId: basket[i].data.extraId,
        });
      }
    }
    return {
      arrayProductBuy,
      arryaServicesBuy,
      arrayExtrasBuy,
      staffId: selectedStaff?.staffId,
    };
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
    } = stateLocal || {};

    let method = getPaymentString(paymentSelected);
    const dataAnymousAppoitment = getBasketOffline();
    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      dataAnymousAppoitment;

    const appointmentOfflineMode = {
      appointmentId: appointmentIdOffline,
      firstName: infoUser.firstName,
      lastName: infoUser.lastName,
      phoneNumber: infoUser.phoneNumber,
      subTotal: subTotalLocal ? parseFloat(subTotalLocal) : 0,
      tax: taxLocal ? parseFloat(taxLocal) : 0,
      tipAmount: tipLocal ? parseFloat(tipLocal) : 0,
      discount: discountTotalLocal ? parseFloat(discountTotalLocal) : 0,
      merchantId: profile.merchantId,
      services: arryaServicesBuy,
      extras: arrayExtrasBuy,
      products: arrayProductBuy,
      fromTime:
        fromTime !== ""
          ? fromTime
          : formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
      staffId: staffIdOfline !== 0 ? staffIdOfline : profileStaffLogin.staffId,
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
          blockAppointmentRef[i].props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : isOpenBlockAppointmentId;

    dispatch(
      actions.appointment.addGiftCardIntoBlockAppointment(code, appointmentId)
    );
  };

  const _addAmount = async () => {
    const {
      categoryTypeSelected,
      productSeleted,
      arrSelectedExtra,
      selectedStaff,
      customServiceSelected,
    } = stateLocal || {};

    // ------------ Block Booking -------------
    if (blockAppointments.length > 0) {
      addBlockAppointment();
      return;
    }

    // -------------  Group Appointment  ------------
    if (!_.isEmpty(groupAppointment)) {
      const appointments = groupAppointment?.appointments || [];
      const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
      let body = {};
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        body = {
          services: [],
          extras: [],
          products: [
            {
              productId: productSeleted?.productId,
              quantity: this.amountRef.current?.state.quanlity,
            },
          ],
          giftCards: [],
        };
      } else {
        //  -------------Add Extra , Service ---------
        const mainAppointment = appointments.find(
          (appointment) => appointment.appointmentId === mainAppointmentId
        );
        const temptExtra = [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
        }

        body = {
          services: [
            {
              serviceId:
                productSeleted?.serviceId ?? customServiceSelected.serviceId,
              // staffId: mainAppointment?.staff?.staffId || profileStaffLogin.staffId,
              staffId: selectedStaff?.staffId,
              ...(customServiceSelected && {
                categoryId: customServiceSelected?.categoryId,
                price: customServiceSelected?.price,
              }),
            },
          ],
          extras: temptExtra,
          products: [],
          giftCards: [],
        };
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
      // Handle add from tab check out
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        const temptBasket = [];
        temptBasket.unshift({
          type: "Product",
          id: `${productSeleted?.productId}_pro`,
          data: {
            name: productSeleted?.name || "",
            productId: productSeleted?.productId || 0,
            price: productSeleted?.price || 0,
          },
          quanlitySet: amountRef?.current?.state.quanlity || 1,
        });

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: getPriceOfline(temptBasket),
            taxLocal: calculateTotalTaxLocal(temptBasket),
          })
        );

        if (!isOfflineMode) {
          createNewAppointment(temptBasket);
        }
      } else {
        //  -------------Add Extra , Service ---------
        const temptBasket = [];
        temptBasket.unshift({
          type: "Service",
          id: `${
            productSeleted?.serviceId ?? customServiceSelected?.serviceId
          }_ser`,
          data: {
            name: productSeleted?.name ?? "Custom Service",
            serviceId:
              productSeleted?.serviceId ?? customServiceSelected?.serviceId,
            price: productSeleted?.price ?? customServiceSelected?.price,
          },
          serviceName: productSeleted?.name ?? "Custom Service",
          staff: {
            staffId: profileStaffLogin.staffId,
            imageUrl: profileStaffLogin.imageUrl,
            displayName: profileStaffLogin.displayName,
            tip: 0.0,
          },
          ...(customServiceSelected && {
            categoryId: customServiceSelected?.categoryId,
            price: customServiceSelected?.price,
          }),
        });

        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptBasket.unshift({
            type: "Extra",
            id: `${arrSelectedExtra[i]?.extraId}_extra`,
            data: {
              name: arrSelectedExtra[i]?.name,
              extraId: arrSelectedExtra[i]?.extraId,
              price: arrSelectedExtra[i]?.price,
            },
            serviceName: productSeleted?.name,
          });
        }

        dispatchLocal(
          CheckoutState.setBasket({
            basket: temptBasket,
            subTotalLocal: getPriceOfline(temptBasket),
            taxLocal: calculateTotalTaxLocal(temptBasket),
          })
        );

        if (!isOfflineMode) {
          createNewAppointment(temptBasket);
        }
      }
    }

    dispatchLocal(CheckoutState.selectCategory(null)); // reset
  };

  const _doPrintClover = (imageUri) => {
    isProcessPrintClover.current = true;
    const port = _.get(cloverMachineInfo, "port")
      ? _.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${_.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;
    const printInfo = {
      imageUri,
      url,
      remoteAppId: AppUtils.REMOTE_APP_ID,
      appName: AppUtils.APP_NAME,
      posSerial: AppUtils.POS_SERIAL,
      token: _.get(cloverMachineInfo, "token")
        ? _.get(cloverMachineInfo, "token", "")
        : "",
    };
    clover.doPrintWithConnect(printInfo);
    isProcessPrintClover.current = false;
  };

  const _cancelInvoicePrint = (isPrintTempt) => {
    setVisiblePrintInvoice(false);
    if (!isPrintTempt) {
      // this.scrollTabRef.current?.goToPage(0);
      setIsPayment(false);
      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
      // this.props.gotoAppoitmentScreen();
      dispatch(actions.appointment.resetBasketEmpty());
      dispatchLocal(CheckoutState.resetState());
      dispatch();
    }
  };

  const _checkStatusCashier = () => {
    const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName) {
      _openCashDrawer(portName);
    } else {
      if (paymentMachineType == AppUtils.PaymentTerminalType.Clover) {
        _openCashDrawerClover();
      } else {
        alert("Please connect to your cash drawer.");
      }
    }
  };

  const _openCashDrawerClover = () => {
    const port = _.get(cloverMachineInfo, "port")
      ? _.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${_.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

    clover.openCashDrawer({
      url,
      remoteAppId: AppUtils.REMOTE_APP_ID,
      appName: AppUtils.APP_NAME,
      posSerial: AppUtils.POS_SERIAL,
      token: _.get(cloverMachineInfo, "token")
        ? _.get(cloverMachineInfo, "token", "")
        : "",
    });
  };

  const _cancelHarmonyPayment = () => {
    dispatchLocal(CheckoutState.resetPayment());
    if (payAppointmentId) {
      dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
    }

    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
  };

  const _openCashDrawer = () => {};

  return {
    categoriesRef,
    amountRef,
    popupDiscountRef,
    popupDiscountLocalRef,
    changeTipRef,
    popupCheckDiscountPermissionRef,
    isGetCategoriesByStaff,
    isLoadingService: isGetServiceByStaff || isGetProductByStaff,
    isCustomService: profile?.isCustomService,
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    categoriesByMerchant,
    isOfflineMode,
    customService, // custom service info of merchant
    staffListCurrentDate, // list staffs working by date
    loginStaff: profileStaffLogin,
    isPayment, // show categories or payment
    ...stateLocal,

    // Customer
    displayCustomerInfoPopup: () => {
      const customerId = customerInfoBuyAppointment?.customerId || 0;
      dispatch(actions.customer.getCustomerInfoById(customerId, true));
    },

    displayEnterUserPhonePopup: () => {
      const { firstName, lastName, phone } = customerInfoBuyAppointment || {};
      popupCustomerInfoRef.current?.setStateFromParent(
        firstName,
        lastName,
        phone
      );
      dispatch(actions.appointment.switchVisibleEnterCustomerPhonePopup(true));
    },

    addAppointmentCheckout: () => {
      if (blockAppointments?.length > 0) {
        createABlockAppointment();
      }

      // TODO: link to tab appointment
      // this.props.gotoAppointmentTabToGroup();
    },

    cancelHarmonyPayment: _cancelHarmonyPayment,
    payBasket: () => {
      const { paymentSelected } = stateLocal || {};
      const method = getPaymentString(paymentSelected);
      if (isOfflineMode && method === "harmony") {
        // TODO: link to payment tab
        // this.scrollTabRef.current?.goToPage(2);
        setIsPayment(true);
        addAppointmentOfflineMode(true);
      } else if (
        isOfflineMode &&
        (method === "credit_card" || method === "debit_card")
      ) {
        alert("Not Support Offline Mode");
      } else if (method === "harmony" && _.isEmpty(groupAppointment)) {
        popupSendLinkInstallRef.current?.setStateFromParent("");
        setVisibleSendLinkPopup(true);
      } else {
        if (method === "harmony" || method === "credit_card") {
          const dueAmount = paymentDetailInfo?.dueAmount || 0;
          modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
        }

        setVisibleBillOfPayment(true);
      }
    },
    confimPayOfflinemode: () => {
      setVisibleScanCode(true);
    },
    bookAppointmentFromCalendar: () => {
      //    this.props.gotoTabAppointment();
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
        !isDonePayment &&
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
      // this.props.gotoTabAppointment();
      dispatch(actions.appointment.bookBlockAppointment());
      dispatchLocal(CheckoutState.resetState());
      blockAppointmentRef.current = [];
      dispatch(actions.appointment.resetGroupAppointment());
    },
    checkBlockAppointment: () => {},
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
      if (!isOfflineMode) {
        getCategoriesByStaff(staff.staffId);
      }
      dispatchLocal(CheckoutState.selectStaff(staff));
    },
    getDataColProduct: () => {
      const {
        categoryTypeSelected,
        categorySelected,
        isBlockBookingFromCalendar,
        serviceStaff,
        productStaff,
      } = stateLocal || {};

      if (categoryTypeSelected === "Extra") {
        const dataExtra = extrasByMerchant?.filter(
          (extra, index) => extra?.isDisabled === 0
        );

        return dataExtra;
      } else {
        const data =
          categoryTypeSelected === "Service"
            ? servicesByMerchant
            : productsByMerchantId;

        if (data?.length > 0) {
          let temptData = data.filter((item) => {
            return (
              item?.categoryId === categorySelected?.categoryId &&
              item?.isDisabled === 0
            );
          });

          if (!isOfflineMode && !isBlockBookingFromCalendar) {
            if (categoryTypeSelected === "Service") {
              temptData = [...serviceStaff];
            } else if (categoryTypeSelected === "Product") {
              temptData = [...productStaff];
            }
          }

          return temptData;
        }

        return [];
      }
    },
    onPressSelectCategory: (category) => {
      if (_.isNil(category) || _.isEmpty(category)) return;

      const { categorySelected, isBlockBookingFromCalendar, selectedStaff } =
        stateLocal;
      const { categoryId, categoryType } = category;
      if (categorySelected?.categoryId !== categoryId) {
        if (!isOfflineMode && !isBlockBookingFromCalendar) {
          if (categoryType?.toString().toLowerCase() === "service") {
            getServiceByStaff({ categoryId, staffId: selectedStaff?.staffId });
          } else if (categoryType?.toString().toLowerCase() === "product") {
            getProductByStaff(categoryId);
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

      for (let i = 0; i < extrasByMerchant.length; i++) {
        for (let j = 0; j < product?.extras?.length; j++) {
          const extraLocal = product?.extras[j];
          const extralGlobal = extrasByMerchant[i];
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
        if (blockAppointments.length > 0) {
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
            subTotalLocal: getPriceOfline(temptBasket),
            taxLocal: calculateTotalTaxLocal(temptBasket),
          })
        );
      }
    },
    changeStylist: async (service, appointmentId) => {
      const { fromTime = new Date() } =
        groupAppointment?.appointments?.find(
          (appointment) => appointment.appointmentId === appointmentId
        ) || {};

      changeStylistRef.current?.setStateFromParent(service, appointmentId);

      if (!isOfflineMode) {
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
          appointmentDetail &&
          appointmentDetail.appointmentId === appointmentIdSelection
        ) {
          dispatch(
            actions.appointment.updateIdBlockAppointmentOpen(
              appointmentDetail.appointmentId
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
      const customerId = customerInfoBuyAppointment.customerId
        ? customerInfoBuyAppointment.customerId
        : 0;

      dispatch(
        actions.appointment.cancleAppointment(
          appointmentId,
          profile.merchantId,
          customerId,
          true,
          false
        )
      );
    },
    createABlockAppointment: () => {
      const { selectedStaff } = stateLocal || {};

      let fromTime = fromTimeBlockAppointment;
      if (blockAppointments && blockAppointments.length > 0) {
        fromTime = _.get(blockAppointments, "0.fromTime")
          ? moment(_.get(blockAppointments, "0.fromTime")).local().format()
          : new Date();
      }

      const firstAppointment = blockAppointments[0];

      if (
        firstAppointment &&
        firstAppointment.status &&
        firstAppointment.status === "waiting"
      ) {
        dispatch(
          actions.appointment.createAppointmentWaiting(
            profile.merchantId,
            fromTime,
            customerInfoBuyAppointment?.userId || 0,
            customerInfoBuyAppointment?.customerId || 0,
            customerInfoBuyAppointment?.firstName || "",
            customerInfoBuyAppointment?.lastName || "",
            customerInfoBuyAppointment?.phone || "",
            bookingGroupId,
            selectedStaff?.staffId ?? 0
          )
        );
      } else {
        dispatch(
          actions.appointment.createBlockAppointment(
            profile.merchantId,
            fromTime,
            customerInfoBuyAppointment?.userId || 0,
            customerInfoBuyAppointment?.customerId || 0,
            customerInfoBuyAppointment?.firstName || "",
            customerInfoBuyAppointment?.lastName || "",
            customerInfoBuyAppointment?.phone || "",
            bookingGroupId,
            selectedStaff?.staffId ?? 0
          )
        );
      }
    },
    addBlockAppointment: async () => {
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
            blockAppointmentRef[i].props.appointmentDetail.appointmentId;
          break;
        }
      }

      const appointmentId = isAppointmentIdOpen
        ? isAppointmentIdOpen
        : isOpenBlockAppointmentId;

      if (categoryTypeSelected === "Product") {
        dispatch(
          actions.appointment.addItemIntoAppointment(
            {
              services: [],
              extras: [],
              products: [
                {
                  productId: productSeleted?.productId,
                  quantity: this.amountRef.current?.state.quanlity,
                },
              ],
              giftCards: [],
            },
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
        dispatch(
          actions.appointment.addItemIntoAppointment(
            {
              services: [
                {
                  serviceId:
                    productSeleted?.serviceId ??
                    customServiceSelected?.serviceId,
                  ...(selectedStaff?.staffId && {
                    staffId: selectedStaff?.staffId,
                  }),
                  ...(customServiceSelected && {
                    categoryId: customServiceSelected?.categoryId,
                    price: customServiceSelected?.price,
                  }),
                },
              ],
              extras: temptExtra,
              products: [],
              giftCards: [],
            },
            appointmentId,
            false,
            true
          )
        );
      }

      dispatchLocal(CheckoutState.selectCategory(null)); // reset
    },
    onRequestClosePopupDiscountLocal: async () => {
      dispatchLocal(CheckoutState.visiblePopupDiscountLocal(false)); // reset
    },
    showModalDiscount: (appointmentId) => {
      if (_.isEmpty(connectionSignalR)) {
        const {
          subTotalLocal,
          discountTotalLocal,
          customDiscountPercentLocal,
          customDiscountFixedLocal,
        } = stateLocal || {};

        if (appointmentId !== -1) {
          const appointment = groupAppointment?.appointments?.find(
            (appointment) => appointment.appointmentId === appointmentId
          );
          const { services, products, extras, giftCards } = appointment;
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
      if (_.isEmpty(connectionSignalR)) {
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
      if (!_.isEmpty(connectionSignalR)) {
        connectionSignalR.stop();
      }

      if (payAppointmentId) {
        dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
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

      if (isCancelAppointment) {
        const app =
          groupAppointment?.appointments?.length > 0
            ? groupAppointment.appointments[0]
            : null;

        // Cancel appointment
        if (
          app &&
          groupAppointment?.appointments &&
          groupAppointment?.appointments.length === 1
        ) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const mainAppointmentId = groupAppointment?.mainAppointmentId
              ? groupAppointment.mainAppointmentId
              : 0;
            const customerId = customerInfoBuyAppointment.customerId
              ? customerInfoBuyAppointment.customerId
              : 0;
            dispatch(
              actions.appointment.cancleAppointment(
                mainAppointmentId,
                profile.merchantId,
                customerId
              )
            );
          }
        }

        // Book from calendar
        if (isBookingFromCalendar) {
          if (blockAppointments?.length > 0) {
            const app =
              blockAppointments?.length > 0 ? blockAppointments[0] : null;
            if (app && blockAppointments && blockAppointments?.length === 1) {
              if (
                app.services.length +
                  app.products.length +
                  app.giftCards.length ===
                0
              ) {
                const customerId = customerInfoBuyAppointment.customerId
                  ? customerInfoBuyAppointment.customerId
                  : 0;
                dispatch(
                  actions.appointment.cancleAppointment(
                    isOpenBlockAppointmentId,
                    profile.merchantId,
                    customerId
                  )
                );
              }
            }
          }

          if (
            groupAppointment?.appointments?.length > 0 &&
            appointmentIdBookingFromCalendar
          ) {
            const app =
              groupAppointment?.appointments?.length > 0
                ? groupAppointment.appointments[0]
                : null;

            const mainAppointmentId = groupAppointment?.mainAppointmentId
              ? groupAppointment.mainAppointmentId
              : 0;

            if (
              app &&
              groupAppointment?.appointments &&
              groupAppointment?.appointments.length === 1
            ) {
              if (
                app.services.length +
                  app.products.length +
                  app.giftCards.length ===
                0
              ) {
                const customerId = customerInfoBuyAppointment.customerId
                  ? customerInfoBuyAppointment.customerId
                  : 0;

                dispatch(
                  actions.appointment.cancleAppointment(
                    appointmentIdBookingFromCalendar,
                    profile.merchantId,
                    customerId
                  )
                );
              }
            }
          }
        }

        if (!isBookingFromCalendar && appointmentIdBookingFromCalendar == 0) {
          const app =
            groupAppointment?.appointments?.length > 0
              ? groupAppointment.appointments[0]
              : null;

          if (
            app &&
            groupAppointment?.appointments &&
            groupAppointment?.appointments.length === 1
          ) {
            if (
              app.services.length +
                app.products.length +
                app.giftCards.length ===
              0
            ) {
              const mainAppointmentId = groupAppointment?.mainAppointmentId
                ? groupAppointment.mainAppointmentId
                : 0;
              const customerId = customerInfoBuyAppointment.customerId
                ? customerInfoBuyAppointment.customerId
                : 0;

              dispatch(
                actions.appointment.cancleAppointment(
                  mainAppointmentId,
                  profile.merchantId,
                  customerId
                )
              );
            }
          }
        }

        if (isOpenBlockAppointmentId) {
          const app =
            blockAppointments?.length > 0 ? blockAppointments[0] : null;

          if (app && blockAppointments && blockAppointments?.length === 1) {
            if (
              app.services.length +
                app.products.length +
                app.giftCards.length ===
              0
            ) {
              const customerId = customerInfoBuyAppointment.customerId
                ? customerInfoBuyAppointment.customerId
                : 0;

              dispatch(
                actions.appointment.cancleAppointment(
                  isOpenBlockAppointmentId,
                  profile.merchantId,
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
        printerList,
        printerSelect
      );
      const { paymentSelected } = stateLocal;
      if (!_.isEmpty(connectionSignalR)) {
        connectionSignalR.stop();
      }

      dispatch(actions.appointment.closeModalPaymentCompleted());
    },
    donotPrintBill: async () => {
      // this.props.pushAppointmentIdOfflineIntoWebview();
      const { paymentSelected } = stateLocal;

      if (!_.isEmpty(connectionSignalR)) {
        connectionSignalR.stop();
      }

      if (paymentSelected === "Cash" || paymentSelected === "Other") {
        const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
          printerList,
          printerSelect
        );

        if (portName) {
          if (
            (paymentSelected === "Other" && profile?.isOpenCashier) ||
            paymentSelected === "Cash"
          ) {
            openCashDrawer(portName);
          }
          setIsPayment(false);
          dispatch(actions.appointment.closeModalPaymentCompleted());
          NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
          dispatch(actions.appointment.resetBasketEmpty());
          dispatchLocal(CheckoutState.resetState());
          dispatch(actions.appointment.resetPayment());
        } else {
          if (
            (paymentSelected === "Other" && profile?.isOpenCashier) ||
            paymentSelected === "Cash"
          ) {
            if (paymentMachineType == AppUtils.PaymentTerminalType.Clover) {
              _openCashDrawerClover();
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
    mainAppointmentId: groupAppointment?.mainAppointmentId || 0,

    // PopupProcessingCredit
    visibleProcessingCredit,
    cancelTransaction: () => {
      if (Platform.OS === "android") {
        PoslinkAndroid.cancelTransaction((data) => {});
      } else {
        if (paymentMachineType == "Clover") {
          if (isProcessPrintClover.current) {
            alert(i18n.t("PleaseWait"));
            return;
          }
        } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
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

        if (payAppointmentId) {
          dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
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

      if (blockAppointments?.length > 0) {
        _addGiftCardIntoBlockAppointment(code);
        return;
      }

      if (!_.isEmpty(groupAppointment)) {
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
        const method = getPaymentString(paymentSelected);
        const bodyAction = {
          merchantId: profile.merchantId,
          userId: customerInfoBuyAppointment?.userId || 0,
          status: "checkin",
          services: [],
          extras: [],
          products: [],
          fromTime: formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
          staffId: profileStaffLogin?.staffId || 0,
          customDiscountFixed: customDiscountFixedLocal,
          customDiscountPercent: customDiscountPercentLocal,
          firstName: customerInfoBuyAppointment?.firstName || "",
          lastName: customerInfoBuyAppointment?.lastName || "",
          phoneNumber: customerInfoBuyAppointment?.phone || "",
          customerId: customerInfoBuyAppointment?.customerId || 0,
        };
        const optionAction = {
          method: "POST",
          token: true,
          api: `${Configs.API_URL}appointment`,
          paymentMethod: method,
          isLoading: true,
          paidAmount: moneyUserGiveForStaff,
          creditCardInfo: false,
          merchantId: profile.merchantId,
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
    submitAddCustomService: async (params) => {
      await dispatchLocal(CheckoutState.setCustomService(params));
      setTimeout(_addAmount, 1000);
    },

    backAddBasket: () => {
      _cancelHarmonyPayment();
      // link to tab appointment
      NavigatorServices.navigate(ScreenName.SALON.APPOINTMENT);
    },
  };
};
