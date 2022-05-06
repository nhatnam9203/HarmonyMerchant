import { colors, fonts, layouts, metrics } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import i18n from "i18next";
import { ButtonGradientGreen } from "@shared/components";
import { formatMoneyWithUnit } from "@utils";
import IMAGE from "@resources";
import { useDispatch } from "react-redux";
import actions from "@actions";

const PADDING = 10;
const NUM_OF_ITEMS_VISIBLE = 4;

export const Packages = ({ goToPage }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let packageAndPricingData =
    useSelector((state) => state.app.packageAndPricingData) || [];
  packageAndPricingData.sort((a, b) => a.staffLimit - b.staffLimit);

  const [isBilledAnnually, setBilledAnnually] = React.useState(false);
  const toggleSwitch = (val) => {
    setBilledAnnually(val);
  };

  const startWithPackage = (it) => {
    const pricingType = isBilledAnnually ? "annually" : "monthly";
    const packagePricing = it?.packageId;

    dispatch(
      actions.app.setPackagePricing({
        pricingType,
        packagePricing,
      })
    );

    goToPage(5);
  };

  React.useEffect(() => {
    dispatch(actions.app.getPackageAndPricing());
  }, []);

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
      <View style={layouts.marginVertical} />

      <View style={styles.content}>
        <FlatList
          data={packageAndPricingData?.filter((x) => x.isDisabled === 0)}
          renderItem={({ item, index }) => (
            <PackageItem
              item={item}
              index={index}
              isSpecial={index !== 0}
              isAnnually={isBilledAnnually}
              onStartWithPackage={startWithPackage}
            />
          )}
          contentContainerStyle={styles.packageList}
          horizontal={true}
          keyExtractor={(item) => item.packageId}
          bounces={false}
          ItemSeparatorComponent={() => <View style={{ width: PADDING }} />}
          showsHorizontalScrollIndicator={true}
        />
      </View>
      <View style={layouts.marginVertical} />
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

const PackageItem = ({
  item,
  index,
  isAnnually,
  isSpecial = true,
  onStartWithPackage,
}) => {
  const onStartPackage = () => {
    if (onStartWithPackage && typeof onStartWithPackage === "function") {
      onStartWithPackage(item);
    }
  };

  let bgColor = colors.CERULEAN;
  switch (index) {
    case 0:
      bgColor = colors.CERULEAN;
      break;
    case 1:
      bgColor = colors.OCEAN_BLUE;
      break;
    case 2:
      bgColor = colors.PEACOCK_BLUE;
      break;
    case 3:
    default:
      bgColor = colors.DARKISH_BLUE;
      break;
  }

  return (
    <View key={item.packageId} style={styles.itemContent}>
      {/** HEADER */}
      <View
        style={{
          height: scaleHeight(120),
          backgroundColor: bgColor,
          padding: scaleWidth(15),
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Text
          style={{
            fontSize: scaleFont(26),
            fontFamily: fonts.BOLD,
            color: colors.WHITE_FA,
            marginRight: scaleWidth(40),
          }}
        >
          {`${item.packageName}`.toUpperCase()}
        </Text>

        <Text
          style={{
            fontSize: scaleFont(20),
            fontFamily: fonts.MEDIUM,
            color: colors.WHITE_FA,
          }}
        >
          {`${item.staffLimit} Staffs`}
        </Text>

        {isSpecial && (
          <View
            style={{
              height: scaleHeight(32),
              width: scaleWidth(180),
              backgroundColor: "orange",
              position: "absolute",
              top: 25,
              right: -60,
              transform: [{ rotate: "45deg" }],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: scaleFont(11),
                fontFamily: fonts.BOLD,
                color: colors.WHITE,
              }}
            >
              {i18n.t("SPECIAL PRICE")}
            </Text>
          </View>
        )}
      </View>

      {/** CONTENT */}
      <View
        style={{
          flex: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: colors.VERY_LIGHT_PINK_C_5,
          justifyContent: "center",
        }}
      >
        <PackageTickItem key="pos" isCheck={item.pos} label={i18n.t("POS")} />
        <PackageTickItem
          key="sign-in"
          isCheck={item.signinApp}
          label={i18n.t("Sign in app")}
        />
        <PackageTickItem
          key="app-for-staff"
          isCheck={item.staffApp}
          label={i18n.t("App for staff")}
        />
        <PackageTickItem
          key="marketing"
          isCheck={item.marketing}
          label={i18n.t("Marketing")}
        />
        <PackageTickItem
          key="report"
          isCheck={item.report}
          label={i18n.t("Report")}
        />
      </View>
      {/** FOOTER */}
      <View
        style={{
          height: scaleHeight(150),
          backgroundColor: colors.CERULEAN,
          padding: scaleWidth(15),
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: scaleFont(32),
            fontFamily: fonts.BOLD,
            color: colors.WHITE,
          }}
        >
          {`${
            isAnnually
              ? formatMoneyWithUnit(item.annually)
              : formatMoneyWithUnit(item.pricing)
          }`}
          <Text
            style={{
              fontSize: scaleFont(22),
              fontFamily: fonts.MEDIUM,
              color: colors.WHITE,
            }}
          >{`/${isAnnually ? "month" : "year"}`}</Text>
        </Text>
        <View style={layouts.marginVertical} />
        <View style={layouts.marginVertical} />
        <ButtonGradientGreen
          onPress={onStartPackage}
          label={i18n.t("Start free trial")}
          width={scaleWidth(180)}
          height={scaleHeight(55)}
          borderRadius={scaleWidth(3)}
          fontSize={scaleFont(22)}
          fontWeight={"600"}
        />
      </View>
    </View>
  );
};

const PackageTickItem = ({ isCheck, label = " " }) => {
  return (
    <View
      style={{
        height: scaleHeight(50),
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: scaleWidth(15),
      }}
    >
      <Image
        source={isCheck ? IMAGE.check_package_pricing : IMAGE.not_support}
      />
      <View style={layouts.marginHorizontal} />
      <Text
        style={{
          fontSize: scaleFont(24),
          fontFamily: fonts.REGULAR,
          color: colors.BROWNISH_GREY,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: scaleHeight(30),
  },

  content: {
    flex: 1,
    width: "100%",
  },

  packageList: {
    paddingHorizontal: PADDING,
  },

  itemContent: {
    width: Math.round(
      (metrics.screenWidth - PADDING * (NUM_OF_ITEMS_VISIBLE + 1)) / 4
    ),
    height: "100%",
    borderRadius: scaleWidth(3),
  },
});
