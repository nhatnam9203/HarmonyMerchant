import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { scaleSize } from '@utils';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { colors, fonts } from '@shared/themes';

export const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
      style={styles.drawer}
      bounces={false}
    >
      <DrawerItemList
        {...props}
        itemStyle={styles.itemStyle}
        labelStyle={styles.labelStyle}
        activeBackgroundColor="#0764B0"
        inActiveBackgroundColor="#0764B0"
        activeTintColor="#FFC130"
        inactiveTintColor="#FFFFFF"
      />
    </DrawerContentScrollView>
  );
};

export const CustomDrawerSetting = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
      style={styles.drawerSetting}
      bounces={false}
    >
      <DrawerItemList
        {...props}
        itemStyle={styles.drawerSettingItemStyle}
        labelStyle={styles.drawerSettingLabelStyle}
        activeBackgroundColor={colors.OCEAN_BLUE}
        inActiveBackgroundColor={colors.WHITE_FA}
        activeTintColor={'#fff'}
        inactiveTintColor={colors.BROWNISH_GREY}
      />
    </DrawerContentScrollView>
  );
};

export const CustomDrawerIcon = ({ source }) => (
  <Image source={source} style={styles.iconStyle} />
);

const styles = StyleSheet.create({
  drawer: { backgroundColor: '#0764B0' },
  drawerSetting: { backgroundColor: colors.WHITE_FA },
  drawerContainer: {
    margin: 0,
  },

  itemStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(54),
    width: '100%',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },

  drawerSettingItemStyle: {
    marginLeft: scaleSize(0),
    height: scaleHeight(60),
    width: '100%',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    borderRadius: 0,
  },

  labelStyle: {
    fontSize: scaleSize(18),
  },

  drawerSettingLabelStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
  },

  iconStyle: {
    width: scaleSize(20),
    height: scaleSize(20),
  },
});
