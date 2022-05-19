import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { colors } from "@shared/themes";
import { HomeTopTabBar } from "@shared/components";
import {
  TabMarketing,
  TabCheckout,
  TabAppointment,
} from "@src/screens/HomeScreen/widget";
import { useDispatch, useSelector } from "react-redux";
import { SalonAppointmentTab } from "../SalonAppointmentTab";
import { SalonCheckoutTab } from "../SalonCheckoutTab";
import { ScreenName } from "@src/ScreenName";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const Layout = ({ openDrawer, navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Navigator
        headerMode="none"
        initialRouteName={ScreenName.SALON.APPOINTMENT}
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        optimizationsEnabled={true}
        swipeEnabled={false}
        tabBar={(props) => (
          <HomeTopTabBar {...props} onOpenDrawer={openDrawer} />
        )}
      >
        <Screen name={t("MARKETING")} component={TabMarketing} />
        {/* <Screen name={t("APPOINTMENT")} component={TabAppointment} /> */}
        <Screen {...SalonAppointmentTab} />
        <Screen {...SalonCheckoutTab} />
        {/* <Screen name={t("CHECK-OUT")} component={TabCheckout} /> */}
      </Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
