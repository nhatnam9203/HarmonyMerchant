import {
    createDrawerNavigator,
    createStackNavigator
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import {scaleSzie} from '../utils';

import {
    SignInScreen,
    ForgotPasswordScreen,
    SlideDrawer,
    HomeScreen
} from '../screens';

const DrawerStack = createDrawerNavigator({
    SignIn: SignInScreen,
    ForgotPassword: ForgotPasswordScreen,
    Home:HomeScreen
},{
    initialRouteName: "Home",
    contentComponent: SlideDrawer,
    drawerWidth:scaleSzie(250)

});

export default DrawerStack;