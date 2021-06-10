import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CustomSwitch } from './CustomSwitch';
import { fonts, colors } from '@shared/themes';
import { useTranslation } from 'react-i18next';

export const FormLabelSwitch = ({
  label = 'Switch Label',
  style,
  textStyle,
  ...props
}) => {
  const [t] = useTranslation();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.textStyle, textStyle]}>{label}</Text>
      <CustomSwitch {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleHeight(8),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(15),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.GREYISH_BROWN,
  },
});
