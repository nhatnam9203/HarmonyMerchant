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
import React from "react";
import { StyleSheet, View } from "react-native";
import { OrderTabPage, MarketingTabPage, CheckOutTabPage } from "./pages";
import { colors } from "@shared/themes";
import { HomeTabBar } from "./widget";
import { useTranslation } from "react-i18next";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const Layout = ({
  onChangeTab,
  openDrawer,
  displayNotifiPopup,
  notificationContUnread,
  showLockScreen = () => {},
}) => {
  const [t] = useTranslation();
  // const renderTab = () => (
  //   <HomeTabBar
  //     activeTextColor="#fff"
  //     inactiveTextColor="#0764B0"
  //     backgroundTabActive="#0764B0"
  //     textStyle={styles.textStyle}
  //     renderRightItem={() => <ButtonLock onPress={showLockScreen} />}
  //     renderLeftItem={() => <ButtonDrawer onPress={openDrawer} />}
  //   />
  // );

  return (
    <View style={styles.container}>
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
        tabBar={(props) => <HomeTabBar {...props} />}
      >
        {/* <Screen {...MarketingTabPage} /> */}
        {/* <TabMarketing tabLabel={'MARKETING'} /> */}
        <Screen name={t("Marketing")} component={TabMarketing} />
        <Screen {...OrderTabPage} />
        <Screen {...CheckOutTabPage} />
        {/* <Screen name={t('Check Out')} component={OrderCheckout} /> */}
      </Navigator>
    </View>
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
