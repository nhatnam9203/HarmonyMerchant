import {
    createSwitchNavigator,
    createNavigationContainer,
} from 'react-navigation';

import {
    SplashScreen,
} from '../screens';

import AuthStack from './AuthStack';
import SetupStoreStack from './SetupStoreStack';
import DrawerStack from './DrawerStack';
import SigninStack from './SigninStack';

export default createNavigationContainer(createSwitchNavigator({
    Auth: AuthStack,
    SetupStore: SetupStoreStack,
    Splash: SplashScreen,
    Drawer: DrawerStack,
    SigninStack: SigninStack,
},
    {
        initialRouteName: 'SetupStore'
    }

))


