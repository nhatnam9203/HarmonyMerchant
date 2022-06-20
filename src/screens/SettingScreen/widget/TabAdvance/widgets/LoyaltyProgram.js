import React from "react";
import {
  ButtonGradient,
  ButtonGradientWhite,
  FormLabelSwitch,
  InputFloatNumber,
  InputIntNumber,
} from "@shared/components";
import { fonts, colors } from "@shared/themes";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const LoyaltyProgram = ({
  advanceSetting,
  setIsLoyaltyProgram,
  setCashStarRate,
  setCreditCardStarRate,
  setHarmonyPayStarRate,
  setOtherStarRate,
}) => {
  // console.log(advanceSetting);
  return (
    <View>
      <View style={styles.container}>
        <FormLabelSwitch
          defaultValue={advanceSetting?.IsLoyaltyProgram}
          onValueChange={setIsLoyaltyProgram}
          label={"- Loyalty program"}
          textStyle={styles.label}
        />
      </View>
      {advanceSetting?.IsLoyaltyProgram && (
        <>
          <View style={styles.content}>
            <Text style={styles.subLabel}>
              {"∗ Star earn per "}
              <Text style={[styles.subLabel, { color: "#0764B0" }]}>
                {"$1"}
              </Text>
              {" spent by payment method"}
            </Text>
            <View style={styles.margin} />
            <View style={styles.margin} />

            <RowContent>
              <Text style={[styles.label, { color: "#0764B0", flex: 1 }]}>
                {"Payment method"}
              </Text>
              <Text style={[styles.label, { color: "#0764B0", flex: 1 }]}>
                {"Star earned"}
              </Text>
            </RowContent>
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"Cash"}
              value={`${parseInt(advanceSetting?.CashStarRate)}`}
              setValue={setCashStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"HarmonyPay"}
              value={`${parseInt(advanceSetting?.HarmonyPayStarRate)}`}
              setValue={setHarmonyPayStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"Credit card"}
              value={`${parseInt(advanceSetting?.CreditCardStarRate)}`}
              setValue={setCreditCardStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"Other"}
              value={`${parseInt(advanceSetting?.OtherStarRate)}`}
              setValue={setOtherStarRate}
            />
          </View>
        </>
      )}
    </View>
  );
};

const RowContent = ({ children }) => (
  <View style={styles.rowContent}>{children}</View>
);

const PaymentMethodRate = ({ method = "Cash", value, setValue }) => (
  <RowContent>
    <Text style={[styles.text, { flex: 1 }]}>{method}</Text>
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
      }}
    >
      <InputIntNumber
        width={scaleWidth(200)}
        height={scaleHeight(40)}
        keyboardType="numeric"
        textAlign="left"
        selectTextOnFocus={true}
        value={value}
        onChangeText={setValue}
      />
    </View>
  </RowContent>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height: scaleHeight(100),
  },

  content: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },

  label: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  subLabel: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  margin: {
    width: scaleWidth(15),
    height: scaleHeight(15),
  },

  rowContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },
});
