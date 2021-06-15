import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { fonts, colors } from "@shared/themes";

export const ButtonOverall = ({ amount = 0, label = "Label" }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.amountStyle}>{amount}</Text>
      <Text style={styles.labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(160),
    height: scaleHeight(100),
    borderRadius: scaleWidth(5),
    backgroundColor: colors.WHITE,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  amountStyle: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(23),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.OCEAN_BLUE,
  },

  labelStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(15),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },
});
