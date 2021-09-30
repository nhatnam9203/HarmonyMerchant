import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CustomCheckBox } from "./CustomCheckBox";
import { FormInput } from "./FormInput";
import { useTranslation } from "react-i18next";

export const SettingShippingItem = ({
  onValueChange,
  isCheck,
  label = "Shipping",
  item,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.content}>
      <View>
        <CustomCheckBox
          style={{ flexDirection: "row" }}
          textStyle={styles.textStyle}
          label={label}
          defaultValue={isCheck}
          onValueChange={onValueChange}
        />
      </View>
      {item && (
        <View style={styles.item}>
          <View style={styles.marginHorizontal} />

          <FormInput
            style={styles.input}
            label={t("Label")}
            placeholder={t("Enter shipping name")}
            // required={true}
            // onChangeValue={form.handleChange("name")}
            // defaultValue={categoryItem?.name}
          />
          <View style={styles.marginHorizontal} />
          <FormInput
            style={styles.inputAmount}
            label={t("Amount")}
            placeholder={t("Enter amount")}
            // required={true}
            // onChangeValue={form.handleChange("name")}
            // defaultValue={categoryItem?.name}
          />
          <View style={styles.marginHorizontal} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    height: scaleHeight(40),
    // backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: scaleHeight(10),
  },
  textStyle: {
    color: "#404040",
    fontSize: scaleFont(17),
    fontWeight: "600",
    textAlign: "left",
  },
  item: { flexDirection: "row" },
  marginHorizontal: { width: scaleWidth(20) },

  input: { width: scaleWidth(250) },
  inputAmount: { width: scaleWidth(150) },
});
