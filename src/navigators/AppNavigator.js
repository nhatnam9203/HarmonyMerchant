import React from 'react';
import {
    createStackNavigator,
    createSwitchNavigator,
    createNavigationContainer,
    createBottomTabNavigator
} from 'react-navigation';

import {
    SplashScreen,
    HomeScreen,
} from '../screens';

// import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default createNavigationContainer(createSwitchNavigator({
    // Auth: AuthStack,
    Main: HomeScreen,
    Splash:SplashScreen
},
    {
        initialRouteName: 'Splash'
    }

))