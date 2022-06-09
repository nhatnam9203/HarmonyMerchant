import React from "react";
import { View, Text } from "react-native";
import { fonts, colors } from "@shared/themes";

export const Header = ({ label, alignment = "left", children, style }) => {
  return (
    <View
      style={{
        height: scaleHeight(48),
        backgroundColor: colors.VERY_LIGHT_PINK_1,
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: colors.VERY_LIGHT_PINK,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: scaleWidth(10),
        ...style,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.MEDIUM,
          fontSize: scaleFont(20),
          color: colors.GREYISH_BROWN,
          textAlign: alignment,
          width: "100%",
        }}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};
