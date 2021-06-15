import React from "react";
import { Text, StyleSheet, View } from "react-native";

const MARGIN_Y = 10;
const MARGIN_X = 20;
const TEXT_DEFAULT_FONT_SIZE = 17;

export default function HeaderTitle({ title, style = {}, subTitle }) {
  return !!subTitle ? (
    <View style={styles.horizonLayout}>
      <Text style={[style, styles.text]}>{title + " -"}</Text>
      <Text style={[style, styles.txtName]}>{subTitle}</Text>
    </View>
  ) : (
    <Text style={[style, styles.text]}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  horizonLayout: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: TEXT_DEFAULT_FONT_SIZE,
    fontWeight: "bold",
    color: "#404040",
    marginVertical: MARGIN_Y,
    textTransform: "uppercase",
    marginHorizontal: MARGIN_X,
  },
  txtName: {
    color: "#0764B0",
    fontWeight: "bold",
    fontSize: 17,
  },
});
