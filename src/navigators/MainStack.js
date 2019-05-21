import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    HomeScreen,
} from '../screens';

const MainStack = createStackNavigator(
    {
        Home: HomeScreen,
    },
    {
        initialRouteName: 'Home',
        headerMode: 'none',
    }
);

export default MainStack;