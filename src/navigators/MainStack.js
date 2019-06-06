import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    HomeScreen,
    StoreInfoScreen,
    CongratulationScreen,
    ApplicationSubmitScreen,
    UserGuideScreen,
    TermsScreen
} from '../screens';

const MainStack = createStackNavigator(
    {
        Home: HomeScreen,
        StoreInfo:StoreInfoScreen,
        Congratulation:CongratulationScreen,
        ApplicationSubmit:ApplicationSubmitScreen,
        UserGuide:UserGuideScreen,
        Terms:TermsScreen
    },
    {
        initialRouteName: 'Terms',
        headerMode: 'none',
    }
);

export default MainStack;