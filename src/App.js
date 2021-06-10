import { FirebaseNotificationProvider } from '@firebase';
import '@shared/services/translation';
import React from 'react';
import { View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import {
  Loading,
  PopupConnected,
  PopupDisconnected,
  PopupInfomationCodePush,
} from './components';
import { RootNavigator } from './navigators/RootNavigator';
import configureStore from './redux/store';
import codePush from 'react-native-code-push';
import { CodePushProvider } from '@shared/providers/CodePushProvider';
import { AppStateProvider } from '@shared/providers/AppStateProvider';
import { isDevelopmentMode } from '@shared/utils/app';
import '@shared/services/api/axiosClient';
if (isDevelopmentMode) {
  import('../ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
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
            <Loading />
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
