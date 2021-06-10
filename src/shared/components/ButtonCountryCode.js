import React from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { colors, fonts, layouts } from '@shared/themes';

const CountryCodes = [
  { label: 'US 🇺🇸', value: '+1' },
  { label: 'VN 🇻🇳', value: '+84' },
];

export const ButtonCountryCode = ({
  width,
  height,
  onChangeValue,
  defaultValue = CountryCodes[0].value,
  dropDownDirection,
}) => {
  const [open, setOpen] = React.useState(false);
  const [item, setItem] = React.useState(defaultValue);

  const onHandleChange = (value) => {
    if (onChangeValue && typeof onChangeValue === 'function') {
      onChangeValue(value);
    }
  };

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
        dropDownDirection={dropDownDirection ?? 'AUTO'}
        scrollViewProps={{
          decelerationRate: 'fast',
        }}
        itemKey="label"
        closeAfterSelecting={true}
        showTickIcon={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },

  dropdownContent: {
    borderRadius: scaleWidth(1),
    height: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
  },

  dropDownContainerStyle: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
  },

  dropdownTerminalText: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: '400',
    fontStyle: 'normal',
    letterSpacing: 1,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  dropdownTerminalPlaceholder: {
    fontFamily: 'Roboto-Light',
    fontWeight: '300',
    letterSpacing: 0,
    color: colors.INACTIVE,
    textAlign: 'left',
  },

  selectedItemLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.ROBIN_S_EGG,
  },

  itemLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
