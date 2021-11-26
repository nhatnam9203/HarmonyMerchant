import IMAGE from "@resources";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { CustomCheckBox } from "./CustomCheckBox";
import { FormInput, FormInputMask } from "./FormInput";

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

  const onRemoveItem = () => {
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(Object.assign({}, item, { isDeleted: 1 }));
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

          <TouchableOpacity style={styles.buttonDelete} onPress={onRemoveItem}>
            <Image
              source={IMAGE.DeleteOutline}
              style={{
                width: scaleWidth(24),
                height: scaleHeight(24),
                tintColor: "#ddd",
              }}
            />
          </TouchableOpacity>
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

  buttonDelete: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleHeight(40),
    borderWidth: 1,
    borderColor: "#dadada",
    backgroundColor: "red",
  },
});
