import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";
import { fonts } from "@shared/themes";

import IMAGE from "@resources";

const SCROLL_PAGE_DEFAULT = 0;

const ACTIVE_BG_COLOR = "#0764B0";
const INACTIVE_BG_COLOR = "#FAFAFA";

const ACTIVE_TEXT_COLOR = "#fff";
const INACTIVE_TEXT_COLOR = "#0764B0";

const TAB_DEFAULT_HEIGHT = scaleWidth(40);

export const CustomTopTab = ({
  state,
  descriptors,
  navigation,
  position,
  width,
}) => {
  const renderTab = (name, page, isTabActive, onPress) => {
    const activeTextColor = isTabActive
      ? ACTIVE_TEXT_COLOR
      : INACTIVE_TEXT_COLOR;
    const activeBackgroundColor = isTabActive
      ? ACTIVE_BG_COLOR
      : INACTIVE_BG_COLOR;

    return (
      <TouchableOpacity
        key={name}
        onPress={onPress}
        style={[styles.tab, { backgroundColor: activeBackgroundColor }]}
      >
        <Text style={[styles.text, { color: activeTextColor }]}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabs, width && { width }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return renderTab(label, index, isFocused, onPress);
      })}
    </View>
  );
};

//================================
//Styles
//================================
const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    height: "100%",
    paddingVertical: scaleWidth(6),
    paddingHorizontal: scaleWidth(16),
  },

  tabs: {
    height: TAB_DEFAULT_HEIGHT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scaleHeight(1),
    borderColor: "#0764B0",
    borderRadius: scaleWidth(10),
    overflow: "hidden",
    alignSelf: "center",
    width: scaleWidth(480),
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(20),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
  },
});
