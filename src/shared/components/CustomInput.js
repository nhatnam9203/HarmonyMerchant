import { colors } from "@shared/themes";
import { isEmpty } from "ramda";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

export const CustomInput = React.forwardRef(
  (
    {
      style,
      textInputProps: {
        defaultValue,
        fontSize,
        textAlign,
        onChangeText,
        textInputStyle,
        ...textInputProps
      },
      formatText,
      children,
    },
    ref
  ) => {
    const textInputRef = React.useRef(null);
    const [value, setValue] = React.useState(null);
    const onHandleChangeText = (text) => {
      let val = text;
      if (formatText && typeof formatText === "function") {
        val = formatText(text);
      }
      setValue(val);
      if (onChangeText && typeof onChangeText === "function") {
        onChangeText(val);
      }
    };

    React.useEffect(() => {
      if (defaultValue != null && defaultValue != value) {
        if (typeof defaultValue === "string") {
          setValue(defaultValue);
        } else setValue(defaultValue + "");
      }
    }, [defaultValue]);

    React.useImperativeHandle(ref, () => ({
      clear: () => {
        setValue("");
      },
    }));

    return (
      <View style={[styles.container, style]}>
        <TextInput
          ref={textInputRef}
          onChangeText={onHandleChangeText}
          {...textInputProps}
          value={value}
          style={[
            styles.textInput,
            textAlign && { textAlign },
            value?.length > 0
              ? [styles.textEditStyle, fontSize && { fontSize }]
              : [styles.textPlaceholderStyle, fontSize && { fontSize }],
            textInputStyle,
          ]}
        />
        {children}
      </View>
    );
  }
);

export const CustomInputMask = ({
  style,
  textInputProps: {
    defaultValue,
    fontSize,
    textAlign,
    onChangeText,
    ...textInputProps
  },
  children,
  options,
  type,
}) => {
  const [value, setValue] = React.useState(null);
  const onHandleChangeText = (text) => {
    setValue(text);
    if (onChangeText && typeof onChangeText === "function") {
      onChangeText(text);
    }
  };

  React.useEffect(() => {
    if (defaultValue != null && defaultValue !== value) {
      if (typeof defaultValue == "string") {
        setValue(defaultValue);
      } else setValue(defaultValue + "");
    }
  }, [defaultValue]);

  return (
    <View style={[styles.container, style]}>
      <TextInputMask
        type={type ?? "custom"}
        options={
          options ?? {
            mask: "999-999-9999",
          }
        }
        {...textInputProps}
        onChangeText={onHandleChangeText}
        value={value}
        style={[
          styles.textInput,
          textAlign && { textAlign },
          !isEmpty(value)
            ? [styles.textEditStyle, fontSize && { fontSize }]
            : [styles.textPlaceholderStyle, fontSize && { fontSize }],
        ]}
      />
      {children}
    </View>
  );
};

export const CustomInputMoney = ({
  style,
  textInputProps: {
    defaultValue,
    fontSize,
    textAlign,
    onChangeText,
    textInputStyle,
    ...textInputProps
  },
  children,
}) => {
  const [value, setValue] = React.useState(null);

  const onHandleChangeText = (text) => {
    console.log(text);

    setValue(text);
    if (onChangeText && typeof onChangeText === "function") {
      onChangeText(text);
    }
  };

  const onEndEditing = () => {
    let num = 0.0;
    if (!value || value?.trim().length <= 0 || isNaN(value)) {
      num = null;
    } else {
      num = parseFloat(value)
        ?.toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
    }
    setValue(num);
    if (onChangeText && typeof onChangeText === "function") {
      onChangeText(num);
    }
  };

  React.useEffect(() => {
    if (defaultValue != null && defaultValue != value) {
      if (typeof defaultValue === "string") {
        setValue(defaultValue);
      } else setValue(defaultValue + "");
    }
  }, [defaultValue]);

  return (
    <View style={[styles.container, style]}>
      <TextInput
        onChangeText={onHandleChangeText}
        onEndEditing={onEndEditing}
        {...textInputProps}
        value={value}
        style={[
          styles.textInput,
          textAlign && { textAlign },
          value?.length > 0
            ? [styles.textEditStyle, fontSize && { fontSize }]
            : [styles.textPlaceholderStyle, fontSize && { fontSize }],
          textInputStyle,
        ]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 1,
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    width: scaleWidth(400),
    height: scaleHeight(48),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: scaleWidth(8),
  },

  textInput: {
    height: scaleHeight(26),
    fontSize: scaleFont(20),
    textAlign: "center",
    fontStyle: "normal",
    flex: 1,
  },

  textPlaceholderStyle: {
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    letterSpacing: 0,
    color: colors.INACTIVE,
  },

  textEditStyle: {
    color: colors.GREYISH_BROWN,
    letterSpacing: 1,
    fontWeight: "500",
    fontFamily: "Roboto-Medium",
  },
});
