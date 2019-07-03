import {
    createDrawerNavigator,
    createStackNavigator
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { scaleSzie } from '../utils';

import {
    SignInScreen,
    ForgotPasswordScreen,
    SlideDrawer,
} from '../screens';

const SigninStack = createDrawerNavigator({
    SignIn: SignInScreen,
    ForgotPassword: ForgotPasswordScreen,
}, {
        initialRouteName: "SignIn",
        contentComponent: SlideDrawer,
        drawerWidth: scaleSzie(220)

    });

export default SigninStack;