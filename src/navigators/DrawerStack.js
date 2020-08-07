import { createDrawerNavigator, createStackNavigator } from "react-navigation";
import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import { scaleSzie } from "../utils";

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
} from "../screens";

const DrawerStack = createDrawerNavigator(
  {
    Home: HomeScreen,
    Setting: SettingScreen,
    Inventory: InventoryScreen,
    Customer: CustomerScreen,
    Invoice: InvoiceScreen,
    Support: SupportScreen,
    Settlement: SettlementScreen,
    Reports: ReportScreen
  }, {
  initialRouteName: "Home",
  contentComponent: SlideDrawer,
  drawerWidth: scaleSzie(220),
  overlayColor: "rgba(0, 0, 0, 0.5) ",
}
);

export default DrawerStack;
