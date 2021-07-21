import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, colors } from "@shared/themes";
import { CustomInput } from "./CustomInput";
import { useTranslation } from "react-i18next";

export const FormFullName = React.forwardRef(
  (
    {
      firstName,
      lastName,
      onChangeFirstName,
      onChangeLastName,
      title,
      editable = true,
      required = true,
    },
    ref
  ) => {
    const [t] = useTranslation();

    const [firstNameValue, setFirstName] = React.useState(firstName);
    const [lastNameValue, setLastName] = React.useState(lastName);

    const onHandleChangeFirstName = (txt) => {
      setFirstName(txt);
      if (onChangeFirstName && typeof onChangeFirstName === "function") {
        onChangeFirstName(txt);
      }
    };

    const onHandleChangeLastName = (txt) => {
      setLastName(txt);
      if (onChangeLastName && typeof onChangeLastName === "function") {
        onChangeLastName(txt);
      }
    };

    React.useImperativeHandle(ref, () => ({
      updateFirstName: (str) => {
        setFirstName(str);
      },
      updateLastName: (str) => {
        setLastName(str);
      },
    }));

    React.useEffect(() => {
      if (firstName != firstNameValue) {
        setFirstName(firstName);
      }
    }, [firstName]);

    React.useEffect(() => {
      if (lastName != lastNameValue) {
        setLastName(lastName);
      }
    }, [lastName]);

    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          {title ?? t("Full Name")}{" "}
          {required && <Text style={styles.requiredStyle}>*</Text>}
        </Text>
        <View style={styles.content}>
          <CustomInput
            style={styles.customInput}
            textInputProps={{
              placeholder: t("First Name"),
              fontSize: scaleFont(17),
              textAlign: "left",
              defaultValue: firstNameValue,
              onChangeText: onHandleChangeFirstName,
              editable: editable,
            }}
          />
          <View style={styles.horizontalPadding} />
          <CustomInput
            style={styles.customInput}
            textInputProps={{
              placeholder: t("Last Name"),
              fontSize: scaleFont(17),
              textAlign: "left",
              defaultValue: lastNameValue,
              onChangeText: onHandleChangeLastName,
              editable: editable,
            }}
          />
        </View>
      </View>
    );
  }
);

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
