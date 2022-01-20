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
import NavigationServices from "@navigators/NavigatorServices";
import { View } from 'react-native'
import { PopupPinCode } from "@shared/components"
import { useLockScreen } from '@shared/hooks'

const { Screen, Navigator } = createDrawerNavigator();


export const RetailerNavigator = ({ navigation }) => {
  const dispatch = useDispatch();
  const popupPinCodeRef = React.useRef(null);

  const profile = useSelector((state) => state.dataLocal.profile);
  const notiIntervalId = useSelector((state) => state.app.notiIntervalId);

  const isFocused = useIsFocused();
  const { loginStaff } = useLockScreen(() => {
    popupPinCodeRef.current?.hide();
    dispatch(actions.app.closeAllPopupPincode());
  });

  const onSubmit = (value) => {

    // popupPinCodeRef.current?.hide();
    loginStaff(value);
  }

  const handleLockScreen = () => {
    console.log("isFocused " + isFocused);
    if (isFocused) {
      NavigationServices.navigate("home.order.top_tab");
      popupPinCodeRef.current?.show();
    }
  }

  const clearIntervalById = () => {
    if (notiIntervalId) {
      clearInterval(notiIntervalId);
      dispatch(actions.app.resetNotiIntervalId());
    }
  }

  const onForceClosePopupPinCode = () => {

  }

  React.useEffect(() => {
    if (profile?.merchantId) {
      dispatch(actions.app.getMerchantByID(profile.merchantId, true));
    }
  }, [profile?.merchantId]);


  return (
    <>
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
      <PopupPinCode ref={popupPinCodeRef} onSubmit={onSubmit} onForceClose={onForceClosePopupPinCode} />
    </>
  );
};
