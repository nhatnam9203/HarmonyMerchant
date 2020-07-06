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
    PackageAndPricing,
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
        // GeneralInfo: GeneralInfoScreen,
        // BusinessInfo: BusinessInfoScreen,
        // BankInfo: BankInfoScreen,
        // PrincipalInfo: PrincipalScreen,
        // PackageAndPricing,
        // ApplicationSubmit: ApplicationSubmitScreen,
        SignUp:SignUpScreen
    },
    {
        initialRouteName: 'Intro',
        headerMode: 'none',
        transitionConfig: getSlideFromRightTransition
    }
);

export default AuthStack;

