import { createDrawerNavigator } from 'react-navigation';
import { scaleSize } from '../utils';

import {
  SlideDrawer,
  HomeScreen,
  SettingScreen,
  InventoryScreen,
  CustomerScreen,
  InvoiceScreen,
  SupportScreen,
  SettlementScreen,
  ReportScreen,
  GiftCardScreen,
  InventoryOfRetail,
  CustomerNewScreen,
} from '../screens';

const DrawerStack = createDrawerNavigator(
  {
    Home: HomeScreen,
    Setting: SettingScreen,
    Inventory: InventoryScreen,
    // Inventory: InventoryOfRetail,

    Customer: CustomerScreen,
    CustomerNew: CustomerNewScreen,
    Invoice: InvoiceScreen,
    Support: SupportScreen,
    Settlement: SettlementScreen,
    Reports: ReportScreen,
    GiftCard: GiftCardScreen,
  },
  {
    initialRouteName: 'Home',
    contentComponent: SlideDrawer, // add menu item trong SlideDrawer
    drawerWidth: scaleSize(220),
    overlayColor: 'rgba(0, 0, 0, 0.5) ',
  },
);

export default DrawerStack;
