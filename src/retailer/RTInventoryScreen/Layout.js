import { StatusBarHeader } from "@components";
import { createStackNavigator } from "@react-navigation/stack";
import { ButtonDrawer } from "@shared/components/ButtonDrawer";
import { HeaderToolBar } from "@shared/components/HeaderToolBar";
import { HeaderToolBarTitle } from "@shared/components/HeaderToolBarTitle";
import { colors } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  InventoryEditCategoryPage,
  InventoryEditProductPage,
  InventoryListPage,
  InventoryProductDetailPage,
} from "./pages";
import { PermissionChecker } from "@shared/components";
import { menuTabs } from "@utils";

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
        <HeaderToolBarTitle label={t("Inventory")} />
      </HeaderToolBar>

      <Navigator
        // initialRouteName="merchant.inventory"
        headerMode="none"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...InventoryListPage} />
        <Screen {...InventoryProductDetailPage} />
        <Screen {...InventoryEditCategoryPage} />
        <Screen {...InventoryEditProductPage} />
      </Navigator>
      <PermissionChecker
        navigation={navigation}
        tabName={menuTabs.MENU_INVENTORY}
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
});
