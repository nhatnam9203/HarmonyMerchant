import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator,
    createNavigationContainer,
    createBottomTabNavigator
} from 'react-navigation';

import {
    SplashScreen,
} from '../screens';

import AuthStack from './AuthStack';
import MainStack from './MainStack';
import DrawerStack from './DrawerStack';

export default createNavigationContainer(createSwitchNavigator({
    Auth: AuthStack,
    Main: MainStack,
    Splash: SplashScreen,
    Drawer: DrawerStack
},
    {
        initialRouteName: 'Splash'
    }

))

// huynhthinhuy1297@gmail.com
// admin123456@


