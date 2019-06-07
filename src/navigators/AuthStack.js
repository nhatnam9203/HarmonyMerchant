import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    SignInScreen,
    ForgotPasswordScreen,
    TermsScreen,
    GeneralInfoScreen,
    BankInfoScreen,
    BusinessInfoScreen,
    PrincipalScreen
} from '../screens';

const AuthStack = createStackNavigator(
    {
        SignIn: SignInScreen,
        ForgotPassword: ForgotPasswordScreen,
        Terms: TermsScreen,
        GeneralInfo: GeneralInfoScreen,
        BankInfo: BankInfoScreen,
        BusinessInfo: BusinessInfoScreen,
        Principal: PrincipalScreen
    },
    {
        initialRouteName: 'SignIn',
        headerMode: 'none',
    }
);

export default AuthStack;