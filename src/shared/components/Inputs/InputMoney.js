import { TextInputMask } from "react-native-masked-text";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "@shared/themes";

export const InputMoney = (props) => {
  const {
    width = scaleWidth(180),
    height = scaleHeight(42),
    textAlign = "center",
    style,
    textStyle,
    value = "0",
    ...txtInputProps
  } = props;

  return (
    <View style={[styles.container, styles.border, style, { width, height }]}>
      <TextInputMask
        type={"money"}
        options={{
          precision: 2,
          separator: ".",
          delimiter: ",",
          unit: "$ ",
          suffixUnit: "",
        }}
        style={[
          styles.textInput,
          { textAlign: textAlign },
          value?.length > 0
            ? styles.textEditStyle
            : styles.textPlaceholderStyle,
          textStyle,
        ]}
        placeholder="$ 0.00"
        value={value}
        {...txtInputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    padding: scaleHeight(6),
    flexDirection: "row",
  },

  textInput: {
    fontSize: scaleFont(18),
    fontStyle: "normal",
    flex: 1,
  },

  border: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: scaleWidth(3),
  },

  textPlaceholderStyle: {
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    letterSpacing: 0,
    color: colors.INACTIVE,
    fontSize: scaleFont(16),
  },

  textEditStyle: {
    color: colors.GREYISH_BROWN,
    letterSpacing: 1,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
});
