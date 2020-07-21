import React from "react";
import { View, Text } from "react-native";

export function HeaderTitle({ title, style = {} }) {
  return (
    <Text
      style={[style, { fontSize: 17, fontWeight: "bold", color: "#404040" }]}
    >
      {title}
    </Text>
  );
}
