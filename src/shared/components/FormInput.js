import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, colors } from "@shared/themes";
import { CustomInput, CustomInputMask } from "./CustomInput";
import { useTranslation } from "react-i18next";
export const FormInput = ({
  onChangeValue,
  defaultValue,
  required,
  placeholder,
  label,
  style,
  keyboardType,
  editable,
}) => {
  const [t] = useTranslation();
  const onHandleChange = (text) => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(text);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={styles.content}>
        <CustomInput
          style={styles.customInput}
          textInputProps={{
            placeholder: placeholder ?? t("Input here"),
            fontSize: scaleFont(17),
            textAlign: "left",
            defaultValue: defaultValue,
            onChangeText: onHandleChange,
            keyboardType: keyboardType,
            editable: editable,
          }}
        />
      </View>
    </View>
  );
};

export const FormInputMask = ({
  onChangeValue,
  defaultValue,
  required,
  placeholder,
  label,
  style,
  keyboardType,
  options = {
    precision: 2,
    separator: ".",
    delimiter: ",",
    unit: "",
    suffixUnit: "",
  },
  type = "money",
}) => {
  const [t] = useTranslation();
  const onHandleChange = (text) => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(text);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={styles.content}>
        <CustomInputMask
          style={styles.customInput}
          options={options}
          type={type}
          textInputProps={{
            placeholder: placeholder ?? t("Input here"),
            fontSize: scaleFont(17),
            textAlign: "left",
            defaultValue: defaultValue,
            onChangeText: onHandleChange,
            keyboardType: keyboardType,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flexDirection: "row",
    paddingVertical: scaleHeight(10),
    justifyContent: "space-between",
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  customInput: {
    flex: 1,
    height: scaleHeight(40),
  },

  requiredStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.ORANGEY_RED,
  },
});
