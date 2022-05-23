import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";

export const ColumnContainer = ({
  children,
  highlight = false,
  style,
  border,
}) => {
  return (
    <View
      style={[
        style,
        {
          backgroundColor: colors.WHITE_FA,
          ...(highlight && styles.highlight),
          ...(!highlight && styles.unHighlight),
          ...(border && styles.border),
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    ...Platform.select({
      ios: {
        shadowColor: colors.GREYISH_BROWN_50,
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  unHighlight: {
    ...Platform.select({
      ios: {
        shadowColor: "#40404026",
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  border: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.VERY_LIGHT_PINK,
  },
});
