import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import ICON from '@resources';
import React from 'react';
import { colors, layouts } from '@shared/themes';

export const ButtonLock = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={ICON.LockButtonIcon} style={styles.img} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(48),
    height: scaleHeight(48),
    backgroundColor: colors.WEIRD_GREEN,
    ...layouts.center,
    borderLeftWidth: 1,
    borderColor: '#fff',
  },
  img: {
    width: scaleWidth(28),
    height: scaleHeight(28),
  },
});
