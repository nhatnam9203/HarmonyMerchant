import React from "react";
import {
  ButtonGradient,
  ButtonGradientWhite,
  CustomTextInput,
  FormLabelSwitch,
} from "@shared/components";
import { fonts, colors } from "@shared/themes";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputMask } from "react-native-masked-text";

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
      <View style={styles.halfContent}>
        <FormLabelSwitch
          defaultValue={advanceSetting?.IsLoyaltyProgram}
          onValueChange={setIsLoyaltyProgram}
          label={"Loyalty program"}
          textStyle={styles.label}
        />
      </View>
      {advanceSetting?.IsLoyaltyProgram && (
        <>
          <Text style={styles.label}>
            {"Star earn per "}
            <Text style={[styles.label, { color: "#0764B0" }]}>{"$1"}</Text>
            {" spent by payment method"}
          </Text>
          <View style={styles.margin} />
          <View style={styles.margin} />

          <RowContent>
            <Text style={[styles.label, { color: "#0764B0", flex: 1 }]}>
              {"Payment method"}
            </Text>
            <Text style={[styles.label, { color: "#0764B0", flex: 2 }]}>
              {"Star earned"}
            </Text>
          </RowContent>
          <View style={styles.margin} />
          <PaymentMethodRate
            method={"Cash"}
            value={`${advanceSetting?.CashStarRate}`}
            setValue={setCashStarRate}
          />
          <View style={styles.margin} />
          <PaymentMethodRate
            method={"HarmonyPay"}
            value={`${advanceSetting?.HarmonyPayStarRate}`}
            setValue={setHarmonyPayStarRate}
          />
          <View style={styles.margin} />
          <PaymentMethodRate
            method={"Credit card"}
            value={`${advanceSetting?.CreditCardStarRate}`}
            setValue={setCreditCardStarRate}
          />
          <View style={styles.margin} />
          <PaymentMethodRate
            method={"Other"}
            value={`${advanceSetting?.OtherStarRate}`}
            setValue={setOtherStarRate}
          />
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
        flex: 2,
        alignItems: "flex-start",
      }}
    >
      <CustomTextInput
        width={scaleWidth(200)}
        height={scaleHeight(40)}
        keyboardType="numeric"
        textAlign="left"
        selectTextOnFocus={true}
        value={value}
        defaultValue={"0"}
        onChangeText={setValue}
      />
    </View>
  </RowContent>
);

const styles = StyleSheet.create({
  halfContent: {
    width: "100%",
    // height: scaleHeight(100),
  },

  label: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  margin: {
    width: scaleWidth(15),
    height: scaleHeight(15),
  },

  rowContent: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
