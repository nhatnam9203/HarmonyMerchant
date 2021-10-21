import actions from "@actions";
import Configs from "@configs";
import PrintManager from "@lib/PrintManager";
import NavigationServices from "@navigators/NavigatorServices";
import { basketRetailer } from "@redux/slices";
import {
  useGetAppointment,
  useUpdateAppointmentTax,
} from "@shared/services/api/retailer";
import { statusSuccess } from "@shared/utils";
import {
  formatNumberFromCurrency,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getInfoFromModelNameOfPrinter,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  PaymentTerminalType,
  requestTransactionDejavoo,
  stringIsEmptyOrWhiteSpaces,
} from "@utils";
import _ from "lodash";
import React from "react";
import { NativeModules, Platform, NativeEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsPayment } from "../../hooks";
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import { captureRef, releaseCapture } from "react-native-view-shot";
import configureStore from "../../../../redux/store";
import { parseString } from "react-native-xml2js";


const signalR = require("@microsoft/signalr");

const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;
const { persistor, store } = configureStore();

export const useProps = ({
  params: { orderItem, appointmentId, screenId, backScreenId },
  navigation,
}) => {
  const dispatch = useDispatch();

  const basketRef = React.useRef(null);
  const customerRef = React.useRef(null);
  const modalBillRef = React.useRef(null);
  const popupSendLinkInstallRef = React.useRef(null);
  const popupEnterAmountGiftCardRef = React.useRef(null);
  const popupDiscountRef = React.useRef(null);
  const popupDiscountItemRef = React.useRef(null);
  const popupDiscountLocalRef = React.useRef(null);
  const activeGiftCardRef = React.useRef(null);
  const connectSignalR = React.useRef(null);
  const cashBackRef = React.useRef(null);
  const changeTipRef = React.useRef(null);
  const invoiceRef = React.useRef(null);
  

   //ADD LISTENER FROM CLOVER MODULE
   let eventEmitter = new NativeEventEmitter(clover);
   let subscriptions = []

  const groupAppointment = useSelector(
    (state) => state.appointment.groupAppointment
  );
  const paymentDetailInfo = useSelector(
    (state) => state.appointment.paymentDetailInfo
  );
  const language = useSelector((state) => state.dataLocal.language);
  const profile = useSelector((state) => state.dataLocal.profile);
  const paxMachineInfo = useSelector((state) => state.hardware.paxMachineInfo);
  const token = useSelector((state) => state.dataLocal.token);
  const deviceId = useSelector((state) => state.dataLocal.deviceId);
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
  const isTipOnPaxMachine = useSelector(
    (state) => state.dataLocal.isTipOnPaxMachine
  );
  const paymentMachineType = useSelector(
    (state) => state.hardware.paymentMachineType
  );
  const cloverMachineInfo = useSelector(
    (state) => state.hardware.cloverMachineInfo
  );

  const [isTax, setIsTax] = React.useState(false);
  const [isGetResponsePaymentPax, setIsGetResponsePaymentPax] =
    React.useState(false);
  const [moneyUserGiveForStaff, setMoneyUserGiveForStaff] = React.useState(0);
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
  const [visibleSendLinkPopup, setVisibleSendLinkPopup] = React.useState(false);
  const [isCancelHarmonyPay, setIsCancelHarmonyPay] = React.useState(false);
  const [visiblePopupDiscountLocal, setVisiblePopupDiscountLocal] =
    React.useState(false);
  const [basket, setBasket] = React.useState([]);
  const [visibleProcessingCredit, setVisibleProcessingCredit] =
    React.useState(false);
  const [visibleConfirmPayment, setVisibleConfirmPayment] = React.useState(false);
  const [visibleErrorMessageFromPax, setVisibleErrorMessageFromPax] =
    React.useState(false);
  const [visibleChangeTip, setVisibleChangeTip] = React.useState(false);
  const [errorMessageFromPax, setErrorMessageFromPax] = React.useState("");
  const [visibleScanCode, setVisibleScanCode] = React.useState(false);
  const [appointmentDetail, setAppointmentDetail] = React.useState(null);
  const startProcessingPax = useSelector(
    (state) => state.appointment.startProcessingPax
  );

  const handleResponseCreditCardForCloverSuccess = async (message) => {
    setVisibleProcessingCredit(false)
    const { hardware, dataLocal, appointment } = store.getState();
    const { cloverMachineInfo } = hardware;
    const { profile } = dataLocal;
    const { payAppointmentId, amountCredtitForSubmitToServer } = appointment;
    let messageUpdate = {...message,
                sn: _.get(cloverMachineInfo, 'serialNumber')}
    try {
      dispatch(
        actions.appointment.submitPaymentWithCreditCard(
          profile?.merchantId || 0,
          messageUpdate,
          payAppointmentId,
          amountCredtitForSubmitToServer,
          'clover'
        )
      );
    } catch (error) {}
  }

  const handleResponseCreditCardForCloverFailed = async (errorMessage) => {
    const { appointment } = store.getState();
    const { payAppointmentId } = appointment;

    setVisibleProcessingCredit(false)
    try {
      if (payAppointmentId) {
        dispatch(actions.appointment.cancelHarmonyPayment(
          payAppointmentId,
          "transaction fail",
          errorMessage
        ));
      }
     
      setTimeout(() => {
        setErrorMessageFromPax(errorMessage)
        setVisibleErrorMessageFromPax(true)
      }, 300);
    } catch (error) {}
  }

  const registerEvents = () => {
    clover.changeListenerStatus(true)
    subscriptions = [
        eventEmitter.addListener('paymentSuccess', data => {
        dispatch(actions.appointment.isProcessPaymentClover(false))
        handleResponseCreditCardForCloverSuccess(data)
      }),
      eventEmitter.addListener('paymentFail', data => {
        dispatch(actions.appointment.isProcessPaymentClover(false))
        handleResponseCreditCardForCloverFailed(_.get(data, 'errorMessage'))
        
       }),
      eventEmitter.addListener('pairingCode', data => {
        if(data){
          const text = `Pairing code: ${_.get(data, 'pairingCode')}`
          const { appointment } = store.getState();
          const { isProcessPaymentClover } = appointment;

          if(isProcessPaymentClover) {
            setVisibleProcessingCredit(false);
          }
          setVisiblePrintInvoice(false)
        }
      }),
      eventEmitter.addListener('pairingSuccess', data => {
        dispatch(actions.hardware.setCloverToken(
          _.get(data, 'token')
        ));
    
        const { appointment } = store.getState();
        const { isProcessPaymentClover } = appointment;
        if(isProcessPaymentClover) {
          setVisibleProcessingCredit(true);
        }
       
      }),

      eventEmitter.addListener('confirmPayment', () => {
        setVisibleProcessingCredit(false);
        setVisibleConfirmPayment(true);
      }),
      eventEmitter.addListener('printInProcess', () => {
        
        
      }),

      eventEmitter.addListener('deviceDisconnected', () => {
        const { appointment } = store.getState();
        const { isProcessPaymentClover } = appointment;
        if(isProcessPaymentClover) {
          isProcessPaymentClover = false
          handleResponseCreditCardForCloverFailed("No connected device")
        }
        setVisiblePrintInvoice(false)
      }),
    ]
  }

  const unregisterEvents = () => {
    clover.changeListenerStatus(false)
    subscriptions.forEach(e => e.remove())
    subscriptions = []
  }

  React.useEffect(() => {
    registerEvents()

    return function cleanup() {
      unregisterEvents();
    };
  }, []);

  React.useEffect(() => {
    if (startProcessingPax) {
      dispatch(actions.appointment.resetStateCheckCreditPaymentToServer(false));
      if( paymentMachineType == PaymentTerminalType.Clover){
        setIsGetResponsePaymentPax(false);
        setVisibleProcessingCredit(true);
        const moneyCreditCard = Number(
          formatNumberFromCurrency(moneyUserGiveForStaff) * 100
        ).toFixed(2);
        const port = _.get(cloverMachineInfo, 'port') ? _.get(cloverMachineInfo, 'port') : 80
        const url = `wss://${_.get(cloverMachineInfo, 'ip')}:${port}/remote_pay`

        dispatch(actions.appointment.isProcessPaymentClover(true));

        setVisibleProcessingCredit(true)
        
        clover.sendTransaction({
          url,
          remoteAppId: REMOTE_APP_ID,
          appName: APP_NAME,
          posSerial: POS_SERIAL,
          token: _.get(cloverMachineInfo, 'token') ? _.get(cloverMachineInfo, 'token', '') : "",
          tipMode: isTipOnPaxMachine ? 'ON_SCREEN_BEFORE_PAYMENT' : 'NO_TIP',
          amount: `${parseFloat(moneyCreditCard)}`,
          externalId: `${payAppointmentId}`
        })
      } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
        setVisibleProcessingCredit(true)
       
        const tenderType = paymentSelected === "Credit Card" ? "Credit" : "Debit";
    
        const parameter = {
          tenderType: tenderType,
          transType: "Sale",
          amount: Number(moneyUserGiveForStaff).toFixed(2),
          RefId: payAppointmentId,
          invNum: `${groupAppointment?.checkoutGroupId || 0}`,
        };
        requestTransactionDejavoo(parameter).then((responses) => {
          handleResponseCreditCardDejavoo(
            responses,
            true,
            moneyUserGiveForStaff,
            parameter
          );
        })
        
      } else {
        //send by Pax
        sendTransactionIOS();
      }
    }
  }, [startProcessingPax]);

  /** CALL API */
  const [appointmentGet, getAppointment] = useGetAppointment();
  const [updateAppointmentTaxData, updateAppointmentTax] =
    useUpdateAppointmentTax();

  const onCompleteBack = async () => {
    if (screenId && screenId !== "retailer.home.order.check_out") {
      NavigationServices.navigate(screenId, {
        reload: true,
      });
    } else
      NavigationServices.navigate("retailer.home.order", {
        reload: true,
      });
  };

  const handleResponseCreditCardDejavoo = async (
    message,
    online,
    moneyUserGiveForStaff,
    parameter
  ) =>  {
    setVisibleProcessingCredit(false)
    
    try {
      parseString(message, (err, result) => {
        if (err || _.get(result, 'xmp.response.0.ResultCode.0') != 0) {
          let detailMessage = _.get(result, 'xmp.response.0.RespMSG.0', "").replace(/%20/g, " ")
          detailMessage = !stringIsEmptyOrWhiteSpaces(detailMessage) ? `: ${detailMessage}` : detailMessage
          
          const resultTxt = `${_.get(result, 'xmp.response.0.Message.0')}${detailMessage}`
                            || "Transaction failed";
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
        } else {
          const SN = _.get(result, 'xmp.response.0.SN.0');
          if(!stringIsEmptyOrWhiteSpaces(SN)){
            dispatch(actions.hardware.setDejavooMachineSN(SN));
          }
          dispatch(actions.appointment.submitPaymentWithCreditCard(
            profile?.merchantId || 0,
            message,
            payAppointmentId,
            moneyUserGiveForStaff,
            "dejavoo",
            parameter
          ));
        }
      });
       
      
    } catch (error) {}
  }

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

    if (method === "harmony" && _.isEmpty(groupAppointment)) {
      popupSendLinkInstallRef.current?.setStateFromParent("");
      setVisibleSendLinkPopup(true);
    } else {
      if (method === "harmony" || method === "credit_card") {
        const dueAmount = paymentDetailInfo?.dueAmount || 0;
        modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
      }
      await setVisibleBillOfPayment(true);
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
      const temptTotal = _.isEmpty(groupAppointment)
        ? Number(
            formatNumberFromCurrency(subTotalLocal) +
              formatNumberFromCurrency(tipLocal) +
              formatNumberFromCurrency(taxLocal) -
              formatNumberFromCurrency(discountTotalLocal)
          ).toFixed(2)
        : groupAppointment.total;

      modalBillRef.current?.setStateFromParent(`${temptTotal}`);
    } else {
      const totalExact = paymentDetailInfo?.dueAmount
        ? paymentDetailInfo.dueAmount
        : 0;

      modalBillRef.current?.setStateFromParent(`${totalExact}`);
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
                moneyUserGiveForStaff,
                "pax"
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

  const sendTransactionIOS = () => {
    setIsGetResponsePaymentPax(false);
    setVisibleProcessingCredit(true);
    const moneyCreditCard = Number(
      formatNumberFromCurrency(moneyUserGiveForStaff) * 100
    ).toFixed(2);
    const { ip, port, commType, bluetoothAddr } = paxMachineInfo;
    const tenderType = paymentSelected === "Credit Card" ? "CREDIT" : "DEBIT";
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
        invNum: `${groupAppointment?.checkoutGroupId || 0}`,
      },
      (message) => {
        setIsGetResponsePaymentPax(true);
        handleResponseCreditCard(message, true, moneyUserGiveForStaff);
      }
    );
  };

  const doneBill = async (amountPayment = false) => {
    const moneyUserGiveForStaff =
      amountPayment !== false
        ? quality
        : parseFloat(
            formatNumberFromCurrency(modalBillRef.current?.state.quality)
          );
    setMoneyUserGiveForStaff(moneyUserGiveForStaff);

    const method = getPaymentString(paymentSelected);
    const total = groupAppointment.total
      ? parseFloat(formatNumberFromCurrency(groupAppointment.total))
      : 0;
    const dueAmount = paymentDetailInfo.dueAmount
      ? parseFloat(formatNumberFromCurrency(paymentDetailInfo.dueAmount))
      : 0;

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
      if (!isGetResponsePaymentPax) {
        alert("Please wait!");
        return;
      }
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
    showInvoicePrint(true);
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
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (!_.isEmpty(connectSignalR.current)) {
      await connectSignalR.current?.stop();
    }

    if (paymentMachineType !== "Clover" && !portName) {
      alert("Please connect to your printer!");
    } else {
      if (paymentSelected === "Cash" || paymentSelected === "Other") {
        if (paymentMachineType === "Clover") {
          openCashDrawerClover();
        } else {
          openCashDrawer(portName);
        }
      }
      showInvoicePrint(false);
    }
  };

  const openCashDrawerClover = () => {
    const port = _.get(cloverMachineInfo, "port")
      ? _.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${_.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

    clover.openCashDrawer({
      url,
      remoteAppId: REMOTE_APP_ID,
      appName: APP_NAME,
      posSerial: POS_SERIAL,
      token: _.get(cloverMachineInfo, "token")
        ? _.get(cloverMachineInfo, "token", "")
        : "",
    });
  }

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
        dispatch(actions.appointment.closeModalPaymentCompleted());
        dispatch(actions.appointment.resetBasketEmpty());
        dispatch(actions.appointment.resetPayment());
      } else {
        dispatch(actions.appointment.closeModalPaymentCompleted());
        dispatch(actions.appointment.resetBasketEmpty());
        dispatch(actions.appointment.resetPayment());

        setTimeout(() => {
          alert("Please connect to your cash drawer.");
        }, 700);
      }
    } else {
      dispatch(actions.appointment.closeModalPaymentCompleted());
      dispatch(actions.appointment.resetBasketEmpty());
      dispatch(actions.appointment.resetPayment());
    }

    await dispatch(basketRetailer.clearBasket());
    onCompleteBack();
  };

  openCashDrawer = async () => {
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName) {
      await PrintManager.getInstance().openCashDrawer(portName);
    } else {
      setTimeout(() => {
        alert("Please connect to your cash drawer.");
      }, 700);
    }
  };

  const showInvoicePrint = async (isTemptPrint = true) => {
    // -------- Pass data to Invoice --------
    // this.props.actions.appointment.closeModalPaymentCompleted();
    dispatch(actions.appointment.closeModalPaymentCompleted());

    invoiceRef.current?.showAppointmentReceipt({
      appointmentId: groupAppointment?.mainAppointmentId,
      checkoutId: paymentDetailInfo?.invoiceNo,
      isPrintTempt: isTemptPrint,
      machineType: paymentMachineType,
    });
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
      setIsTax(_.get(orderItem, "isTax"));
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
    const { codeStatus, message, data } = appointmentGet || {};
    if (statusSuccess(codeStatus)) {
      setAppointmentDetail(data);
      dispatch(basketRetailer.setAppointment(data));
      setIsTax(_.get(data, "isTax"));
      // customerRef.current?.setCustomer(data?.customer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentGet]);

  React.useEffect(() => {
    const { codeStatus } = updateAppointmentTaxData || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentDetail?.appointmentId);
      dispatch(
        actions.appointment?.getGroupAppointmentById(
          appointmentDetail?.appointmentId,
          true,
          false,
          false
        )
      );
    }
  }, [updateAppointmentTaxData]);

  return {
    customerRef,
    basketRef,
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
    popupDiscountItemRef,
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
          console.log(appointment);
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
    popupConfirmOnRequestClose: () => {
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

      if (visibleConfirm?.func && typeof visibleConfirm?.func === "function") {
        visibleConfirm?.func();
      }

      dispatch({
        type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
        payload: { visible: false, func: null },
      });

      NavigationServices.navigate("retailer.home.order.check_out", {
        purchasePoint: appointmentDetail?.purchasePoint,
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
    submitSerialCode: (code) => {
      console.log(paymentSelected);
      if (groupAppointment) {
        if (paymentSelected === "Gift Card") {
          dispatch(
            actions.appointment.checkSerialNumber(code, false, false, true)
          );
        }
      }
    },
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
      const temptAppointmentId = _.isEmpty(appointmentDetail)
        ? appointmentIdOffline
        : appointmentDetail.appointmentId;

      dispatch(actions.appointment.checkoutSubmit(temptAppointmentId));
      dispatch(actions.appointment.showModalPrintReceipt());
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

      dispatch(actions.appointment.showModalPrintReceipt());
    },
    confimPayOfflinemode: () => {
      setVisibleScanCode(true);
    },
    printTemptInvoice,
    checkStatusCashier,
    cancelInvoicePrint: async (isPrintTempt) => {
      if (!isPrintTempt) {
        dispatch(actions.appointment.resetBasketEmpty());
        dispatch(actions.appointment.resetPayment());
        await dispatch(basketRetailer.clearBasket());

        onCompleteBack();
      }
    },
    finishedHandle: () => {
      onCompleteBack();
    },
    changeTipRef,
    visibleChangeTip,
    setVisibleChangeTip,
    onTipAdd: () => {
      const temptTip =
        !appointmentDetail || _.isEmpty(appointmentDetail)
          ? tipLocal
          : appointmentDetail?.tipAmount;
      const subTotal = appointmentDetail?.subTotal || 0;
      const tipPercent = appointmentDetail?.tipPercent || 0;
      const appointmentID = _.isEmpty(groupAppointment)
        ? -1
        : appointmentDetail.appointmentId;

      if (_.isEmpty(connectSignalR.current)) {
        changeTipRef.current?.setStateFromParent(
          appointmentID,
          temptTip ?? 0,
          subTotal,
          tipPercent
        );

        setVisibleChangeTip(true);
      } else {
        alert("You are paying by Harmony Payment!");
      }
    },
    switchTax: () => {
      const appointmentID = _.isEmpty(groupAppointment)
        ? -1
        : appointmentDetail.appointmentId;
      const isTaxUpdate = !isTax;
      setIsTax(isTaxUpdate);
      updateAppointmentTax(isTaxUpdate, appointmentID);
    },
    isTax,
    onDiscountItemAdd: (item) => {
      dispatch(
        actions.marketing.getPromotionByAppointment(
          appointmentDetail?.appointmentId,
          false,
          true
        )
      );
      dispatch(actions.marketing.setAppointmentItem(item));
    },
    onGoBackOrderList: async () => {
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

      if (visibleConfirm?.func && typeof visibleConfirm?.func === "function") {
        visibleConfirm?.func();
      }

      dispatch({
        type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
        payload: { visible: false, func: null },
      });

      dispatch(basketRetailer.clearBasket());

      if (screenId && screenId !== "retailer.home.order.check_out") {
        NavigationServices.navigate(screenId, {
          reload: true,
        });
      } else {
        NavigationServices.navigate("retailer.home.order", {
          reload: true,
        });
      }
    },
    onGoBackCheckOut: async () => {
      dispatch({
        type: "VISIBLE_POPUP_PAYMENT_CONFIRM",
        payload: { visible: true, func: null },
      });
    },
    cancelGiftCardPayment: () => {
      dispatch(actions.appointment.togglePopupGiftCardPaymentDetail(false));
      setPaymentSelected("");
    },
    visibleConfirmPayment,
    setVisibleConfirmPayment: () => {
      setVisibleConfirmPayment(false)
    },
    confirmPaymentClover: () => {
      clover.confirmPayment()
      setVisibleProcessingCredit(true)
      setVisibleConfirmPayment(false)
    },
    rejectPaymentClover: () => {
      clover.rejectPayment()
      setVisibleConfirmPayment(false)
    },
    doPrintClover: (imageUri) => {
      const port = _.get(cloverMachineInfo, 'port') ? _.get(cloverMachineInfo, 'port') : 80
      const url = `wss://${_.get(cloverMachineInfo, 'ip')}:${port}/remote_pay`
      
      const printInfo = {
        imageUri,
        url,
        remoteAppId: REMOTE_APP_ID,
        appName: APP_NAME,
        posSerial: POS_SERIAL,
        token: _.get(cloverMachineInfo, 'token') ? _.get(cloverMachineInfo, 'token', '') : "",
      }
      clover.doPrintWithConnect(printInfo)
    },
    shareTemptInvoice: async () => {
      await invoiceRef.current?.showAppointmentReceipt({
        appointmentId: groupAppointment?.mainAppointmentId,
        isShareMode: true,
        isPrintTempt: false,
      });
    },
    invoiceRef,
  };
};
