import {
  ParentContainer,
  ScrollableTabView,
  StatusBarHeader,
} from "@components";
// import HomeTabBar from '@components/HomeTabBar2020';
import { ButtonLock } from "@shared/components/ButtonLock";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import {
  OrderCheckout,
  OrderTab,
  TabMarketing,
} from "@src/screens/HomeScreen/widget";
import React, { createContext } from "react";
import { StyleSheet, View } from "react-native";
import { OrderTabPage, MarketingTabPage, CheckOutTabPage } from "./pages";
import { colors } from "@shared/themes";
import { HomeTabBar } from "./widget";
import { useTranslation } from "react-i18next";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export const HomeStateContext = createContext({});

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const Layout = ({
  openDrawer,
  displayNotifiPopup,
  notificationContUnread,
  showLockScreen = () => {},
  isPayment,
  showPopupConfirm,
  navigation,
}) => {
  const [t] = useTranslation();

  return (
    <HomeStateContext.Provider style={styles.container} value={{}}>
      <StatusBarHeader />

      {/* <ScrollableTabView
        initialPage={1}
        locked={true}
        renderTabBar={renderTab}
        onChangeTab={onChangeTab}
      >
        <TabMarketing tabLabel={'MARKETING'} />
        <OrderTabPage tabLabel={'ORDER'} />
        <OrderCheckout tabLabel={'CHECK-OUT'} />
      </ScrollableTabView> */}
      <Navigator
        initialRouteName="retailer.home.order"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        optimizationsEnabled={true}
        tabBar={(props) => <HomeTabBar {...props} onOpenDrawer={openDrawer} />}
      >
        {/* <Screen {...MarketingTabPage} /> */}
        {/* <TabMarketing tabLabel={'MARKETING'} /> */}
        <Screen
          name={t("Marketing")}
          component={TabMarketing}
          listeners={{
            tabPress: (e) => {
              if (isPayment) {
                showPopupConfirm(() => {
                  navigation.navigate("Marketing");
                });
                // Prevent default action
                e.preventDefault();
              }
            },
          }}
        />
        <Screen
          {...OrderTabPage}
          listeners={{
            tabPress: (e) => {
              if (isPayment) {
                // Prevent default action
                e.preventDefault();
              }
            },
          }}
        />
        <Screen
          {...CheckOutTabPage}
          listeners={{
            tabPress: (e) => {
              if (isPayment) {
                showPopupConfirm(() => {
                  navigation.navigate(CheckOutTabPage.name);
                }); // Prevent default action
                e.preventDefault();
              }
            },
          }}
        />
        {/* <Screen name={t('Check Out')} component={OrderCheckout} /> */}
      </Navigator>
    </HomeStateContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },

  textStyle: {
    fontSize: scaleFont(16),
    fontWeight: "500",
  },
});
