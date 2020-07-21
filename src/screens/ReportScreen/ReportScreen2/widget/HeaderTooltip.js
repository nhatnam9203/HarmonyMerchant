import React from "react";
import { View, StyleSheet } from "react-native";

const MARGIN_Y = 10;
const TOOLTIP_DEFAULT_HEIGHT = 50;

export default function HeaderTooltip({ children }) {
  return <View style={styles.container}>{children && children}</View>;
}

const styles = StyleSheet.create({
  container: {
    height: TOOLTIP_DEFAULT_HEIGHT,
    marginVertical: MARGIN_Y,
    flexDirection: "row",
    alignItems: "center",
  },
});
