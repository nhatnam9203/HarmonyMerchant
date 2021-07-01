/**
 * RetailerNavigator (App Retailer)
 *
 */
import { createDrawerNavigator } from "@react-navigation/drawer";
import IMAGE from "@resources";
import {
  CustomDrawerContent,
  CustomDrawerIcon,
} from "@shared/components/CustomDrawerContent";
import { DropdownProvider } from "@shared/helpers/dropdown";
import { RTCustomerScreen } from "@src/retailer/RTCustomerScreen";
import { RTHomeScreen } from "@src/retailer/RTHomeScreen";
import { RTInventoryScreen } from "@src/retailer/RTInventoryScreen";
import { RTReportsScreen } from "@src/retailer/RTReportsScreen";
import { RTSettingsScreen } from "@src/retailer/RTSettingsScreen";
import { scaleSize } from "@utils";
import React from "react";
import { SettlementScreen, SupportScreen } from "../screens";

const { Screen, Navigator } = createDrawerNavigator();

export const RetailerNavigator = () => {
  return (
    <Navigator
      headerMode="none"
      // initialRouteName={"retailer.reports"} //!! add to developer, remove when finished
      drawerContent={CustomDrawerContent}
      drawerStyle={{
        width: scaleWidth(191),
      }}
    >
      <Screen {...RTHomeScreen} />
      {/* <Screen {...RTSettlementScreen} /> */}
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
      <Screen {...RTCustomerScreen} />
      <Screen {...RTInventoryScreen} />
      <Screen {...RTReportsScreen} />
      <Screen {...RTSettingsScreen} />
      {/* <Screen {...RTSupportScreen} /> */}
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
      {/* <Screen {...RTTimekeepingScreen} /> */}
    </Navigator>
  );
};
