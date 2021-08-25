import React from "react";
import { StyleSheet, Platform, View, Text } from "react-native";
import CheckBox from "@react-native-community/checkbox";

export const CustomCheckBox = ({
  normalColor = "#fff",
  selectedColor = "transparent",
  onCheckColor = "#0764b0",
  disabled = false,
  style,
  label,
  checkBoxStyle,
  onAnimationType,
  offAnimationType,
  textStyle,
  defaultValue,
  onValueChange,
  editable = true,
  ...props
}) => {
  const [toggle, setToggle] = React.useState();

  const onHandleChange = () => {
    if (!editable) return;

    const isChange = !toggle;
    setToggle(isChange);
    if (onValueChange && typeof onValueChange === "function") {
      onValueChange(isChange);
    }
  };

  React.useEffect(() => {
    setToggle(defaultValue);
  }, [defaultValue]);

  return (
    <View style={[styles.layout, style]}>
      <CheckBox
        style={Platform.OS === "ios" && [styles.checkBoxStyle, checkBoxStyle]}
        boxType="square"
        tintColors={{ true: selectedColor, false: normalColor }}
        tintColor={normalColor}
        onCheckColor={onCheckColor ?? normalColor}
        onTintColor={selectedColor}
        onFillColor={selectedColor}
        animationDuration={0.25}
        disabled={disabled}
        onAnimationType={onAnimationType ?? "stroke"}
        offAnimationType={offAnimationType ?? "stroke"}
        {...props}
        value={toggle}
        onValueChange={onHandleChange}
      />
      {!!label && <Text style={[styles.text, textStyle]}>{label}</Text>}
    </View>
  );
};

export const CustomTableCheckBox = (props) => (
  <CustomCheckBox {...props} checkBoxStyle={styles.customCheckBox} />
);

const styles = StyleSheet.create({
  checkBoxStyle: {
    marginRight: scaleWidth(15),
    width: scaleWidth(22),
    height: scaleHeight(22),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },

  layout: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
  },

  text: {
    fontFamily: "Roboto-Medium",
    fontSize: scaleFont(20),
    color: "#fff",
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
  },

  customCheckBox: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
