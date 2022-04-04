import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "@shared/themes";

export const InputText = (props) => {
  const {
    width,
    height,
    textAlign = "center",
    style,
    textStyle,
    value,
    txtInputRef,
    ...txtInputProps
  } = props;

  return (
    <View
      style={[
        styles.container,
        styles.border,
        style,
        { ...(width > 0 && { width }), ...(height > 0 && { height }) },
      ]}
    >
      <TextInput
        ref={txtInputRef}
        style={[
          styles.textInput,
          { textAlign: textAlign },
          value?.length > 0
            ? styles.textEditStyle
            : styles.textPlaceholderStyle,
          textStyle,
        ]}
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
