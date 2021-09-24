import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { fonts, colors } from "@shared/themes";
import { layouts } from "../themes";
import { TextInputMask } from "react-native-masked-text";
const MIN = 1;

export const FormInputAmount = ({
  label,
  defaultValue = MIN,
  onChangeValue,
}) => {
  const [amount, setAmount] = React.useState(defaultValue);

  const increment = () => {
    setAmount(+amount + 1);
  };

  const decrement = () => {
    if (+amount <= MIN) {
      setAmount(MIN);
    } else {
      setAmount(amount - 1);
    }
  };

  const onHandleChange = (text) => {
    if (onChangeValue && typeof onChangeValue === "function") {
      setAmount(text);
      onChangeValue(text);
    }
  };

  React.useEffect(() => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(amount);
    }
  }, [amount]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={layouts.marginVertical} />
      <View style={styles.inputContent}>
        <Pressable
          style={[styles.button, styles.border]}
          onPress={decrement}
          disable={amount <= MIN}
        >
          <Text style={styles.textStyle}>-</Text>
        </Pressable>
        <View style={layouts.marginHorizontal} />
        <TextInputMask
          type="only-numbers"
          keyboardType="numeric"
          style={styles.input}
          value={amount + ""}
          onChangeText={onHandleChange}
        />
        <View style={layouts.marginHorizontal} />
        <Pressable style={[styles.button, styles.border]} onPress={increment}>
          <Text style={styles.textStyle}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  button: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    justifyContent: "center",
    alignItems: "center",
  },

  border: {
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: colors.OCEAN_BLUE,
  },

  inputContent: {
    flexDirection: "row",
  },

  input: {
    width: scaleWidth(48),
    height: scaleHeight(40),
    backgroundColor: colors.WHITE_FA,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#cccccc",
    textAlign: "center",
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },
});
