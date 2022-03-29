import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { Image, StyleSheet } from "react-native";
import IMAGE from "@resources";
import { AgencyLogo } from "./AgencyLogo";
import { WithDialogStaffCheckIn } from "@shared/HOC/withDialogStaffCheckIn";
import { useNavigation } from "@react-navigation/native";

const StaffLogTime = WithDialogStaffCheckIn(DrawerItem);

export const CustomDrawerContent = (props) => {
  const { navigation } = props || {};
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
      style={styles.drawer}
      bounces={false}
    >
      <DrawerItemList
        {...props}
        itemStyle={styles.itemStyle}
        labelStyle={styles.labelStyle}
        activeBackgroundColor="#0764B0"
        inActiveBackgroundColor="#0764B0"
        activeTintColor="#FFC130"
        inactiveTintColor="#FFFFFF"
      />
      <StaffLogTime
        {...props}
        label="Log Time"
        icon={() => <CustomDrawerIcon source={IMAGE["Timekeeping"]} />}
        onShowed={() => {
          navigation?.closeDrawer();
        }}
        style={styles.itemStyle}
        labelStyle={styles.labelStyle}
        activeBackgroundColor="#0764B0"
        inActiveBackgroundColor="#0764B0"
        inactiveTintColor="#FFFFFF"
      />

      <AgencyLogo />
    </DrawerContentScrollView>
  );
};

export const CustomDrawerSetting = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
      style={styles.drawerSetting}
      bounces={false}
    >
      <DrawerItemList
        {...props}
        itemStyle={styles.drawerSettingItemStyle}
        labelStyle={styles.drawerSettingLabelStyle}
        activeBackgroundColor={colors.OCEAN_BLUE}
        inActiveBackgroundColor={colors.WHITE_FA}
        activeTintColor={"#fff"}
        inactiveTintColor={colors.BROWNISH_GREY}
      />
    </DrawerContentScrollView>
  );
};

export const CustomDrawerIcon = ({ source }) => (
  <Image source={source} style={styles.iconStyle} />
);

const styles = StyleSheet.create({
  drawer: { backgroundColor: "#0764B0", flex: 1 },
  drawerSetting: { backgroundColor: colors.WHITE_FA },
  drawerContainer: {
    margin: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    marginTop: scaleHeight(50),
    width: "100%",
    flex: 1,
  },

  itemStyle: {
    height: scaleHeight(60),
    justifyContent: "center",
    marginLeft: 0, // !important
    borderRadius: 0, // !important
    margin: 0,
    marginVertical: 0, // !important
  },

  drawerSettingItemStyle: {
    marginLeft: 0,
    height: scaleHeight(60),
    width: "100%",
    justifyContent: "center",
    padding: 0,
    margin: 0,
    borderRadius: 0,
  },

  labelStyle: {
    fontSize: scaleFont(18),
    fontFamily: fonts.REGULAR,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",

    width: scaleWidth(191),
  },

  drawerSettingLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
  },

  iconStyle: {
    width: scaleWidth(22),
    height: scaleHeight(22),
    resizeMode: "center",
    marginLeft: scaleWidth(8),
  },
});
