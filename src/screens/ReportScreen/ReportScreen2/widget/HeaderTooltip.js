import React from "react";
import { View, StyleSheet } from "react-native";

const MARGIN_Y = 10;
const TOOLTIP_DEFAULT_HEIGHT = 50;

export default function HeaderTooltip({ children }) {
  return (
    <View
      style={{
        height: TOOLTIP_DEFAULT_HEIGHT,
        marginVertical: MARGIN_Y,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {children && children}
    </View>
  );
}

const styles = StyleSheet.create({
  borderStyle: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    borderRadius: 4,
    backgroundColor: "rgb(246,246,246)",
  },
});
