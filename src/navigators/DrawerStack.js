import { createDrawerNavigator, createStackNavigator } from "react-navigation";
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

// const DrawerStack_1 = createStackNavigator(
//   {
//     Home: HomeScreen,

//   },
//   {
//     initialRouteName: 'Home',
//     headerMode: 'none',
//   }
// );

export default DrawerStack;
