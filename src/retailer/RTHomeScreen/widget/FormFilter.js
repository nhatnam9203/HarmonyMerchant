import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { layouts, fonts, colors } from "@shared/themes";
import IMAGE from "@resources";

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
    paddingHorizontal: scaleWidth(5),
    height: "100%",
    alignItems: "center",
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
  },

  imageStyle: {
    marginHorizontal: scaleWidth(5),
    width: scaleWidth(28),
    height: scaleHeight(28),
  },
});