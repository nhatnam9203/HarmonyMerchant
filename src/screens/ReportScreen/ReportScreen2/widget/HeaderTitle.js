import React from "react";
import { Text, StyleSheet } from "react-native";

const MARGIN_Y = 10;
const MARGIN_X = 20;
const TEXT_DEFAULT_FONT_SIZE = 17;

export default function HeaderTitle({ title, style = {} }) {
  return <Text style={[style, styles.text]}>{title}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: TEXT_DEFAULT_FONT_SIZE,
    fontWeight: "bold",
    color: "#404040",
    marginVertical: MARGIN_Y,
    textTransform: "uppercase",
    marginHorizontal: MARGIN_X,
  },
});
