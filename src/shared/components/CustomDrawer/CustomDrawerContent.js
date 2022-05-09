import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { Linking, StyleSheet, Text, Image } from "react-native";
import { colors, fonts } from "@shared/themes";
import { AgencyLogo } from "../AgencyLogo";

export const CustomDrawerContent = (props) => {
  const { state, descriptors, navigation } = props;
  const { routes } = state;
  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawer}
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
      {/* <CustomDrawerItem
        key={`drawer-about`}
        isFocused={false}
        label="About"
        onPress={() => Linking.openURL("https://mywebsite.com/help")}
      /> */}
      <AgencyLogo />
    </DrawerContentScrollView>
  );
};

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

  drawer: { backgroundColor: "#0764B0", flex: 1 },

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
