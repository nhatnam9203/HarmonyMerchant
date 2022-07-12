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
        console.log('pairingCode', data)
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
    console.log("check code push");
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

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
export default codePush(codePushOptions)(App);
