import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { Linking, StyleSheet, Text, Image, View } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { AgencyLogo } from "../AgencyLogo";
import IMAGE from "@resources";
import { WithDialogStaffLogTime } from "@shared/HOC/withDialogStaffLogTime";

const CustomDrawerItem = ({ label, isFocused, icon, onPress }) => (
  <DrawerItem
    style={[
      styles.drawerItemContent,
      isFocused && styles.drawerItemActiveContent,
    ]}
    label={() => <CustomDrawerLabel label={label} isFocused={isFocused} />}
    icon={icon}
    onPress={onPress}
  />
);

const StaffLogTime = WithDialogStaffLogTime(CustomDrawerItem);

export const CustomDrawerContent = (props) => {
  const { state, descriptors, navigation } = props;
  const { routes } = state;
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        style={layouts.fill}
        contentContainerStyle={styles.drawerContentContainerStyle}
        bounces={false}
      >
        {routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            options.title !== undefined
              ? options.title
              : options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : route.name;

          const isFocused = state.index === index;

          let icon = options.drawerIcon;
          if (typeof icon === "undefined") {
            icon = () => (
              <CustomDrawerIcon source={options.icon} isFocused={isFocused} />
            );
          } else {
            icon = () => options.drawerIcon({ focused: isFocused });
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          return (
            <CustomDrawerItem
              key={`drawer-${route.key}`}
              isFocused={isFocused}
              label={label}
              icon={icon}
              onPress={onPress}
            />
          );
        })}

        <StaffLogTime
          {...props}
          label="Staff LogTime"
          icon={() => <CustomDrawerIcon source={IMAGE["Timekeeping"]} />}
          onShowed={() => {
            navigation?.closeDrawer();
          }}
          // style={styles.itemStyle}
          // labelStyle={styles.labelStyle}
          activeBackgroundColor="#0764B0"
          inActiveBackgroundColor="#0764B0"
          inactiveTintColor="#FFFFFF"
        />
      </DrawerContentScrollView>
      <AgencyLogo />
    </View>
  );
};

export const CustomDrawerIcon = ({ source, isFocused }) => (
  <Image
    source={source}
    style={[styles.iconStyle, { tintColor: isFocused ? "#FFC130" : "#fff" }]}
  />
);

export const CustomDrawerLabel = ({ label, isFocused }) => (
  <Text
    style={[styles.labelStyle, { color: isFocused ? "#FFC130" : "#fff" }]}
  >{` ${label} `}</Text>
);

const styles = StyleSheet.create({
  drawerContentContainerStyle: {
    justifyContent: "center",
    flex: 1,
    padding: 0,
    margin: 0,
    paddingHorizontal: 0,
    paddingLeft: 0,
    width: "100%",
  },

  drawerItemContent: {
    backgroundColor: "transparent",
  },

  drawerItemLabel: {
    backgroundColor: "transparent",
  },

  drawerItemActiveContent: {
    backgroundColor: "transparent",
  },

  container: {
    flex: 1,
    backgroundColor: "#0764B0",
  },

  itemStyle: {
    height: scaleHeight(60),
    justifyContent: "center",
    marginLeft: 0, // !important
    borderRadius: 0, // !important
    margin: 0,
    marginVertical: 0, // !important
  },

  labelStyle: {
    fontSize: scaleFont(18),
    fontFamily: fonts.REGULAR,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    width: "100%",
  },

  iconStyle: {
    width: scaleWidth(22),
    height: scaleHeight(22),
    resizeMode: "center",
    marginLeft: scaleWidth(8),
  },
});
