/**
 * RetailerNavigator (App Retailer)
 *
 */
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import { RTHomeScreen } from '@src/retailer/RTHomeScreen';
import { RTSettlementScreen } from '@src/retailer/RTSettlementScreen';
import { RTCustomerScreen } from '@src/retailer/RTCustomerScreen';
import { RTInventoryScreen } from '@src/retailer/RTInventoryScreen';
import { RTReportsScreen } from '@src/retailer/RTReportsScreen';
import { RTSettingsScreen } from '@src/retailer/RTSettingsScreen';
import { RTSupportScreen } from '@src/retailer/RTSupportScreen';
import { RTTimekeepingScreen } from '@src/retailer/RTTimekeepingScreen';
import { SettlementScreen, SupportScreen, SettingScreen } from '../screens';
import { CustomDrawerContent } from '@shared/components/CustomDrawerContent';
import { scaleSize } from '@utils';
import { CustomDrawerIcon } from '@shared/components/CustomDrawerContent';
import IMAGE from '@resources';

const { Screen, Navigator } = createDrawerNavigator();

export const RetailerNavigator = () => {
  return (
    <Navigator
      headerMode="none"
      //initialRouteName={'retailer.inventory'} //!! add to developer, remove when finished
      drawerContent={CustomDrawerContent}
      drawerStyle={{
        width: scaleSize(200),
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
              source={focused ? IMAGE['Se_Settlement'] : IMAGE['Settlement']}
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
              source={focused ? IMAGE['Se_Support'] : IMAGE['Support']}
            />
          ),
        }}
      />
      {/* <Screen {...RTTimekeepingScreen} /> */}
    </Navigator>
  );
};
