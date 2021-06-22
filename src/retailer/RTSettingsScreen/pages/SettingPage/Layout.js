import IMAGE from '@resources';
import { colors, fonts, layouts } from '@shared/themes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SettingAttributesPage } from '../SettingAttributesPage';
import { SettingCategoriesPage } from '../SettingCategoriesPage';
import { SettingGeneralPage } from '../SettingGeneralPage';
import { SettingHardwarePage } from '../SettingHardwarePage';
import { SettingPaymentPage } from '../SettingPaymentPage';
import { SettingStaffPage } from '../SettingStaffPage';
import { SettingTaxPage } from '../SettingTaxPage';
import { SettingAboutPage } from '../SettingAboutPage';
import {
  TabStaff,
  TabService,
  TabExtra,
  TabCategories,
  TabGaneral,
  TabHardware,
  TabTAX,
} from '@src/screens/SettingScreen/widget';

import { WithDialogConfirm } from '@shared/HOC/withDialogConfirm';

export const Layout = ({ openDrawer, reload, logOut }) => {
  const { t } = useTranslation();
  const [active, setActive] = React.useState(SettingGeneralPage.name);

  const renderContentDrawer = () => {
    switch (active) {
      case SettingGeneralPage.name:
        return <TabGaneral />;
      case SettingAttributesPage.name:
        return <SettingAttributesPage.component reloadPage={reload} />;
      case SettingCategoriesPage.name:
        return <SettingCategoriesPage.component reloadPage={reload} />;
      case SettingStaffPage.name:
        return <SettingStaffPage.component reloadPage={reload} />;
      // case SettingPaymentPage.name:
      //   return <SettingPaymentPage.component reloadPage={reload} />;
      case SettingTaxPage.name:
        return <TabTAX reloadPage={reload} />;
      case SettingHardwarePage.name:
        return <TabHardware reloadPage={reload} />;
      case SettingAboutPage.name:
        return <SettingAboutPage.component reloadPage={reload} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ========DRAWER======== */}
        <View style={styles.drawer}>
          <ItemDrawer
            {...SettingGeneralPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingAttributesPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingCategoriesPage}
            active={active}
            onPress={setActive}
          />
          <ItemDrawer
            {...SettingStaffPage}
            active={active}
            onPress={setActive}
          />
          {/* <ItemDrawer
            {...SettingPaymentPage}
            active={active}
            onPress={setActive}
          /> */}
          <ItemDrawer {...SettingTaxPage} active={active} onPress={setActive} />
          <ItemDrawer
            {...SettingHardwarePage}
            active={active}
            onPress={setActive}
          />

          <ItemDrawer
            {...SettingAboutPage}
            active={active}
            onPress={setActive}
          />

          <ConfirmLogOut
            options={{
              icon: IMAGE.IconSettingLogOut,
              title: t('LogOut'),
            }}
            onPress={logOut}
            active={active}
            description={t('Are you sure you want to Log out ?')}
          />
        </View>

        {/* ========CONTENT======== */}
        <View style={styles.container}>{renderContentDrawer()}</View>
      </View>
    </View>
  );
};

let ItemDrawer = ({ name, options, active, onPress }) => {
  const style =
    name === active ? styles.drawerItemActive : styles.drawerItemInActive;
  const textStyle =
    name === active ? styles.drawerTextActive : styles.drawerTextInActive;
  const tintColor = name === active ? colors.WHITE : colors.BROWNISH_GREY;
  const onHandleSelect = () => {
    if (onPress && typeof onPress === 'function') {
      onPress(name);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.drawerItem, style]}
      onPress={onHandleSelect}
      activeOpacity={1}
    >
      {options?.icon && (
        <Image
          source={options?.icon}
          style={[styles.drawerIcon, { tintColor }]}
        />
      )}
      <View style={layouts.marginHorizontal} />
      <Text style={[styles.drawerText, textStyle]}>{options?.title}</Text>
    </TouchableOpacity>
  );
};

const ConfirmLogOut = WithDialogConfirm(ItemDrawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },

  content: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
  },

  drawer: {
    width: scaleWidth(160),
    backgroundColor: colors.WHITE_FA,
    height: '100%',
  },

  drawerItem: {
    width: scaleWidth(160),
    height: scaleHeight(60),
    alignItems: 'center',
    paddingHorizontal: scaleWidth(8),
    flexDirection: 'row',
    borderLeftWidth: scaleWidth(4),
  },

  drawerItemInActive: {
    backgroundColor: colors.WHITE_FA,
    borderLeftColor: colors.WHITE_FA,
  },

  drawerItemActive: {
    backgroundColor: colors.OCEAN_BLUE,
    borderLeftColor: colors.WEIRD_GREEN,
  },

  drawerText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'left',
  },

  drawerTextInActive: {
    color: colors.BROWNISH_GREY,
  },

  drawerTextActive: {
    color: colors.WHITE,
  },

  drawerIcon: {
    width: scaleWidth(20),
    height: scaleHeight(20),
  },
});
