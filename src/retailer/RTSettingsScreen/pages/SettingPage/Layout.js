import { PopupCheckStaffPermission } from "@components";
import IMAGE from "@resources";
import { WithDialogConfirm } from "@shared/HOC/withDialogConfirm";
import { colors, fonts, layouts } from "@shared/themes";
import { menuTabs } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SettingAboutPage } from "../SettingAboutPage";
import { SettingAttributesPage } from "../SettingAttributesPage";
import { SettingCategoriesPage } from "../SettingCategoriesPage";
import { SettingGeneralPage } from "../SettingGeneralPage";
import { SettingHardwarePage } from "../SettingHardwarePage";
import { SettingLayoutPage } from "../SettingLayoutPage";
import { SettingStaffPage } from "../SettingStaffPage";
import { SettingTaxPage } from "../SettingTaxPage";

export const Layout = ({
  logOut,
  checkPermissionRef,
  tabPermission,
  closePopupCheckTabPermission,
  active,
  setActive,
  renderContentDrawer,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ========DRAWER======== */}
        <View style={styles.drawer}>
          <ItemDrawer
            {...SettingGeneralPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingAttributesPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingCategoriesPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingStaffPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer {...SettingTaxPage} active={active} onPress={setActive} />
          <ItemDrawer
            {...SettingHardwarePage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingLayoutPage}
            active={active}
            onPress={setActive}
          />

          <ItemDrawer
            {...SettingAboutPage}
            active={active}
            onPress={setActive}
          />

          <ConfirmLogOut
            options={{
              icon: IMAGE.IconSettingLogOut,
              title: t("LogOut"),
            }}
            onPress={logOut}
            active={active}
            description={t("Are you sure you want to Log out ?")}
          />
        </View>

        {/* ========CONTENT======== */}
        <View style={styles.container}>{renderContentDrawer()}</View>

        <PopupCheckStaffPermission
          ref={checkPermissionRef}
          visiblePopupCheckStaffPermission={tabPermission}
          title={t("Input PIN Number")}
          tabName={menuTabs.MENU_SETTING}
          onRequestClose={closePopupCheckTabPermission}
        />
      </View>
    </View>
  );
};

let ItemDrawer = ({ name, options, active, onPress }) => {
  const style =
    name === active ? styles.drawerItemActive : styles.drawerItemInActive;
  const textStyle =
    name === active ? styles.drawerTextActive : styles.drawerTextInActive;
  const tintColor = name === active ? colors.WHITE : colors.BROWNISH_GREY;
  const onHandleSelect = () => {
    if (onPress && typeof onPress === "function") {
      onPress(name);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.drawerItem, style]}
      onPress={onHandleSelect}
      activeOpacity={1}
    >
      {options?.icon && (
        <Image
          source={options?.icon}
          style={[styles.drawerIcon, { tintColor }]}
        />
      )}
      <View style={layouts.marginHorizontal} />
      <Text style={[styles.drawerText, textStyle]}>{options?.title}</Text>
    </TouchableOpacity>
  );
};

const ConfirmLogOut = WithDialogConfirm(ItemDrawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },

  content: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
  },

  drawer: {
    width: scaleWidth(160),
    backgroundColor: colors.WHITE_FA,
    height: "100%",
  },

  drawerItem: {
    width: scaleWidth(160),
    height: scaleHeight(60),
    alignItems: "center",
    paddingHorizontal: scaleWidth(8),
    flexDirection: "row",
    borderLeftWidth: scaleWidth(4),
  },

  drawerItemInActive: {
    backgroundColor: colors.WHITE_FA,
    borderLeftColor: colors.WHITE_FA,
  },

  drawerItemActive: {
    backgroundColor: colors.OCEAN_BLUE,
    borderLeftColor: colors.WEIRD_GREEN,
  },

  drawerText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
  },

  drawerTextInActive: {
    color: colors.BROWNISH_GREY,
  },

  drawerTextActive: {
    color: colors.WHITE,
  },

  drawerIcon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
  },
});
