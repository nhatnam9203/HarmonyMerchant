import React from "react";
import { View, StyleSheet } from "react-native";

const MARGIN_Y = 10;
const TOOLTIP_DEFAULT_HEIGHT = 50;

export default function HeaderTooltip({ children, rightComponent }) {
  return (
    <View style={styles.container}>
      {children}
      {rightComponent && <View style={styles.right}>{rightComponent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: TOOLTIP_DEFAULT_HEIGHT,
    marginVertical: MARGIN_Y,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  right: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
