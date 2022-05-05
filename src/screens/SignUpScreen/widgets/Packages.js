import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";
import { useSelector } from "react-redux";

export const Packages = ({ goToPage }) => {
  const { t } = useTranslation();
  const packageAndPricingData = useSelector(
    (state) => state.app.packageAndPricingData
  );

  const [isBilledAnnually, setBilledAnnually] = React.useState(false);
  const toggleSwitch = (val) => {
    setBilledAnnually(val);
  };

  return (
    <View style={styles.container}>
      <Title>{t("Package & Pricing")}</Title>
      <View style={layouts.marginVertical} />
      <SubTitle>
        {t(
          "Try HarmonyPay apps free for 30 days ! No payment information required "
        )}
      </SubTitle>
      <View style={layouts.marginVertical} />
      <View style={layouts.marginVertical} />
      <View style={[layouts.horizontal, layouts.center]}>
        <Billed highlight={!isBilledAnnually}>{t("Billed Monthly")}</Billed>
        <View style={layouts.marginHorizontal} />
        <Switch
          trackColor={{ false: colors.WEIRD_GREEN, true: colors.WEIRD_GREEN }}
          thumbColor={colors.WHITE}
          ios_backgroundColor={colors.WEIRD_GREEN}
          onValueChange={toggleSwitch}
          value={isBilledAnnually}
          style={{
            transform: [{ scale: Platform.OS === "ios" ? 0.9 : 1 }],
          }}
        />
        <View style={layouts.marginHorizontal} />
        <Billed highlight={isBilledAnnually}>{t("Billed Annually")}</Billed>
      </View>
    </View>
  );
};

const Title = ({ children }) => (
  <Text
    style={{
      fontSize: scaleFont(42),
      fontFamily: fonts.BOLD,
      color: colors.GREYISH_BROWN,
    }}
  >
    {children}
  </Text>
);

const SubTitle = ({ children }) => (
  <Text
    style={{
      fontSize: scaleFont(26),
      fontFamily: fonts.BOLD,
      color: colors.BROWNISH_GREY,
    }}
  >
    {children}
  </Text>
);

const Billed = ({ highlight = false, children }) => {
  return (
    <Text
      style={{
        fontSize: scaleFont(20),
        fontFamily: fonts.MEDIUM,
        color: highlight ? colors.OCEAN_BLUE : colors.BROWNISH_GREY,
      }}
    >
      {children}
    </Text>
  );
};

const PackageItem = () => {
  return <View />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: scaleHeight(30),
  },
});
