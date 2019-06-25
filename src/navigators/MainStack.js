import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    HomeScreen,
    StoreInfoScreen,
    CongratulationScreen,
    ApplicationSubmitScreen,
    UserGuideScreen,
} from '../screens';

const MainStack = createStackNavigator(
    {
        StoreInfo:StoreInfoScreen,
        Congratulation:CongratulationScreen,
        // UserGuide:UserGuideScreen,
    },
    {
        initialRouteName: 'StoreInfo',
        headerMode: 'none',
    }
);

export default MainStack;