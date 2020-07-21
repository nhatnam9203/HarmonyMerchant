import React from "react";
import { Text, StyleSheet } from "react-native";

const MARGIN_Y = 10;

export default function HeaderTitle({ title, style = {} }) {
  return (
    <Text
      style={[
        style,
        {
          fontSize: 17,
          fontWeight: "bold",
          color: "#404040",
          marginVertical: MARGIN_Y,
        },
      ]}
    >
      {title}
    </Text>
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
