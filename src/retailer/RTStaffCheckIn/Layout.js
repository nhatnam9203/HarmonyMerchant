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
import { StaffCheckInList } from "./pages";

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
        <HeaderToolBarTitle label={t("Staff check in")} />
      </HeaderToolBar>

      <Navigator
        headerMode="retailer.staff_check_in.list"
        screenOptions={{
          cardStyle: {
            backgroundColor: colors.WHITE_FA,
          },
        }}
      >
        <Screen {...StaffCheckInList} />
      </Navigator>

      <PermissionChecker
        navigation={navigation}
        tabName={menuTabs.MENU_CUSTOMER}
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
  borderStyle: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: scaleWidth(4),
    backgroundColor: "#F1F1F1",
  },
  iconSearch: {
    width: scaleWidth(22),
    height: scaleWidth(22),
    resizeMode: "contain",
  },
  inputSearch: { flex: 1, fontSize: scaleWidth(17) },
  padRight: {
    paddingRight: scaleWidth(8),
  },
  btnBorderStyle: {
    borderColor: "#C5C5C5",
    borderWidth: 1,
    borderRadius: scaleWidth(4),
  },

  btnTextStyle: { fontSize: scaleWidth(15), fontWeight: "500" },
});
