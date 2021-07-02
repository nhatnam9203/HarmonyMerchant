/**
 * SalonNavigator (POS App)
 *
 */
import { scaleSize } from "../utils";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import {
  CustomDrawerContent,
  CustomDrawerIcon,
} from "@shared/components/CustomDrawerContent";
import IMAGE from "@resources";

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
} from "../screens";

const { Screen, Navigator } = createDrawerNavigator();
export const SalonNavigator = () => {
  return (
    <Navigator
      initialRouteName="Home"
      drawerContent={CustomDrawerContent}
      drawerStyle={{
        width: scaleSize(200),
      }}
    >
      <Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Home"] : IMAGE["Home"]}
            />
          ),
        }}
      />
      <Screen
        name="Invoice"
        component={InvoiceScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Invoice"] : IMAGE["Invoice"]}
            />
          ),
        }}
      />
      <Screen
        name="Settlement"
        component={SettlementScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Settlement"] : IMAGE["Settlement"]}
            />
          ),
        }}
      />
      <Screen
        name="Customer"
        component={CustomerScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Customer"] : IMAGE["Customer"]}
            />
          ),
        }}
      />
      <Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Inventory"] : IMAGE["Inventory"]}
            />
          ),
        }}
      />
      <Screen
        name="GiftCard"
        component={GiftCardScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_GiftCard"] : IMAGE["GiftCard"]}
            />
          ),
        }}
      />
      <Screen
        name="Reports"
        component={ReportScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Reports"] : IMAGE["Reports"]}
            />
          ),
        }}
      />
      <Screen
        name="Setting"
        component={SettingScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Setting"] : IMAGE["Setting"]}
            />
          ),
        }}
      />
      <Screen
        name="Support"
        component={SupportScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <CustomDrawerIcon
              source={focused ? IMAGE["Se_Support"] : IMAGE["Support"]}
            />
          ),
        }}
      />
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