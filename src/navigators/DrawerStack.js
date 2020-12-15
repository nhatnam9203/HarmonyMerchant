import { createDrawerNavigator } from "react-navigation";
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
  GiftCardScreen
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
    Reports: ReportScreen,
    GiftCard: GiftCardScreen
  }, {
  initialRouteName: "GiftCard",
  contentComponent: SlideDrawer,
  drawerWidth: scaleSzie(220),
  overlayColor: "rgba(0, 0, 0, 0.5) ",
}
);


export default DrawerStack;
