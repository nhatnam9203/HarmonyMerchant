import IMAGE from "@resources";
import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const FormFilter = ({ filterValue, onClearFilter }) => {
  const [t] = useTranslation();

  const onHandleClearFilter = () => {
    if (onClearFilter && typeof onClearFilter === "function") {
      onClearFilter("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{filterValue}</Text>
      <TouchableOpacity onPress={onHandleClearFilter}>
        <Image source={IMAGE.IconButtonStatusClose} style={styles.imageStyle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingRight: scaleWidth(10),
    height: "100%",
    alignItems: "center",
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(16),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  imageStyle: {
    marginHorizontal: scaleWidth(5),
    width: scaleWidth(26),
    height: scaleHeight(26),
  },
});
