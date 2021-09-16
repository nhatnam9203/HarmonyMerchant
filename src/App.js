import { FirebaseNotificationProvider } from "@firebase";
import { AppStateProvider } from "@shared/providers/AppStateProvider";
import { CodePushProvider } from "@shared/providers/CodePushProvider";
import "@shared/services/api/axiosClient";
import "@shared/services/translation";
import { isDevelopmentMode } from "@shared/utils/app";
import React from "react";
import { View } from "react-native";
import codePush from "react-native-code-push";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import {
  PopupConnected,
  PopupDisconnected,
  PopupInfomationCodePush,
} from "./components";
import { RootNavigator } from "./navigators/RootNavigator";
import configureStore from "./redux/store";

if (isDevelopmentMode) {
  import("../ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

const { persistor, store } = configureStore();

const App: () => React$Node = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<View />} persistor={persistor}>
        <CodePushProvider>
          <AppStateProvider>
            <RootNavigator />
            {/* <Loading /> */}
            <PopupDisconnected />
            <PopupConnected />
            <FirebaseNotificationProvider />
            <PopupInfomationCodePush />
          </AppStateProvider>
        </CodePushProvider>
      </PersistGate>
    </Provider>
  );
};

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
export default codePush(codePushOptions)(App);
