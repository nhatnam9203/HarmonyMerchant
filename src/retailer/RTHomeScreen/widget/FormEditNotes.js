import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { ButtonGradient } from "@shared/components";
import { useTranslation } from "react-i18next";
import { layouts } from "@shared/themes";

export const FormEditNotes = ({
  onSubmitNotes,
  defaultValue,
  isShowButtonSubmit = true,
  onChangeValue,
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

  React.useEffect(() => {
    setNotes(defaultValue);
  }, [defaultValue]);

  return (
    <View>
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
  textInput: {
    height: scaleHeight(80),
    borderWidth: scaleWidth(1),
    borderColor: "#C5C5C5",
    textAlignVertical: "top",
    padding: scaleWidth(16),
  },
});
