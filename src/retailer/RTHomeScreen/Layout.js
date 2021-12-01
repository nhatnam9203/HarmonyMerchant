import { StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "@shared/themes";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { HomeTopTabNavigator } from "./HomeTopTabNavigator";

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
