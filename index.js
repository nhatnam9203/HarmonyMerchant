/** @format */
import React from 'react'
import { AppRegistry,View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import AppNavigators from './src/navigators/AppNavigator';
// import configureStore from './src/redux/store';
import { persistor,store} from './src/redux/store';
import { name as appName } from './app.json';
import NavigatorServices from './src/navigators/NavigatorServices';
import { Loading, PopupDisconnected, PopupConnected } from './src/components';

class App extends React.Component {

    constructor(props) {
        super(props);
        // const { persistor, store } = configureStore();
        // this.state = {
        //     persistor,
        //     store,
        // }
    }

    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={<View />}
                    persistor={persistor}>
                        <AppNavigators
                            ref={navigatorRef => {
                                NavigatorServices.setContainer(navigatorRef);
                            }}
                        />
                        <Loading />
                        <PopupDisconnected />
                        <PopupConnected />
                </PersistGate>
            </Provider>
        );
    }

}

AppRegistry.registerComponent(appName, () => App);