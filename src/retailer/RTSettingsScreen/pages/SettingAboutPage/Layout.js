import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { layouts } from '@shared/themes';
import { CustomLink } from '@shared/components';
import IMAGE from '@resources';
import Configs from '@configs';
export const Layout = ({}) => {
  const { t } = useTranslation();

  const ImageLogo = () => (
    <Image source={IMAGE.MerchantLogo} style={styles.logo} />
  );
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={layouts.fill}>
        <Text style={styles.txtTitle}>{t('About')}</Text>
        <ImageLogo />
        <Text style={layouts.fontMediumBlue}>
          {t('HarmonyPay Application')}
        </Text>
        <Text style={styles.txtAppVersion}>
          {t('Version')} {Configs.VERSION}
        </Text>
        <Text style={styles.txtCopyRight}>
          {t('Copyright © 2019 Harmony Inc,.')}
        </Text>
        <Text style={styles.txtContent}>
          {t(
            'Taking the mission statement from Jerry MaGuire to heart, we strive to build a company that\'s truly care for our clients. As Dicky Fox always said the same thing when asked for his secret'
          )}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  layoutBottom: {
    ...layouts.horizontal,
    ...layouts.horizontalSpaceBetween,
    // ...layouts.fill,
    alignItems: 'flex-end',
    paddingBottom: scaleHeight(20),
    paddingRight: scaleHeight(60),
  },
  logo: {
    marginVertical: scaleHeight(38),
    flex: 0,
  },
  txtTitle: {
    ...layouts.formTitle,
    fontSize: scaleFont(25),
    marginTop: scaleHeight(20),
  },
  txtAppVersion: {
    ...layouts.fontLightBrown,
    fontSize: scaleFont(15),
    marginTop: scaleHeight(10),
  },
  txtCopyRight: {
    ...layouts.fontLightBlue,
    marginTop: scaleHeight(38),
  },
  txtContent: {
    ...layouts.fontLightBrown,
    marginTop: scaleHeight(20),
  },
  txtLink: {
    fontSize: scaleFont(15),
    textDecorationLine: 'underline',
  },
});
