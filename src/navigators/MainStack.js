import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    StoreInfoScreen,
    CongratulationScreen,
} from '../screens';

const MainStack = createStackNavigator(
    {
        StoreInfo:StoreInfoScreen,
        Congratulation:CongratulationScreen,
    },
    {
        initialRouteName: 'StoreInfo',
        headerMode: 'none',
    }
);

export default MainStack;