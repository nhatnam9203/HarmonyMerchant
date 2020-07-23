import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    SignInScreen,
    ForgotPasswordScreen,
    TermsScreen,
    IntroScreen,
    UserGuideScreen,
    SignUpScreen
} from '../screens';

const AuthStack = createStackNavigator(
    {
        Intro: IntroScreen,
        UserGuide: UserGuideScreen,
        SignIn: SignInScreen,
        ForgotPassword: ForgotPasswordScreen,
        Terms: TermsScreen,
        SignUp:SignUpScreen
    },
    {
        initialRouteName: 'Intro',
        headerMode: 'none',
        transitionConfig: getSlideFromRightTransition
    }
);

export default AuthStack;

