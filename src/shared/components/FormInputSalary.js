import { layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { CustomInputMask } from "./CustomInput";
export const FormInputSalary = ({
  label,
  defaultValue,
  onChangeText,
  editable = false,
}) => {
  const [t] = useTranslation();
  const [salary, setSalary] = React.useState(null);
  const [disabled, setDisabled] = React.useState(editable);
  const onHandleChange = (value) => {
    setSalary(value);
    if (onChangeText && typeof onChangeText === "function") {
      onChangeText(value);
    }
  };

  React.useEffect(() => {
    if (defaultValue) {
      setSalary(defaultValue);
    }
  }, [defaultValue]);

  React.useEffect(() => {
    if (!editable) {
      setSalary(null);
      //   onChangeText(null);
    }
    setDisabled(editable);
  }, [editable]);

  return (
    <View style={styles.containerInputSalary}>
      <Text style={layouts.fontLightBrown}>{label}</Text>
      <CustomInputMask
        type={"money"}
        autoFocus={true}
        options={{
          precision: 2,
          separator: ".",
          delimiter: ",",
          unit: "",
          suffixUnit: "",
        }}
        style={{
          width: scaleWidth(240),
          backgroundColor: !disabled ? "#BCBCBC" : "#fff",
        }}
        textInputProps={{
          placeholder: "0.00",
          fontSize: scaleFont(17),
          textAlign: "left",
          defaultValue: salary,
          onChangeText: onHandleChange,
          editable: disabled,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerInputSalary: {
    ...layouts.horizontal,
    ...layouts.horizontalSpaceBetween,
    width: scaleWidth(440),
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(25),
    alignSelf: `flex-end`,
  },
});
