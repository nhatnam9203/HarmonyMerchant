import React from "react";
import { View, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { colors, fonts, layouts } from "@shared/themes";

const CountryCodes = [
  { label: "🇺🇸 US", code: "+1", value: "+1" },
  { label: "🇻🇳 VN", code: "+84", value: "+84" },
];

export const ButtonCountryCode = ({
  width,
  height,
  onChangeValue,
  defaultValue = CountryCodes[0].value,
  dropDownDirection,
  editable,
}) => {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(defaultValue);

  const onHandleChange = (value) => {
    // !! tim item === value change nguyen cuc item de xu li
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
    <View style={[styles.container, { width, height }]}>
      <DropDownPicker
        value={item}
        items={CountryCodes}
        open={open}
        setOpen={setOpen}
        setValue={setItem}
        onChangeValue={onHandleChange}
        style={styles.dropdownContent}
        textStyle={styles.dropdownTerminalText}
        selectedItemLabelStyle={styles.selectedItemLabelStyle}
        listItemLabelStyle={styles.itemLabelStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        placeholderStyle={styles.dropdownTerminalPlaceholder}
        dropDownDirection={dropDownDirection ?? "AUTO"}
        scrollViewProps={{
          decelerationRate: "fast",
        }}
        itemKey="label"
        closeAfterSelecting={true}
        showTickIcon={false}
        disabled={!editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "100%",
  },

  dropdownContent: {
    borderRadius: scaleWidth(1),
    height: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
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
