import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    HomeScreen,
    StoreInfoScreen
} from '../screens';

const MainStack = createStackNavigator(
    {
        Home: HomeScreen,
        StoreInfo:StoreInfoScreen
    },
    {
        initialRouteName: 'StoreInfo',
        headerMode: 'none',
    }
);

export default MainStack;