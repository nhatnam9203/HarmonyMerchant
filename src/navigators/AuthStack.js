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
    PrincipalScreen,
    ApplicationSubmitScreen,
} from '../screens';

const AuthStack = createStackNavigator(
    {
        SignIn: SignInScreen,
        ForgotPassword: ForgotPasswordScreen,
        Terms: TermsScreen,
        GeneralInfo: GeneralInfoScreen,
        BusinessInfo: BusinessInfoScreen,
        BankInfo: BankInfoScreen,
        PrincipalInfo: PrincipalScreen,
        ApplicationSubmit:ApplicationSubmitScreen
    },
    {
        initialRouteName: 'GeneralInfo',
        headerMode: 'none',
    }
);

export default AuthStack;