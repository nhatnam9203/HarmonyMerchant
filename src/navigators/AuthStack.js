import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    SignInScreen,
    ForgotPasswordScreen
} from '../screens';

const AuthStack = createStackNavigator(
    {
        SignIn: SignInScreen,
        ForgotPassword:ForgotPasswordScreen
    },
    {
        initialRouteName: 'ForgotPassword',
        headerMode: 'none',
    }
);

export default AuthStack;