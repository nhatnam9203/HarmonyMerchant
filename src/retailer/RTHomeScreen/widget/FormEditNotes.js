import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ButtonGradient, CustomCheckBox } from "@shared/components";
import { useTranslation } from "react-i18next";
import { layouts, colors, fonts } from "@shared/themes";
import { ORDERED_STATUS } from "@shared/components/OrderStatusView";

export const FormEditNotes = ({
  onSubmitNotes,
  defaultValue,
  isShowButtonSubmit = true,
  onChangeValue,
  orderStatus,
  onDidNotPayCheck,
}) => {
  const [t] = useTranslation();
  const [notes, setNotes] = React.useState(defaultValue);

  const onHandleSubmitNotes = () => {
    if (!notes) {
      return;
    }

    if (onSubmitNotes && typeof onSubmitNotes === "function") {
      onSubmitNotes(notes);
    }
  };

  const onHandleChangeText = (text) => {
    setNotes(text);
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(text);
    }
  };

  const setToggleCheckBox = (bl) => {
    if (onDidNotPayCheck && typeof onDidNotPayCheck === "function") {
      onDidNotPayCheck(bl);
    }
  };

  React.useEffect(() => {
    setNotes(defaultValue);
  }, [defaultValue]);

  return (
    <View style={styles.container}>
      {orderStatus === ORDERED_STATUS.PENDING && (
        <CustomCheckBox
          label={t("Did not pay")}
          onValueChange={setToggleCheckBox}
          selectedColor={colors.OCEAN_BLUE}
          onCheckColor="#fff"
          textStyle={styles.textStyle}
          style={{ height: scaleHeight(40) }}
        />
      )}
      <Text>{t("Comment Text")}</Text>
      <View style={layouts.marginVertical} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#C5C5C5"
        multiline={true}
        value={notes}
        onChangeText={onHandleChangeText}
      />
      <View style={layouts.marginVertical} />
      <View style={layouts.marginVertical} />
      {isShowButtonSubmit && (
        <ButtonGradient
          label={t("Submit notes")}
          width={scaleWidth(140)}
          height={scaleHeight(40)}
          fontSize={scaleFont(17)}
          textWeight="normal"
          onPress={onHandleSubmitNotes}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: "100%",
  },

  textInput: {
    height: scaleHeight(60),
    borderWidth: scaleWidth(1),
    borderColor: "#C5C5C5",
    textAlignVertical: "top",
    padding: scaleWidth(16),
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.OCEAN_BLUE,
    // textDecorationLine: "underline",
  },
});
