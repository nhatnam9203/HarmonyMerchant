import { StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { PermissionChecker } from "@shared/components";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { HeaderToolBar } from "@shared/components/HeaderToolBar";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { colors } from "@shared/themes";
import { menuTabs } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  SettingNewAttributesPage,
  SettingNewCategoriesPage,
  SettingNewStaffsPage,
  SettingPage,
} from "./pages";

const { Screen, Navigator } = createStackNavigator();

export const Layout = ({
  openDrawer,
  navigation,
  tabPermission,
  togglePopupPermission,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <HeaderToolBar
        leftComponent={() => <ButtonDrawer onPress={openDrawer} />}
      >
        <HeaderToolBarTitle label={t("Settings")} />
      </HeaderToolBar>

      <Navigator
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...SettingPage} />
        <Screen {...SettingNewAttributesPage} />
        <Screen {...SettingNewCategoriesPage} />
        <Screen {...SettingNewStaffsPage} />
      </Navigator>
      <PermissionChecker
        navigation={navigation}
        tabName={menuTabs.MENU_SETTING}
        tabPermission={tabPermission}
        togglePopupPermission={togglePopupPermission}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE_FA,
  },

  content: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
  },
});
