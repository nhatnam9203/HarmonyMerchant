import { colors, fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
// DropDownPicker.setListMode("SCROLLVIEW");

export const ButtonFilter = React.forwardRef(
  (
    {
      width,
      height,
      onChangeValue,
      filterItems,
      defaultValue,
      style,
      placeholder,
      dropdown,
    },
    ref
  ) => {
    const [t] = useTranslation();

    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState(filterItems);
    const [item, setItem] = React.useState(defaultValue);

    const onHandleChange = (value) => {
      if (onChangeValue && typeof onChangeValue === "function") {
        onChangeValue(value);
      }
    };

    const onHandleOpen = () => {
      dropdown.current = ref;
    };

    React.useImperativeHandle(ref, () => ({
      closePicker: () => {
        setOpen(false);
      },
    }));

    // React.useEffect(() => {
    //   if (filterItems?.length) {
    //     setItems(filterItems?.map((x) => ({ ...x, label: t(x.label) })));
    //   } else {
    //     setItems([]);
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [filterItems]);

    React.useEffect(() => {
      setItem(defaultValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    return (
      <View
        style={[
          styles.container,
          style,
          width && { width },
          height && { height },
          { zIndex: 100 },
        ]}
      >
        <DropDownPicker
          items={items}
          value={item}
          open={open}
          setOpen={setOpen}
          setValue={setItem}
          setItems={setItems}
          onOpen={onHandleOpen}
          onChangeValue={onHandleChange}
          style={styles.dropdownContent}
          textStyle={styles.dropdownTerminalText}
          selectedItemLabelStyle={styles.selectedItemLabelStyle}
          listItemLabelStyle={styles.itemLabelStyle}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          placeholderStyle={styles.dropdownTerminalPlaceholder}
          dropDownDirection="AUTO"
          scrollViewProps={{
            decelerationRate: "fast",
          }}
          itemKey="value"
          closeAfterSelecting={true}
          showTickIcon={false}
          placeholder={placeholder}
          zIndex={3000}
          zIndexInverse={1000}
          defaultIndex={0}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },

  dropdownContent: {
    borderRadius: scaleWidth(1),
    height: "100%",
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    backgroundColor: "#fff",
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
    textAlign: "center",
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
});
