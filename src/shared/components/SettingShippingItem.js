import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { CustomCheckBox } from "./CustomCheckBox";
import { FormInput, FormInputMask } from "./FormInput";
import { useTranslation } from "react-i18next";

export const SettingShippingItem = ({
  onValueChange,
  isCheck,
  label = "Shipping",
  item,
}) => {
  const { t } = useTranslation();

  const onChangeLabel = (val) => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(Object.assign({}, item, { label: val }));
    }
  };

  const onChangeMount = (val) => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(Object.assign({}, item, { amount: val }));
    }
  };

  const onCheck = () => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(!isCheck);
    }
  };

  return (
    <View style={styles.content}>
      {!item && (
        <View>
          <CustomCheckBox
            style={{ flexDirection: "row" }}
            textStyle={styles.textStyle}
            label={label}
            defaultValue={isCheck}
            onValueChange={onCheck}
          />
        </View>
      )}
      {item && (
        <View style={styles.item}>
          <View style={styles.marginHorizontal} />

          <FormInput
            style={styles.input}
            label={t("Label")}
            placeholder={t("Enter shipping name")}
            // required={true}
            onChangeValue={onChangeLabel}
            defaultValue={item?.label}
          />
          <View style={styles.marginHorizontal} />
          <FormInputMask
            style={styles.inputAmount}
            label={t("Amount")}
            placeholder={t("Enter amount")}
            // required={true}
            onChangeValue={onChangeMount}
            defaultValue={item?.amount + ""}
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
    marginVertical: scaleHeight(20),
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
