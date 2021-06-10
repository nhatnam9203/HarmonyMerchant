/**
 * SalonNavigator (POS App)
 *
 */
import { scaleSize } from '../utils';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

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

const { Screen, Navigator } = createDrawerNavigator();
export const SalonNavigator = () => {
  return (
    <Navigator
      initialRouteName="Home"
      drawerContent={(props) => <SlideDrawer {...props} />}
    >
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Setting" component={SettingScreen} />
      <Screen name="Inventory" component={InventoryScreen} />
      <Screen name="Customer" component={CustomerScreen} />
      <Screen name="Invoice" component={InvoiceScreen} />
      <Screen name="Support" component={SupportScreen} />
      <Screen name="Settlement" component={SettlementScreen} />
      <Screen name="Reports" component={ReportScreen} />
      <Screen name="GiftCard" component={GiftCardScreen} />
    </Navigator>
  );
};

// export const SalonNavigator = createDrawerNavigator(
//   {
//     Home: HomeScreen,
//     Setting: SettingScreen,
//     Inventory: InventoryScreen,
//     // Inventory: InventoryOfRetail,

//     Customer: CustomerScreen,
//     CustomerNew: CustomerNewScreen,
//     Invoice: InvoiceScreen,
//     Support: SupportScreen,
//     Settlement: SettlementScreen,
//     Reports: ReportScreen,
//     GiftCard: GiftCardScreen,
//   },
//   {
//     initialRouteName: 'Home',
//     contentComponent: SlideDrawer, // add menu item trong SlideDrawer
//     drawerWidth: scaleSize(220),
//     overlayColor: 'rgba(0, 0, 0, 0.5) ',
//   },
// );
