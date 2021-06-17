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
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren'
          )}
        </Text>
      </ScrollView>
      <View style={styles.layoutBottom}>
        <CustomLink style={styles.txtLink} url={Configs.DOMAIN} />
        <Text style={styles.txtAppVersion}>
          {t('Created by Levinci Team.')}
        </Text>
      </View>
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
