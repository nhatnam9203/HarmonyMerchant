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

export default createNavigationContainer(createSwitchNavigator({
    Auth: AuthStack,
    SetupStore: SetupStoreStack,
    Splash: SplashScreen,
    Drawer: DrawerStack,
},
    {
        initialRouteName: 'Splash'
    }

))


