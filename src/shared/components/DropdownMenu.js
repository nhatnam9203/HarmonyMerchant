import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, Image } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import IMAGE from "@resources";

const log = (obj, message = "") => {
  Logger.log(`[DropdownMenu] ${message}`, obj);
};

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
      editable = true,
    },
    ref
  ) => {
    const [t] = useTranslation();
    const modalRef = React.useRef(null);

    const [options, setOptions] = React.useState(items);
    const [item, setItem] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [widthItemDropDown, setWidthItemDropDown] = React.useState(null);

    React.useImperativeHandle(ref, () => ({
      closePicker: () => {
        setOpen(false);
      },
      setFilterItems: (its) => {
        setOptions(its);
      },
      selectIndex: (index) => {
        setItem(options[index]);
        modalRef.current?.select(index);
      },
    }));

    React.useEffect(() => {
      if (defaultIndex >= 0 && options?.length > defaultIndex) {
        setItem(options[defaultIndex]);
        modalRef.current?.select(defaultIndex);
      }
    }, [defaultIndex, options]);

    // React.useEffect(() => {
    //   setOptions(items);
    // }, [items]);

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
          key={option?.value + ""}
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

    const styleWidthItemDropDown = { width: widthItemDropDown ?? width };
    const styleHeightItemDropDown =
      (height && options?.length < 4 && { height: height * options.length }) ??
      {};

    return (
      <View
        style={[
          styles.container,
          style,
          width && { width },
          height && { height },
        ]}
        onLayout={(event) => {
          setWidthItemDropDown(event.nativeEvent.layout?.width);
        }}
      >
        <ModalDropdown
          ref={modalRef}
          options={options}
          defaultIndex={defaultIndex}
          style={[width && { width }]}
          dropdownStyle={[
            styles.dropDownContainerStyle,
            styleWidthItemDropDown,
            styleHeightItemDropDown,
          ]}
          renderRow={renderRow}
          renderSeparator={() => <View style={{ height: 1 }} />}
          onDropdownWillShow={onDropdownWillShow}
          onDropdownWillHide={onDropdownWillHide}
          onSelect={onSelect}
          disabled={!editable}
          dropdownListProps={{
            automaticallyAdjustContentInsets: false,
            getItemLayout: (data, index) => ({
              length: height,
              offset: (height + 1) * index,
              index,
            }),
            onScrollToIndexFailed: (info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 500));
              wait.then(() => {
                modalRef.scrollToIndex({
                  index: info.index,
                  animated: true,
                });
              });
            },
          }}
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
    borderRadius: scaleWidth(2),
    borderStyle: "solid",
    borderWidth: scaleWidth(1),
    borderColor: "#cccccc",
    backgroundColor: "#fff",
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
    borderWidth: scaleWidth(1),
    borderStyle: "solid",
    borderColor: "#fff",
    shadowColor: "#0006",
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginTop: scaleHeight(1),
  },

  dropDownItemContent: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: scaleWidth(16),
    borderWidth: scaleWidth(0),
    borderTopWidth: 0,
    borderColor: "#fff",
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
