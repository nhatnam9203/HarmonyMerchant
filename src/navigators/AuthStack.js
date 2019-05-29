import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    SignInScreen,
} from '../screens';

const AuthStack = createStackNavigator(
    {
        SignIn: SignInScreen,
    },
    {
        initialRouteName: 'SignIn',
        headerMode: 'none',
    }
);

export default AuthStack;