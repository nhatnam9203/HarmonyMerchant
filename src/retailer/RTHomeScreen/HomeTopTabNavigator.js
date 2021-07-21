import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "@shared/themes";
import { TabMarketing } from "@src/screens/HomeScreen/widget";
import React from "react";
import { useTranslation } from "react-i18next";
import { CheckOutTabPage, OrderTabPage } from "./pages";
import { HomeTabBar } from "./widget";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const HomeTopTabNavigator = ({
  openDrawer,
  showPopupConfirm,
  isPayment,
  navigation,
}) => {
  const [t] = useTranslation();

  return (
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
      swipeEnabled={false}
      tabBar={(props) => <HomeTabBar {...props} onOpenDrawer={openDrawer} />}
    >
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
    </Navigator>
  );
};
