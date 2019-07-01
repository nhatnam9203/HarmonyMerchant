import React from 'react';
import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import {
    TermsScreen,
    GeneralInfoScreen,
    BankInfoScreen,
    BusinessInfoScreen,
    PrincipalScreen,
    ApplicationSubmitScreen,
} from '../screens';

const SetupStoreStack = createStackNavigator(
    {
        Terms: TermsScreen,
        GeneralInfo: GeneralInfoScreen,
        BusinessInfo: BusinessInfoScreen,
        BankInfo: BankInfoScreen,
        PrincipalInfo: PrincipalScreen,
        ApplicationSubmit: ApplicationSubmitScreen,
    },
    {
        initialRouteName: 'Terms',
        headerMode: 'none',
        transitionConfig: getSlideFromRightTransition
    }
);

export default SetupStoreStack;


