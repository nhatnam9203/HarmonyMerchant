import { StyleSheet, Image, TouchableOpacity } from "react-native";
import ICON from "@resources";
import React from "react";
import { colors, layouts } from "@shared/themes";

export const ButtonCheckIn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={ICON.CheckInButtonIcon} style={styles.img} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(48),
    height: scaleHeight(48),
    backgroundColor: colors.WHITE,
    ...layouts.center,
    borderLeftWidth: 1,
    borderColor: "#fff",
  },
  img: {
    width: scaleWidth(28),
    height: scaleHeight(28),
    tintColor: "#3f3f3f",
  },
});
