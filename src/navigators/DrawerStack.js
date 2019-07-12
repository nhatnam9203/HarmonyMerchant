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
    InventoryScreen,
    CustomerScreen
} from '../screens';

const DrawerStack = createDrawerNavigator({
    Home: HomeScreen,
    Setting: SettingScreen,
    Inventory: InventoryScreen,
    Customer: CustomerScreen
}, {
        initialRouteName: "Home",
        contentComponent: SlideDrawer,
        drawerWidth: scaleSzie(220)

    });

export default DrawerStack;