import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Image } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import IMAGE from "@resources";

export const DropdownMenu = React.forwardRef(
  (
    {
      width,
      height = scaleHeight(38),
      onChangeValue,
      items,
      defaultIndex = -1,
      style,
      placeholder = "Select ...",
    },
    ref
  ) => {
    const [t] = useTranslation();

    const [options, setOptions] = React.useState(items);
    const [item, setItem] = React.useState();
    const [open, setOpen] = React.useState(false);

    React.useImperativeHandle(ref, () => ({}));

    const onSelect = (idx, value) => {
      setItem(value);
      if (onChangeValue && typeof onChangeValue === "function") {
        onChangeValue(value);
      }
    };

    const onDropdownWillShow = () => {
      setOpen(true);
    };

    const onDropdownWillHide = () => {
      setOpen(false);
    };

    const renderRow = (option, index, isSelected) => {
      return (
        <View
          style={[
            styles.dropDownItemContent,
            width && { width },
            height && { height },
          ]}
        >
          <Text
            style={
              isSelected ? styles.selectedItemLabelStyle : styles.itemLabelStyle
            }
          >
            {option?.label}
          </Text>
        </View>
      );
    };

    return (
      <View
        style={[
          styles.container,
          style,
          width && { width },
          height && { height },
        ]}
      >
        <ModalDropdown
          defaultIndex={defaultIndex}
          options={options}
          style={[width && { width }]}
          dropdownStyle={[styles.dropDownContainerStyle, width && { width }]}
          renderRow={renderRow}
          onDropdownWillShow={onDropdownWillShow}
          onDropdownWillHide={onDropdownWillHide}
          onSelect={onSelect}
        >
          <View style={styles.dropdownContent}>
            <Text
              style={[
                styles.dropdownTerminalText,
                item?.label && { color: colors.GREYISH_BROWN },
              ]}
            >
              {item?.label ?? placeholder}
            </Text>
            <Image
              source={IMAGE.dropdown}
              style={[
                styles.imageStyle,
                open && { transform: [{ rotate: "180deg" }] },
              ]}
            />
          </View>
        </ModalDropdown>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {},

  dropdownContent: {
    borderRadius: scaleWidth(1),
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: colors.PINKISH_GREY,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    paddingHorizontal: scaleWidth(16),
  },

  dropDownContainerStyle: {
    borderRadius: scaleWidth(3),
    backgroundColor: colors.WHITE,
    borderWidth: scaleWidth(0),
    borderLeftWidth: scaleWidth(1),
    borderRightWidth: scaleWidth(1),
    borderBottomWidth: scaleWidth(1),
    borderStyle: "solid",
    borderColor: colors.PINKISH_GREY,

    shadowColor: "#0006",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,

    elevation: 3,
  },

  dropDownItemContent: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: scaleWidth(16),
  },

  dropdownTerminalText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.INACTIVE,
    flex: 1,
  },

  selectedItemLabelStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "400",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: colors.ROBIN_S_EGG,
  },

  itemLabelStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "400",
    fontStyle: "normal",
    letterSpacing: 1,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  imageStyle: {
    width: scaleWidth(20),
    height: scaleHeight(8),
    resizeMode: "center",
  },
});
