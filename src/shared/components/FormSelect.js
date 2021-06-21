import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonFilter } from './ButtonFilter';
import { ButtonGradient } from './Button';
import { DropdownMenu } from './DropdownMenu';
import { colors, layouts, fonts } from '@shared/themes';
import { useTranslation } from 'react-i18next';

export const FormSelect = ({
  filterItems,
  defaultValue,
  onChangeValue,
  label,
  style,
  required = true,
  children,
  filterRef,
}) => {
  const [t] = useTranslation();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    let defaultIndex = filterItems.findIndex((item, index) => {
      return filterItems[index]?.value === defaultValue;
    });
    setIndex(defaultIndex);
  }, [filterItems]);

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text style={styles.textStyle}>
          {label}
          {required && <Text style={styles.requiredStyle}> *</Text>}
        </Text>
      )}
      <View style={styles.content}>
        {/* <ButtonFilter
          filterItems={filterItems}
          defaultValue={defaultValue}
          onChangeValue={onChangeValue}
          style={layouts.fill}
          height={scaleHeight(40)}
        /> */}
        <DropdownMenu
          items={filterItems}
          defaultIndex={index}
          onChangeValue={(item) => {
            onChangeValue(item?.value);
          }}
          style={layouts.fill}
          // width={scaleWidth(208)}
          height={scaleHeight(40)}
        />
        <View style={layouts.marginHorizontal} />
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
