/**
 * RetailerNavigator (App Retailer)
 *
 */
import actions from "@actions";
import { ParentContainer } from '@components';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";
import IMAGE from "@resources";
import {
  CustomDrawerContent,
  CustomDrawerIcon
} from "@shared/components/CustomDrawerContent";
import { RTCustomerScreen } from "@src/retailer/RTCustomerScreen";
import { RTHomeScreen } from "@src/retailer/RTHomeScreen";
import { RTInventoryScreen } from "@src/retailer/RTInventoryScreen";
import { RTSettingsScreen } from "@src/retailer/RTSettingsScreen";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReportScreen } from "../merchant/ReportScreen";
import { InvoiceScreen, SettlementScreen, SupportScreen } from "../screens";

const { Screen, Navigator } = createDrawerNavigator();

export const RetailerNavigator = ({ navigation }) => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.dataLocal.profile);

  const isFocused = useIsFocused();

  const handleLockScreen = () => {
    if (isFocused) {
      // go to home


      // lock screen
    }
  }

  const clearIntervalById = () => {

  }

  React.useEffect(() => {
    if (profile?.merchantId) {
      dispatch(actions.app.getMerchantByID(profile.merchantId, true));
    }
  }, [profile?.merchantId]);



  return (
    <ParentContainer
      handleLockScreen={handleLockScreen}
      activeScreen={isFocused}
      navigation={navigation}
      clearIntervalById={clearIntervalById}
    >
      <Navigator
        headerMode="none"
        drawerContent={CustomDrawerContent}
        drawerStyle={{
          width: scaleWidth(260),
        }}
      >
        <Screen {...RTHomeScreen} />
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
        <Screen {...RTCustomerScreen} />
        <Screen {...RTInventoryScreen} />
        <Screen {...ReportScreen} />
        <Screen {...RTSettingsScreen} />
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
    </ParentContainer>

  );
};
