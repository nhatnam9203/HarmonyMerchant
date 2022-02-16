import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "@shared/themes";

export const CustomTextInput = React.forwardRef((props, ref) => {
  const {
    width = scaleWidth(180),
    height = scaleHeight(42),
    textAlign = "center",
    style,
    textStyle,
    value,
    ...textInputProps
  } = props;

  React.useImperativeHandle(ref, () => ({}));

  return (
    <View style={[styles.container, styles.border, style, { width, height }]}>
      <TextInput
        value={value}
        style={[
          styles.textInput,
          { textAlign: textAlign },
          value?.length > 0
            ? styles.textEditStyle
            : styles.textPlaceholderStyle,
          textStyle,
        ]}
        {...textInputProps}
      ></TextInput>
    </View>
  );
});

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
  },

  textEditStyle: {
    color: colors.GREYISH_BROWN,
    letterSpacing: 1,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
});
