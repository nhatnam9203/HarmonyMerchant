import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '@shared/themes';
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { CustomerGroupTypes } from '@shared/utils/app';

export const FormCustomerGroup = ({
  width,
  height,
  onChangeValue,
  defaultValue,
}) => {
  const [t] = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [items] = React.useState(
    CustomerGroupTypes?.filter((x) => x.value >= 0).map((x) => ({
      ...x,
      label: t(x.label),
    })),
  );
  const [item, setItem] = React.useState(defaultValue);

  const onHandleChange = (value) => {
    if (onChangeValue && typeof onChangeValue === 'function') {
      onChangeValue(parseInt(value, 10));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{t('Group')}</Text>
      <View style={styles.content}>
        <DropDownPicker
          value={item}
          items={items}
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
            decelerationRate: 'fast',
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
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },

  dropdownContent: {
    borderRadius: scaleWidth(1),
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    width: '100%',
  },

  dropDownContainerStyle: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
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
