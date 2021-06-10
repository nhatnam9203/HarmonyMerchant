import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import ICON from '@resources';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '@shared/themes';

export const ButtonDrawer = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={[colors.CERULEAN, colors.OCEAN_BLUE]}
        style={styles.bg}
      >
        <Image source={ICON.MenuButtonIcon} style={styles.img} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(48),
    height: scaleHeight(48),
    borderRightWidth: 1,
    borderColor: '#fff',
  },
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: scaleWidth(28),
    height: scaleHeight(28),
  },
});
