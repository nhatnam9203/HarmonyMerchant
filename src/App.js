import actions from "@actions";
import { FirebaseNotificationProvider } from "@firebase";
import { proccessingSettlement } from "@utils";
import * as l from "lodash";
import React from "react";
import { NativeEventEmitter, NativeModules, View } from "react-native";
import codePush from "react-native-code-push";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import {
  PopupConnected,
  PopupDisconnected,
  PopupInfomationCodePush,
  PopupPairingCode,
} from "./components";
import { RootNavigator } from "./navigators/RootNavigator";
import configureStore from "./redux/store";
import { AppStateProvider } from "./shared/providers/AppStateProvider";
import { AxiosApiProvider } from "./shared/providers/AxiosApiProvider";
import { CodePushProvider } from "./shared/providers/CodePushProvider";
import "./shared/services/api/axiosClient";
import "./shared/services/translation";
import { isDevelopmentMode } from "./shared/utils/app";

const { clover } = NativeModules;
const { persistor, store } = configureStore();

if (isDevelopmentMode) {
  import("../ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

const App: () => React$Node = () => {
  //ADD LISTENER FROM CLOVER MODULE
  let eventEmitter = new NativeEventEmitter(clover);
  let subscriptions = [];

  const [visiblePopupParingCode, setVisiblePopupParingCode] =
    React.useState(false);
  const [pairingCode, setPairingCode] = React.useState("");

  const registerEvents = () => {
    clover.changeListenerStatus(true);
    subscriptions = [
      eventEmitter.addListener("closeoutSuccess", (data) => {
        const { invoice, hardware } = store.getState();
        const { cloverMachineInfo, paymentMachineType } = hardware;
        const terminalID = l.get(cloverMachineInfo, "serialNumber");
        if (
          paymentMachineType == "Clover" &&
          l.get(invoice, "isProcessAutoCloseBatch")
        ) {
          store.dispatch(actions.invoice.autoCloseBatchResponse());
          setTimeout(
            () =>
              proccessingSettlement(
                "[]",
                l.get(invoice, "settleWaiting"),
                terminalID,
                true
              ),
            200
          );
        }
      }),
      eventEmitter.addListener("closeoutFail", (data) => {
        const { invoice, hardware } = store.getState();
        const { paymentMachineType } = hardware;
        if (
          paymentMachineType == "Clover" &&
          l.get(invoice, "isProcessAutoCloseBatch")
        ) {
          store.dispatch(actions.invoice.autoCloseBatchResponse());
        }
      }),

      eventEmitter.addListener("pairingCode", (data) => {
        if (data) {
          const { invoice, hardware } = store.getState();
          const { paymentMachineType } = hardware;
          const text = `Pairing code: ${l.get(data, "pairingCode")}`;
          if (paymentMachineType == "Clover") {
            setVisiblePopupParingCode(true);
            setPairingCode(text);
          }
        }
      }),
      eventEmitter.addListener("pairingSuccess", (data) => {
        const { invoice, hardware } = store.getState();
        const { paymentMachineType } = hardware;
        store.dispatch(actions.hardware.setCloverToken(l.get(data, "token")));
        if (paymentMachineType == "Clover") {
          setVisiblePopupParingCode(false);
          setPairingCode("");
        }
      }),
    ];
  };

  const unregisterEvents = () => {
    clover.changeListenerStatus(false);
    subscriptions.forEach((e) => e.remove());
    subscriptions = [];
  };

  React.useEffect(() => {
    SplashScreen.hide();

    registerEvents();

    return function cleanup() {
      unregisterEvents();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<View />} persistor={persistor}>
        <CodePushProvider>
          <AppStateProvider>
            <AxiosApiProvider>
              <RootNavigator />
              <PopupDisconnected />
              <PopupConnected />
              <FirebaseNotificationProvider />
              <PopupInfomationCodePush />
              <PopupPairingCode
                visible={visiblePopupParingCode ? true : false}
                message={pairingCode}
              />
            </AxiosApiProvider>
          </AppStateProvider>
        </CodePushProvider>
      </PersistGate>
    </Provider>
  );
};

// export const handleAutoClose = async () => {
//   const { dataLocal, hardware } = store.getState();
//   const { paxMachineInfo, cloverMachineInfo, paymentMachineType } = hardware;
//   const { token, deviceId, deviceName } = dataLocal;
//   const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
//     paxMachineInfo;

//   if(paymentMachineType == "Clover" && l.get(cloverMachineInfo, "isSetup")){
//     //Clover
//     const terminalID = l.get(cloverMachineInfo, 'serialNumber')
//     requestAPI({
//       type: "GET_SETTLEMENT_WAITING",
//       method: "GET",
//       api: `${Configs.API_URL}settlement/waiting?sn=${terminalID}}&paymentTerminal=clover`,
//       token,
//       deviceName,
//       deviceId,
//     }).then((settleWaitingResponse) => {
//       const settleWaiting = l.get(settleWaitingResponse, "data");
//       settle(settleWaiting, creditCount, terminalID);
//     });
//   }else if (isSetup) {
//     //Pax
//     let totalRecord = 0;

//     try {
//       const tempEnv = env.ENV;
//       const tempIpPax = commType == "TCP" ? ip : "";
//       const tempPortPax = commType == "TCP" ? port : "";
//       const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
//       // ----------- Total Amount --------
//       let data = await PosLinkReport.reportTransaction({
//         transType: "LOCALDETAILREPORT",
//         edcType: "ALL",
//         cardType: "",
//         paymentType: "",
//         commType: commType,
//         destIp: tempIpPax,
//         portDevice: tempPortPax,
//         timeoutConnect: "90000",
//         bluetoothAddr: idBluetooth,
//         refNum: "",
//       });
//       let result = JSON.parse(data);
//       const ExtData = result?.ExtData || "";
//       const xmlExtData =
//         "<xml>" + ExtData.replace("\\n", "").replace("\\/", "/") + "</xml>";

//       if (result?.ResultCode && result?.ResultCode == "000000") {
//         if (tempEnv == "Production" && result?.Message === "DEMO APPROVED") {
//           console.log("Demo mode");
//         } else {
//           totalRecord = parseInt(result?.TotalRecord || 0);
//           const creditCount = totalRecord;
//           parseString(xmlExtData, (err, result) => {
//             if (err) {
//               processingSettlementWithoutConnectPax();
//             } else {
//               const terminalID = `${result?.xml?.SN || null}`;

//               requestAPI({
//                 type: "GET_SETTLEMENT_WAITING",
//                 method: "GET",
//                 api: `${Configs.API_URL}settlement/waiting?sn=${terminalID}}&paymentTerminal=pax`,
//                 token,
//                 deviceName,
//                 deviceId,
//               }).then((settleWaitingResponse) => {
//                 const settleWaiting = l.get(settleWaitingResponse, "data");
//                 settle(settleWaiting, creditCount, terminalID);
//               });
//             }
//           });
//         }
//       } else {
//         processingSettlementWithoutConnectPax();
//       }
//     } catch (error) {
//       processingSettlementWithoutConnectPax();
//     }
//   } else {
//     processingSettlementWithoutConnectPax();
//   }

// };

// export const processingSettlementWithoutConnectPax = () => {
//   const { dataLocal } = store.getState();
//   const { token, deviceId, deviceName } = dataLocal;
//   requestAPI({
//     type: "GET_SETTLEMENT_WAITING",
//     method: "GET",
//     api: `${Configs.API_URL}settlement/waiting?sn=${null}}`,
//     token,
//     deviceName,
//     deviceId,
//   }).then((settleWaitingResponse) => {
//     const settleWaiting = l.get(settleWaitingResponse, "data");
//     proccessingSettlement([], settleWaiting, null, false);
//   });
// };

// export const settle = async (
//   settleWaiting,
//   creditCount,
//   terminalID
// ) => {
//   const { dataLocal, hardware } = store.getState();
//   const { paxMachineInfo, cloverMachineInfo, paymentMachineType } = hardware;
//   const { token, deviceId, deviceName } = dataLocal;
//   const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
//     paxMachineInfo;

//   if(paymentMachineType == "Clover" && l.get(cloverMachineInfo, "isSetup")){
//     //Clover
//     const port = l.get(cloverMachineInfo, 'port') ? l.get(cloverMachineInfo, 'port') : 80
//     const url = `wss://${l.get(cloverMachineInfo, 'ip')}:${port}/remote_pay`

//     clover.closeout({
//         url,
//         remoteAppId: REMOTE_APP_ID,
//         appName: APP_NAME,
//         posSerial: POS_SERIAL,
//         token: l.get(cloverMachineInfo, 'token') ? l.get(cloverMachineInfo, 'token', '') : "",
//       })
//   } else if (isSetup && terminalID) {
//     //Pax
//     if (Platform.OS === "android") {
//       PoslinkAndroid.batchTransaction(
//         ip,
//         port,
//         "",
//         "BATCHCLOSE",
//         (err) => {},
//         (data) => {
//           proccessingSettlement(data, settleWaiting, terminalID, true);
//         }
//       );
//     } else {
//       const tempIpPax = commType == "TCP" ? ip : "";
//       const tempPortPax = commType == "TCP" ? port : "";
//       const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
//       const paymentTransaction = settleWaiting?.paymentTransaction?.length || 0;
//       const responseData = [];

//       if (creditCount != paymentTransaction) {
//         for (let i = 1; i <= creditCount; i++) {
//           let data = await PosLinkReport.reportTransaction({
//             transType: "LOCALDETAILREPORT",
//             edcType: "ALL",
//             cardType: "",
//             paymentType: "",
//             commType: commType,
//             destIp: tempIpPax,
//             portDevice: tempPortPax,
//             timeoutConnect: "90000",
//             bluetoothAddr: idBluetooth,
//             refNum: `${i}`,
//           });
//           const result = JSON.parse(data);
//           responseData.push(result);
//         }
//       }

//       PosLink.batchTransaction(
//         {
//           transType: "BATCHCLOSE",
//           edcType: "ALL",
//           commType: commType,
//           destIp: tempIpPax,
//           portDevice: tempPortPax,
//           timeoutConnect: "90000",
//           bluetoothAddr: idBluetooth,
//         },
//         (message) => {
//           const result = JSON.parse(message);
//           if (result.status != 0) {
//             proccessingSettlement(
//               responseData,
//               settleWaiting,
//               terminalID,
//               true
//             );
//           }
//         }
//       );
//     }
//   }
// };

// export const proccessingSettlement = async (
//   responseData,
//   settleWaiting,
//   terminalID,
//   isConnectPax
// ) => {
//   const { dataLocal } = store.getState();
//   const { token, deviceId, deviceName } = dataLocal;
//   const editPaymentByHarmony = settleWaiting?.paymentByHarmony || 0.0;
//   const editPaymentByCash = settleWaiting?.paymentByCash || 0.0;
//   const editOtherPayment = settleWaiting?.otherPayment || 0.0;
//   const discountSettlement = settleWaiting?.discount || 0.0;
//   const editPaymentByCreditCard = settleWaiting?.paymentByCreditCard || 0.0;
//   const paymentByGiftcard = settleWaiting?.paymentByGiftcard || 0.0;
//   const settleTotal = {
//     paymentByHarmony: editPaymentByHarmony,
//     paymentByCreditCard: editPaymentByCreditCard,
//     paymentByCash: editPaymentByCash,
//     otherPayment: editOtherPayment,
//     discount: discountSettlement,
//     paymentByCashStatistic: settleWaiting.paymentByCash
//       ? settleWaiting.paymentByCash
//       : 0.0,
//     otherPaymentStatistic: settleWaiting.otherPayment
//       ? settleWaiting.otherPayment
//       : 0.0,
//     paymentByGiftcard: paymentByGiftcard,
//     total: roundFloatNumber(
//       formatNumberFromCurrency(editPaymentByHarmony) +
//         formatNumberFromCurrency(editPaymentByCreditCard) +
//         formatNumberFromCurrency(editPaymentByCash) +
//         formatNumberFromCurrency(editOtherPayment) +
//         formatNumberFromCurrency(discountSettlement) +
//         formatNumberFromCurrency(paymentByGiftcard)
//     ),
//     note: "",
//     terminalID,
//   };
//   const body = {
//     ...settleTotal,
//     checkout: settleWaiting.checkout,
//     isConnectPax,
//     responseData,
//   };
//   requestAPI({
//     method: "POST",
//     api: `${Configs.API_URL}settlement`,
//     body,
//     token,
//     deviceName,
//     deviceId,
//   });
// };

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
export default codePush(codePushOptions)(App);
