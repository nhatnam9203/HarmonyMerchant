import actions from "@actions";
import Configs from "@configs";
import PrintManager from "@lib/PrintManager";
import NavigationServices from "@navigators/NavigatorServices";
import { useGetAppointment } from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import {
  formatNumberFromCurrency,
  formatWithMoment,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getInfoFromModelNameOfPrinter,
} from "@utils";
import _ from "lodash";
import React from "react";
import { NativeModules, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsPayment } from "../../hooks";

const signalR = require("@microsoft/signalr");

const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;

const log = (obj, message = "") => {
  Logger.log(`[HomeOrderPayPage] ${message}`, obj);
};

export const useProps = ({
  params: { orderItem, appointmentId, screenId },
  navigation,
}) => {
  const basketRef = React.useRef(null);
  const customerRef = React.useRef(null);
  const modalBillRef = React.useRef(null);
  const popupSendLinkInstallRef = React.useRef(null);
  const popupEnterAmountGiftCardRef = React.useRef(null);
  const popupDiscountRef = React.useRef(null);
  const popupDiscountLocalRef = React.useRef(null);
  const activeGiftCardRef = React.useRef(null);
  const connectSignalR = React.useRef(null);
  const cashBackRef = React.useRef(null);
  const invoicePrintRef = React.useRef(null);

  const dispatch = useDispatch();
  const isPayment = useIsPayment();

  const isOfflineMode = useSelector((state) => state.network.isOfflineMode);
  const groupAppointment = useSelector(
    (state) => state.appointment.groupAppointment
  );
  const paymentDetailInfo = useSelector(
    (state) => state.appointment.paymentDetailInfo
  );
  const language = useSelector((state) => state.dataLocal.language);
  const profileStaffLogin = useSelector(
    (state) => state.dataLocal.profileStaffLogin
  );
  const profile = useSelector((state) => state.dataLocal.profile);
  const paxMachineInfo = useSelector((state) => state.hardware.paxMachineInfo);
  const token = useSelector((state) => state.dataLocal.token);
  const deviceId = useSelector((state) => state.dataLocal.deviceId);
  const customerInfoBuyAppointment = useSelector(
    (state) => state.appointment.customerInfoBuyAppointment
  );

  const payAppointmentId = useSelector(
    (state) => state.appointment.payAppointmentId
  );
  const appointmentIdOffline = useSelector(
    (state) => state.appointment.appointmentIdOffline
  );
  const isDonePayment = useSelector((state) => state.appointment.isDonePayment);
  const printerList = useSelector((state) => state.dataLocal.printerList);
  const printerSelect = useSelector((state) => state.dataLocal.printerSelect);
  const isCancelAppointment = useSelector(
    (state) => state.appointment.isCancelAppointment
  );
  const visiblePopupPaymentDetails = useSelector(
    (state) => state.appointment.visiblePopupPaymentDetails
  );
  const visibleConfirm = useSelector(
    (state) => state.appointment.visiblePopupPaymentConfirm
  );
  const visibleChangeMoney = useSelector(
    (state) => state.appointment.visibleChangeMoney
  );

  const [paymentSelected, setPaymentSelected] = React.useState("");
  const [visibleBillOfPayment, setVisibleBillOfPayment] = React.useState(false);
  const [changeButtonDone, setChangeButtonDone] = React.useState(false);
  const [subTotalLocal, setSubTotalLocal] = React.useState(0);
  const [tipLocal, setTipLocal] = React.useState(0);
  const [discountTotalLocal, setDiscountTotalLocal] = React.useState(0);
  const [taxLocal, setTaxLocal] = React.useState(0);
  const [customDiscountPercentLocal, setCustomDiscountPercentLocal] =
    React.useState(0);
  const [customDiscountFixedLocal, setCustomDiscountFixedLocal] =
    React.useState(0);
  const [customerInfoByPhone, setCustomerInfoByPhone] = React.useState({
    userId: 0,
  });
  const [visibleSendLinkPopup, setVisibleSendLinkPopup] = React.useState(false);
  const [isCancelHarmonyPay, setIsCancelHarmonyPay] = React.useState(false);
  const [visiblePopupDiscountLocal, setVisiblePopupDiscountLocal] =
    React.useState(false);

  const [infoUser, setInfoUser] = React.useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [staffIdOfline, setStaffIdOfline] = React.useState(0);
  const [fromTime, setFromTime] = React.useState("");
  const [basket, setBasket] = React.useState([]);
  const [visibleProcessingCredit, setVisibleProcessingCredit] =
    React.useState(false);
  const [visibleErrorMessageFromPax, setVisibleErrorMessageFromPax] =
    React.useState(false);

  const [errorMessageFromPax, setErrorMessageFromPax] = React.useState("");
  const [visibleScanCode, setVisibleScanCode] = React.useState(false);
  const [visiblePrintInvoice, setVisiblePrintInvoice] = React.useState(false);
  const [appointmentDetail, setAppointmentDetail] = React.useState(null);

  /** CALL API */
  const [appointment, getAppointment] = useGetAppointment();

  const onGoBack = () => {
    if (screenId) {
      NavigationServices.navigate(screenId, { reload: true });
    } else NavigationServices.navigate("retailer.home.order", { reload: true });
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

  const payBasket = async () => {
    const method = getPaymentString(paymentSelected);

    if (isOfflineMode && method === "harmony") {
      // this.scrollTabRef.current?.goToPage(2);
      // this.addAppointmentOfflineMode(true);
      return;
    }

    if (
      isOfflineMode &&
      (method === "credit_card" || method === "debit_card")
    ) {
      alert("Not Support Offline Mode");
      return;
    }

    if (method === "harmony" && _.isEmpty(groupAppointment)) {
      popupSendLinkInstallRef.current?.setStateFromParent("");
      setVisibleSendLinkPopup(true);
    } else {
      if (method === "harmony" || method === "credit_card") {
        const dueAmount = paymentDetailInfo?.dueAmount || 0;
        modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
      }
      await setVisibleBillOfPayment(true);

      // if (method === 'harmony' || method === 'credit_card') {
      //     const dueAmount = parseFloat(formatNumberFromCurrency(paymentDetailInfo?.dueAmount || 0));
      //     this.doneBill(dueAmount);
      // } else {
      //     await this.setState({
      //         visibleBillOfPayment: true
      //     });
      // }
    }
  };

  const cancelHarmonyPayment = async () => {
    await setChangeButtonDone(false);
    await setIsCancelHarmonyPay(false);
    await setPaymentSelected("");

    if (payAppointmentId) {
      dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
    }
    if (!_.isEmpty(connectSignalR.current)) {
      await connectSignalR.current?.stop();
    }
  };

  const onRequestCloseBillModal = async () => {
    setChangeButtonDone(false);
    setPaymentSelected("");
    setVisibleBillOfPayment(false);

    dispatch(actions.appointment.resetPayment());
  };

  const extractBill = () => {
    if (_.isEmpty(paymentDetailInfo)) {
      if (isOfflineMode) {
        const temptTotal = Number(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2);
        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      } else {
        const temptTotal = _.isEmpty(groupAppointment)
          ? Number(
              formatNumberFromCurrency(subTotalLocal) +
                formatNumberFromCurrency(tipLocal) +
                formatNumberFromCurrency(taxLocal) -
                formatNumberFromCurrency(discountTotalLocal)
            ).toFixed(2)
          : groupAppointment.total;

        modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      }
    } else {
      const totalExact = paymentDetailInfo?.dueAmount
        ? paymentDetailInfo.dueAmount
        : 0;

      modalBillRef.current?.setStateFromParent(`${totalExact}`);
    }
  };

  const getBasketOffline = () => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket.length; i++) {
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
          //staffId: selectedStaff?.staffId,
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
      // staffId: selectedStaff?.staffId,
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
      appointment.services.forEach((service) => {
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
      appointment.products.forEach((product) => {
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
      appointment.extras.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment.giftCards.forEach((gift) => {
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

  const addAppointmentOfflineMode = (isHarmonyOffline = false) => {
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
      setAppointmentOfflineMode(appointmentOfflineMode);
    } else {
      dispatch(
        actions.dataLocal.addAppointmentOfflineMode(appointmentOfflineMode)
      );
    }
  };

  const handlePaymentOffLineMode = async () => {
    const moneyUserGiveForStaff = parseFloat(
      formatNumberFromCurrency(modalBillRef.current?.state.quality)
    );
    const totalLocal = Number(
      formatNumberFromCurrency(subTotalLocal) +
        formatNumberFromCurrency(tipLocal) +
        formatNumberFromCurrency(taxLocal) -
        formatNumberFromCurrency(discountTotalLocal)
    ).toFixed(2);

    if (moneyUserGiveForStaff == 0) {
      alert("Enter amount!");
    } else if (moneyUserGiveForStaff - totalLocal < 0) {
      alert("Payment amount must be greater : " + totalLocal);
    } else {
      addAppointmentOfflineMode();
      setVisibleBillOfPayment(false);
      modalBillRef.current?.setStateFromParent(`0`);
      dispatch(actions.appointment.showModalPrintReceipt());
    }
  };

  const handleHarmonyPayment = async (checkoutPaymentInfo) => {
    setChangeButtonDone(false);
    setIsCancelHarmonyPay(false);
    setPaymentSelected("");

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

  // ------------ Signal R -------
  const setupSignalR = (
    profile,
    token,
    checkoutGroupId,
    deviceId,
    method,
    moneyUserGiveForStaff
  ) => {
    try {
      connectSignalR.current = new signalR.HubConnectionBuilder()
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

      connectSignalR.current.on("ListWaNotification", (data) => {
        const temptData = JSON.parse(data);
        if (
          temptData.data &&
          !_.isEmpty(temptData.data) &&
          temptData.data.isPaymentHarmony &&
          temptData.data.checkoutGroupId == checkoutGroupId
        ) {
          handleHarmonyPayment(temptData.data.checkoutPayment);
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

      connectSignalR.current.onclose(async (error) => {
        console.log(error);
        await dispatch(actions.appointment.resetConnectSignalR());
      });

      connectSignalR.current
        .start()
        .then(() => {
          try {
            dispatch(actions.app.stopLoadingApp());

            setIsCancelHarmonyPay(true);
            setChangeButtonDone(true);

            dispatch(
              actions.appointment.paymentAppointment(
                checkoutGroupId,
                method,
                moneyUserGiveForStaff
              )
            );

            // dispatch(
            //   actions.appointment.referenceConnectionSignalR(connection)
            // );
          } catch (error) {
            dispatch(actions.app.stopLoadingApp());
            setTimeout(() => {
              alert(error);
            }, 1000);
          }
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

  const handleResponseCreditCard = async (
    message,
    online,
    moneyUserGiveForStaff
  ) => {
    setVisibleProcessingCredit(false);

    try {
      const result = JSON.parse(message);
      const tempEnv = Configs.ENV;
      if (result.status == 0) {
        PosLink.cancelTransaction();
        if (payAppointmentId) {
          dispatch(
            actions.appointment.cancelHarmonyPayment(
              payAppointmentId,
              "transaction fail",
              result?.message
            )
          );
        }
        if (result.message === "ABORTED") {
          return;
        }
        setTimeout(() => {
          // alert(result.message);
          setVisibleErrorMessageFromPax(true);
          setErrorMessageFromPax(`${result.message}`);
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
          let method = getPaymentString(paymentSelected);

          if (online) {
            // ------ Payment with credit online card success ----
            // this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff, message, profile.merchantId);
            dispatch(
              actions.appointment.submitPaymentWithCreditCard(
                profile?.merchantId || 0,
                message,
                payAppointmentId,
                moneyUserGiveForStaff
              )
            );
          } else {
            // ------ Payment with credit offline card success ----
          }
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
          setVisibleErrorMessageFromPax(true);
          setErrorMessageFromPax(`${resultTxt}`);
        }, 300);
      }
    } catch (error) {}
  };

  const hanleCreditCardProcess = async (
    online = true,
    moneyUserGiveForStaff
  ) => {
    const { ip, port, timeout } = paxMachineInfo;
    const moneyCreditCard = Number(
      formatNumberFromCurrency(moneyUserGiveForStaff) * 100
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
            setChangeButtonDone(false);

            setTimeout(() => {
              alert(errorTrans.Code);
            }, 500);
          },
          (data) => {
            handleResponseCreditCard(data, online, moneyUserGiveForStaff);
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

  const doneBill = async (amountPayment = false) => {
    const moneyUserGiveForStaff =
      amountPayment !== false
        ? quality
        : parseFloat(
            formatNumberFromCurrency(modalBillRef.current?.state.quality)
          );

    const method = getPaymentString(paymentSelected);
    const total = groupAppointment.total
      ? parseFloat(formatNumberFromCurrency(groupAppointment.total))
      : 0;
    const dueAmount = paymentDetailInfo.dueAmount
      ? parseFloat(formatNumberFromCurrency(paymentDetailInfo.dueAmount))
      : 0;

    if (isOfflineMode) {
      handlePaymentOffLineMode();
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
          setupSignalR(
            profile,
            token,
            groupAppointment.checkoutGroupId,
            deviceId,
            method,
            moneyUserGiveForStaff
          );
        } else if (method === "credit_card" || method === "debit_card") {
          if (paxMachineInfo.isSetup) {
            if (moneyUserGiveForStaff == 0) {
              alert("Enter amount!");
            } else {
              hanleCreditCardProcess(true, moneyUserGiveForStaff);
            }
          } else {
            setTimeout(() => {
              alert("Please connect your Pax to take payment.");
            }, 300);
          }
        } else if (method === "giftcard") {
          setTimeout(() => {
            alert("giftcard");
          }, 500);
        } else {
          dispatch(
            actions.appointment.paymentAppointment(
              groupAppointment.checkoutGroupId,
              method,
              moneyUserGiveForStaff
            )
          );
        }
      } else {
        // ------ Handle Buy at store -------
        if (method === "credit_card" || method === "debit_card") {
          hanleCreditCardProcess(false, moneyUserGiveForStaff);
        } else if (method === "harmony") {
          popupSendLinkInstallRef.current?.setStateFromParent("");
          setVisibleSendLinkPopup(true);
        } else {
          // const dataAnymousAppoitment = this.getBasketOffline();
          // const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } = dataAnymousAppoitment;
          // this.props.actions.appointment.createAnymousAppointment(
          //     profile.merchantId,
          //     customerInfoBuyAppointment?.userId || 0,
          //     customerInfoBuyAppointment?.customerId || 0,
          //     // profileStaffLogin.staffId,
          //     this.state.selectedStaff?.staffId,
          //     arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
          //     customDiscountFixedLocal, customDiscountPercentLocal,
          //     customerInfoBuyAppointment?.firstName || "",
          //     customerInfoBuyAppointment?.lastName || "",
          //     customerInfoBuyAppointment?.phone || "",
          //     moneyUserGiveForStaff
          // );
        }
      }
    }
  };

  const cancelTransaction = async () => {
    if (Platform.OS === "android") {
      PoslinkAndroid.cancelTransaction((data) => {});
    } else {
      PosLink.cancelTransaction();
      if (payAppointmentId) {
        dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
      }
      setVisibleProcessingCredit(false);
      setChangeButtonDone(false);
    }
  };

  const sendLinkInstallApp = async () => {
    const phone = popupSendLinkInstallRef.current?.state.value;
    const codeAreaPhone = popupSendLinkInstallRef.current?.state.codeAreaPhone;

    if (phone.length > 6) {
      setVisibleSendLinkPopup(false);
      dispatch(actions.app.sendLinkInstallApp(`${codeAreaPhone}${phone}`));
    } else {
      alert("Phone is invalid !");
    }
  };

  const printTemptInvoice = async () => {
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName !== "") {
      showInvoicePrint(portName);
    } else {
      alert("Please connect to your printer! ");
    }
  };

  const checkStatusCashier = async () => {
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName) {
      openCashDrawer(portName);
    } else {
      alert("Please connect to your cash drawer.");
    }
  };

  const printBill = async () => {
    // this.pushAppointmentIdOfflineIntoWebview();

    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );
    if (portName) {
      if (!_.isEmpty(connectSignalR.current)) {
        await connectSignalR.current?.stop();
      }
      if (paymentSelected === "Cash" || paymentSelected === "Other") {
        openCashDrawer(portName);
      }
      showInvoicePrint(portName, false);
    } else {
      alert("Please connect to your printer!");
    }
  };

  const donotPrintBill = async () => {
    if (!_.isEmpty(connectSignalR.current)) {
      await connectSignalR.current?.stop();
    }
    if (paymentSelected === "Cash" || paymentSelected === "Other") {
      const { portName } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );

      if (portName) {
        openCashDrawer(portName);
        onGoBack();
        dispatch(actions.appointment.closeModalPaymentCompleted());
        // this.props.gotoAppoitmentScreen();
        dispatch(actions.appointment.resetBasketEmpty());
        // this.setState(initState);
        dispatch(actions.appointment.resetPayment());
      } else {
        onGoBack();
        dispatch(actions.appointment.closeModalPaymentCompleted());
        // this.props.gotoAppoitmentScreen();
        dispatch(actions.appointment.resetBasketEmpty());
        // this.setState(initState);
        dispatch(actions.appointment.resetPayment());

        setTimeout(() => {
          alert("Please connect to your cash drawer.");
        }, 700);
      }
    } else {
      onGoBack();
      dispatch(actions.appointment.closeModalPaymentCompleted());
      // this.props.gotoAppoitmentScreen();
      dispatch(actions.appointment.resetBasketEmpty());
      // this.setState(initState);
      dispatch(actions.appointment.resetPayment());
    }
  };

  const openCashDrawer = async (portName) => {
    await PrintManager.getInstance().openCashDrawer(portName);
  };

  const showInvoicePrint = async (printMachine, isTemptPrint = true) => {
    // -------- Pass data to Invoice --------
    // this.props.actions.appointment.closeModalPaymentCompleted();
    dispatch(actions.appointment.closeModalPaymentCompleted());

    const appointments = groupAppointment?.appointments || [];
    const {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    } = getBasketOnline(appointments);

    const baskets = isOfflineMode
      ? basket
      : arryaServicesBuy.concat(
          arrayExtrasBuy,
          arrayProductBuy,
          arrayGiftCards
        );
    const tipAmount = groupAppointment?.tipAmount || 0;
    const subTotal = groupAppointment?.subTotal || 0;
    const discount = groupAppointment?.discount || 0;
    const tax = groupAppointment?.tax || 0;
    const total = groupAppointment?.total || 0;

    const temptSubTotal = _.isEmpty(groupAppointment)
      ? subTotalLocal
      : subTotal;
    const temptTotal = _.isEmpty(groupAppointment)
      ? Number(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2)
      : total;
    const temptDiscount = _.isEmpty(groupAppointment)
      ? discountTotalLocal
      : discount;
    const temptTip = _.isEmpty(groupAppointment) ? tipLocal : tipAmount;
    const temptTax = _.isEmpty(groupAppointment) ? taxLocal : tax;

    invoicePrintRef.current?.setStateFromParent(
      baskets,
      temptSubTotal,
      temptTax,
      temptDiscount,
      temptTip,
      temptTotal,
      paymentSelected,
      isTemptPrint,
      printMachine,
      promotionNotes.join(",")
    );
    await setVisiblePrintInvoice(true);
  };

  React.useEffect(() => {
    if (orderItem?.appointmentId) {
      setAppointmentDetail(orderItem);
      dispatch(
        actions.appointment?.getGroupAppointmentById(
          orderItem?.appointmentId,
          true,
          false,
          false
        )
      );
    }
  }, [orderItem]);

  React.useEffect(() => {
    if (appointmentId) {
      getAppointment(appointmentId);

      dispatch(
        actions.appointment?.getGroupAppointmentById(
          appointmentId,
          true,
          false,
          false
        )
      );
    }
  }, [appointmentId]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointment || {};
    if (statusSuccess(codeStatus)) {
      setAppointmentDetail(data);

      // customerRef.current?.setCustomer(data?.customer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment]);

  // React.useEffect(() => {
  //   return () => {
  //     if (connectSignalR.current) {
  //       connectSignalR.current.stop();
  //     }
  //   };
  // }, []);

  return {
    customerRef,
    basketRef,
    onHadSubmitted: () => {},
    onGoBack: () => {
      if (isPayment) {
        dispatch({
          type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
          payload: { visible: true, func: null },
        });
      } else {
        onGoBack();
      }
    },
    selectedPayment: (title) => {
      if (
        changeButtonDone &&
        !isDonePayment &&
        paymentSelected === "HarmonyPay"
      ) {
      } else {
        setPaymentSelected(title);
        if (title === "Gift Card") {
          activeGiftCardRef.current?.setStateFromParent();
          dispatch(actions.appointment.handleVisibleActiveGiftCard());
        }
      }
    },
    paymentSelected: paymentSelected,
    orderItem: appointmentDetail,
    modalBillRef,
    language,
    visibleBillOfPayment,
    onRequestCloseBillModal,
    extractBill,
    doneBill,
    popupSendLinkInstallRef,
    cancelHarmonyPayment,
    payBasket,
    visibleProcessingCredit,
    cancelTransaction,
    changeButtonDone,
    isDonePayment,
    isCancelHarmonyPay,
    groupAppointment,
    basket,
    visibleSendLinkPopup,
    setVisibleSendLinkPopup,
    sendLinkInstallApp,
    donotPrintBill,
    printBill,
    popupEnterAmountGiftCardRef,
    navigation,
    popupDiscountRef,
    visiblePopupDiscountLocal,
    popupDiscountLocalRef,
    onRequestClosePopupDiscountLocal: () => {
      setVisiblePopupDiscountLocal(false);
    },
    callbackDiscountToParent: () => {},
    onDiscountAdd: () => {
      if (_.isEmpty(connectSignalR.current)) {
        if (appointmentDetail?.appointmentId !== -1) {
          const appointment = groupAppointment.appointments.find(
            (appointment) =>
              appointment.appointmentId === appointmentDetail?.appointmentId
          );

          const { services, products, extras, giftCards } = appointment;
          const arrayProducts = getArrayProductsFromAppointment(products);
          const arryaServices = getArrayServicesFromAppointment(services);
          const arrayExtras = getArrayExtrasFromAppointment(extras);
          const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);

          const temptBasket = arrayProducts.concat(
            arryaServices,
            arrayExtras,
            arrayGiftCards
          );

          if (temptBasket.length > 0) {
            dispatch(
              actions.marketing.getPromotionByAppointment(
                appointmentDetail?.appointmentId
              )
            );
          }
        } else {
          // ----------- Offline ------------
          popupDiscountLocalRef.current?.setStateFromParent(
            subTotalLocal,
            discountTotalLocal,
            customDiscountPercentLocal,
            customDiscountFixedLocal
          );

          setVisiblePopupDiscountLocal(true);
        }
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    titleExitCheckoutTab: isCancelAppointment
      ? "The appointment will be canceled if you do not complete your payment. Are you sure you want to exit Check-out? "
      : "Are you sure you want to exit Check-Out?",
    clearDataConfirm: () => {
      if (!_.isEmpty(connectSignalR.current)) {
        connectSignalR.current?.stop();
      }

      if (payAppointmentId) {
        dispatch(actions.appointment.cancelHarmonyPayment(payAppointmentId));
      }

      dispatch(actions.appointment.resetBasketEmpty());
      dispatch(actions.appointment.resetPayment());
      dispatch(actions.appointment.changeFlagSigninAppointment(false));
      dispatch(actions.appointment.resetGroupAppointment());

      onGoBack();
      if (visibleConfirm?.func && typeof visibleConfirm?.func === "function") {
        visibleConfirm?.func();
      }

      dispatch({
        type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
        payload: { visible: false, func: null },
      });
    },
    visibleConfirm: visibleConfirm?.visible ?? false,
    setVisibleConfirm: () => {
      dispatch({
        type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
        payload: { visible: false, func: null },
      });
    },
    activeGiftCardRef,
    submitSerialCode: (code) => {},
    closePopupActiveGiftCard: async () => {
      dispatch(actions.appointment.handleVisibleActiveGiftCard(false));
    },
    visiblePopupPaymentDetails,
    closePopupProductPaymentDetails: () => {
      setVisiblePopupPaymentDetails(false);
    },
    nextPayment: () => {
      setVisiblePopupPaymentDetails(false);
    },
    visibleErrorMessageFromPax,
    errorMessageFromPax,
    setVisibleErrorMessageFromPax,
    cashBackRef,
    setVisibleChangeMoney: () => {},
    doneBillByCash: () => {
      if (isOfflineMode) {
        dispatch(actions.appointment.showModalPrintReceipt());
      } else {
        const temptAppointmentId = _.isEmpty(appointmentDetail)
          ? appointmentIdOffline
          : appointmentDetail.appointmentId;

        dispatch(actions.appointment.checkoutSubmit(temptAppointmentId));
        dispatch(actions.appointment.showModalPrintReceipt());
      }
    },
    visibleScanCode,
    onRequestCloseScanCode: () => {
      setVisibleScanCode(false);
    },
    resultScanCode: async (e) => {
      setVisibleScanCode(false);
      const tempDate = {
        ...appointmentOfflineMode,
        paymentTransactionId: e.data,
      };

      dispatch(actions.dataLocal.addAppointmentOfflineMode(tempDate));
      dispatch(actions.appointment.showModalPrintReceipt());
    },
    confimPayOfflinemode: () => {
      setVisibleScanCode(true);
    },
    invoicePrintRef,
    visiblePrintInvoice,
    printTemptInvoice,
    checkStatusCashier,
    cancelInvoicePrint: async (isPrintTempt) => {
      setVisiblePrintInvoice(false);
      if (!isPrintTempt) {
        onGoBack();
        dispatch(actions.appointment.resetBasketEmpty());
        dispatch(actions.appointment.resetPayment());
      }
    },
  };
};
