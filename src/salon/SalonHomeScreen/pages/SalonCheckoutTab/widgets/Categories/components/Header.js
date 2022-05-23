import React from "react";
import { View, Text } from "react-native";
import { fonts, colors } from "@shared/themes";

export const Header = ({ label }) => {
  return (
    <View
      style={{
        height: scaleHeight(48),
        backgroundColor: colors.VERY_LIGHT_PINK_1,
        borderBottomColor: colors.VERY_LIGHT_PINK_C_5,
        borderBottomWidth: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: fonts.MEDIUM,
          fontSize: scaleFont(20),
          color: colors.GREYISH_BROWN,
        }}
      >
        {label}
      </Text>
    </View>
  );
};
