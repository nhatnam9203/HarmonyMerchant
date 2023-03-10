import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { HomeTopTabBar } from "@shared/components";
import { colors } from "@shared/themes";
import { ScreenName } from "@src/ScreenName";
import { TabMarketing } from "@src/screens/HomeScreen/widget";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { AppointmentLayout } from "../AppointmentLayout";
import { CheckoutPage } from "../CheckoutPage";
import * as controllers from "../../controllers";
import { PopupNotifications } from "../../components";

const { Screen, Navigator } = createMaterialTopTabNavigator();

export const Layout = ({
  openDrawer,
  navigation,
  onChangeTab,
  isBlockChangeTab,
  onHandleWillChangeTab,
  currentTab,
  notificationContUnread,
  popupNotifyRef,
  handlePushNotifyDataToWebView
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Navigator
        headerMode="none"
        initialRouteName={currentTab}
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
        lazy={true}
        optimizationsEnabled={true}
        swipeEnabled={false}
        tabBar={(props) => (
          <HomeTopTabBar
            {...props}
            onOpenDrawer={openDrawer}
            onChangeTab={onChangeTab}
            onWillChangeTab={onHandleWillChangeTab}
            isBlockChangeTab={isBlockChangeTab}
            notificationContUnread={notificationContUnread}
            displayNotificationPopup={() => popupNotifyRef.current.show()}
          />
        )}
      >
        <Screen name={t("MARKETING")} component={TabMarketing} />
        <Screen {...AppointmentLayout} />
        <Screen {...CheckoutPage} />
      </Navigator>
      <PopupNotifications ref={popupNotifyRef} handlePushNotifyDataToWebView={handlePushNotifyDataToWebView}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
