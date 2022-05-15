import React from "react";
import { View } from "react-native";

export const ViewFull = ({ children, style, ...props }) => {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
};
