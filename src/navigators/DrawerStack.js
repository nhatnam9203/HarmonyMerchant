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
    HomeScreen,
    SettingScreen,
    InventoryScreen
} from '../screens';

const DrawerStack = createDrawerNavigator({
    SignIn: SignInScreen,
    ForgotPassword: ForgotPasswordScreen,
    Home: HomeScreen,
    Setting: SettingScreen,
    Inventory: InventoryScreen
}, {
        initialRouteName: "Setting",
        contentComponent: SlideDrawer,
        drawerWidth: scaleSzie(220)

    });

export default DrawerStack;