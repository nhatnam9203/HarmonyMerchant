import React from "react";
import { View, Text } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";

export const ColumnContainer = ({ children, isHighlight = false, style }) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: colors.WHITE_FA,
        },
      ]}
    >
      {children}
    </View>
  );
};
