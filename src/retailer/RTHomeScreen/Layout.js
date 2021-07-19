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
import { HomeTopTabNavigator } from "./HomeTopTabNavigator";
import NavigationServices from "@navigators/NavigatorServices";
import { createStackNavigator } from "@react-navigation/stack";

export const HomeStateContext = createContext({});

const { Screen, Navigator } = createStackNavigator();

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

      <Navigator
        initialRouteName="home.order.top_tab"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen name={"home.order.top_tab"} initialParams={{}}>
          {(props) => (
            <HomeTopTabNavigator
              {...props}
              openDrawer={openDrawer}
              isPayment={isPayment}
              showPopupConfirm={showPopupConfirm}
              navigation={navigation}
            />
          )}
        </Screen>

        {/* <Screen {...InventoryListPage} /> */}
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
