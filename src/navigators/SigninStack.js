import {
    createDrawerNavigator,
    createStackNavigator
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { ScaleSzie } from '../utils';

import {
    SignInScreen,
    ForgotPasswordScreen,
    SlideDrawer,
} from '../screens';

const SigninStack = createStackNavigator({
    SignIn: SignInScreen,
    ForgotPassword: ForgotPasswordScreen,
}, {
    initialRouteName: 'SignIn',
    headerMode: 'none',
    transitionConfig: getSlideFromRightTransition

});

export default SigninStack;