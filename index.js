/** @format */
import React from "react";
import { AppRegistry, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import SplashScreen from "react-native-splash-screen";

import AppNavigators from "./src/navigators/AppNavigator";
import { persistor, store } from "./src/redux/store";
import { name as appName } from "./app.json";
import NavigatorServices from "./src/navigators/NavigatorServices";
import { Loading, PopupDisconnected, PopupConnected } from "./src/components";
import { FirebaseNotificationProvider } from "@firebase";


class App extends React.Component {
  constructor(props) {
    super(props);
    SplashScreen.hide();
    console.disableYellowBox = true
    console.ignoredYellowBox = ['Setting a timer'];
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<View />} persistor={persistor}>
          <AppNavigators
            ref={(navigatorRef) => {
              NavigatorServices.setContainer(navigatorRef);
            }}
          />
          <Loading />
          <PopupDisconnected />
          <PopupConnected />
          <FirebaseNotificationProvider />
        </PersistGate>
      </Provider>
    );
  }
}

AppRegistry.registerComponent(appName, () => App);
