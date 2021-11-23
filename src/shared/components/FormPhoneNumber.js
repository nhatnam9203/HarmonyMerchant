import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, colors } from "@shared/themes";
import { CustomInputMask } from "./CustomInput";
import { useTranslation } from "react-i18next";
import { ButtonCountryCode } from "./ButtonCountryCode";
import { formatPhoneNumber, splitCodeAndPhone } from "@shared/utils";

export const FormPhoneNumber = ({
  defaultPhone,
  onChangePhoneNumber,
  hasTitle = true,
  dropDownDirection,
  editable = true,
  required = true,
}) => {
  const [t] = useTranslation();
  const [phoneNumberValue, setPhoneNumber] = React.useState();
  const [phoneCodeValue, setPhoneCode] = React.useState("+1");

  const onHandleChangeValue = (value) => {
    // !! format phone input here
    setPhoneNumber(value);

    if (onChangePhoneNumber && typeof onChangePhoneNumber === "function") {
      if (value?.trim()?.length > 0) {
        onChangePhoneNumber(`${phoneCodeValue}${value?.trim()}`);
      } else {
        onChangePhoneNumber("");
      }
    }
  };

  const onHandleChangeCountryCode = (code) => {
    setPhoneCode(code);
    if (onChangePhoneNumber && typeof onChangePhoneNumber === "function") {
      onChangePhoneNumber(`${code}${phoneNumberValue?.trim()}`);
    }
  };

  React.useEffect(() => {
    if (defaultPhone) {
      const phone = formatPhoneNumber(defaultPhone);
      if (phone) {
        const phoneObject = splitCodeAndPhone(phone);
        setPhoneCode(`+${phoneObject?.areaCode ?? "1"}`);
        setPhoneNumber(phoneObject?.phone);
      }
    }
  }, [defaultPhone]);

  return (
    <View style={styles.container}>
      {hasTitle && (
        <Text style={styles.textStyle}>
          {t("Phone Number")}{" "}
          {required && <Text style={styles.requiredStyle}>*</Text>}
        </Text>
      )}
      <View style={styles.content}>
        <ButtonCountryCode
          onChangeValue={onHandleChangeCountryCode}
          defaultValue={phoneCodeValue}
          width={scaleWidth(120)}
          height={scaleHeight(40)}
          dropDownDirection={dropDownDirection}
          editable={editable}
        />
        <View style={styles.horizontalPadding} />
        <CustomInputMask
          type={"custom"}
          options={{
            mask: "999-999-9999",
          }}
          style={styles.customInput}
          textInputProps={{
            placeholder: t("Enter Phone Number"),
            fontSize: scaleFont(17),
            textAlign: "left",
            defaultValue: phoneNumberValue,
            onChangeText: onHandleChangeValue,
            keyboardType: "phone-pad",
            editable: editable,
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

  requiredStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.ORANGEY_RED,
  },

  customInput: {
    flex: 1,
    height: scaleHeight(40),
  },

  horizontalPadding: {
    width: scaleWidth(16),
  },
});
