import {
    createDrawerNavigator,
    createStackNavigator
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import { scaleSzie } from '../utils';

import {
    SlideDrawer,
    HomeScreen,
    SettingScreen,
    InventoryScreen,
    CustomerScreen,
    InvoiceScreen
} from '../screens';

const DrawerStack = createDrawerNavigator({
    Home: HomeScreen,
    Setting: SettingScreen,
    Inventory: InventoryScreen,
    Customer: CustomerScreen,
    Invoice:InvoiceScreen
}, {
        initialRouteName: "Inventory",
        contentComponent: SlideDrawer,
        drawerWidth: scaleSzie(220)

    });

export default DrawerStack;