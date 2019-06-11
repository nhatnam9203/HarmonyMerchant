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

export default createNavigationContainer(createSwitchNavigator({
    Auth: AuthStack,
    Main: MainStack,
    Splash:SplashScreen,
},
    {
        initialRouteName: 'Main'
    }

))