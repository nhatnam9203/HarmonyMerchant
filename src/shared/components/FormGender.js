import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, colors } from "@shared/themes";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

const GenderTypes = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

export const FormGender = ({ width, height, onChangeValue, defaultValue }) => {
  const [t] = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(null);

  const onHandleChange = (value) => {
    if (onChangeValue && typeof onChangeValue === "function") {
      onChangeValue(value);
    }
  };

  React.useEffect(() => {
    if (defaultValue) {
      setItem(defaultValue);
    }
  }, [defaultValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t("Gender")}</Text>
      <View style={styles.content}>
        <DropDownPicker
          value={item}
          items={GenderTypes}
          open={open}
          setOpen={setOpen}
          setValue={setItem}
          onChangeValue={onHandleChange}
          style={[styles.dropdownContent, { width, height }]}
          textStyle={styles.dropdownTerminalText}
          selectedItemLabelStyle={styles.selectedItemLabelStyle}
          listItemLabelStyle={styles.itemLabelStyle}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          placeholderStyle={styles.dropdownTerminalPlaceholder}
          dropDownDirection="AUTO"
          scrollViewProps={{
            decelerationRate: "fast",
          }}
          itemKey="label"
          closeAfterSelecting={true}
          showTickIcon={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
    flex: 1,
  },

  content: {
    paddingVertical: scaleHeight(10),
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

  dropdownContent: {
    borderRadius: scaleWidth(1),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    width: "100%",
  },

  dropDownContainerStyle: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
  },

  dropdownTerminalText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "400",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  dropdownTerminalPlaceholder: {
    fontFamily: "Roboto-Light",
    fontWeight: "300",
    letterSpacing: 0,
    color: colors.INACTIVE,
    textAlign: "left",
  },

  selectedItemLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.ROBIN_S_EGG,
  },

  itemLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
