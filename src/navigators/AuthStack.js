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
    IntroScreen,
    UserGuideScreen,
    PackageAndPricing
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
        ApplicationSubmit: ApplicationSubmitScreen,
        Intro: IntroScreen,
        UserGuide: UserGuideScreen,
        PackageAndPricing
    },
    {
        initialRouteName: 'BankInfo',
        headerMode: 'none',
        transitionConfig: getSlideFromRightTransition
    }
);

export default AuthStack;

