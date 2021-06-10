import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, colors } from '@shared/themes';

export const FormTitle = ({ label, children }) => {
  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.textStyle}>{label}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: scaleHeight(12),
    borderBottomWidth: scaleHeight(1),
    borderBottomColor: '#ccc',
    marginVertical: scaleHeight(8),
    flexDirection: 'row',
    alignItems: 'center',
  },

  textStyle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
    color: colors.OCEAN_BLUE,
  },
});
