import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '@shared/themes';

export const HeaderToolBarTitle = ({ label, style }) =>
  label ? <Text style={[styles.text, style]}>{label}</Text> : null;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto',
    fontSize: scaleFont(23),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
    flex: 0,
  },
});
