import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { ButtonFilter } from "./ButtonFilter";
import { DropdownMenu } from "./DropdownMenu";

export const FormSelect = ({
  filterItems,
  defaultValue,
  onChangeValue,
  label,
  style,
  required = true,
  children,
  filterRef,
  isDropdown = true,
  titleStyle,
}) => {
  const [t] = useTranslation();
  const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    if (filterItems?.length > 0) {
      if (defaultValue != null) {
        let defaultIndex = filterItems.findIndex((item, index) => {
          return item?.value === defaultValue;
        });
        setIndex(defaultIndex);
      } else {
        setIndex(-1);
      }
    }
  }, [filterItems, defaultValue]);

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={titleStyle ?? styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={styles.content}>
        {isDropdown ? (
          <DropdownMenu
            ref={filterRef}
            items={filterItems}
            defaultIndex={index}
            onChangeValue={(item) => {
              onChangeValue(item?.value);
            }}
            style={layouts.fill}
            // width={scaleWidth(208)}
            height={scaleHeight(40)}
          />
        ) : (
          <ButtonFilter
            ref={filterRef}
            filterItems={filterItems}
            defaultValue={defaultValue}
            onChangeValue={onChangeValue}
            style={layouts.fill}
            height={scaleHeight(40)}
          />
        )}
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
  },

  content: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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

  requiredStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.ORANGEY_RED,
  },
});
