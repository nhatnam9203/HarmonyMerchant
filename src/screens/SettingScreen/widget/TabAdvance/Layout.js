import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { colors, fonts, layouts } from "@shared/themes";
import {
  FormLabelSwitch,
  CustomTextInput,
  ButtonGradient,
} from "@shared/components";

export const Layout = ({
  loyaltyProgram,
  setIsLoyaltyProgram,
  setCashStarRate,
  setCreditCardStarRate,
  setHarmonyPayStarRate,
  setOtherStarRate,
  onSaveButtonPress,
}) => {
  const [t] = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Title text={"Advance"} />
        <View style={styles.halfContent}>
          <FormLabelSwitch
            defaultValue={loyaltyProgram?.IsLoyaltyProgram}
            onValueChange={setIsLoyaltyProgram}
            label={"Loyalty program"}
            textStyle={styles.label}
          />
        </View>
        {loyaltyProgram?.IsLoyaltyProgram && (
          <>
            <Text style={styles.label}>
              {"Star earn per "}
              <Text style={[styles.label, { color: "#0764B0" }]}>{"$1.0"}</Text>
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
              value={`${loyaltyProgram?.CashStarRate}`}
              setValue={setCashStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"HarmonyPay"}
              value={`${loyaltyProgram?.HarmonyPayStarRate}`}
              setValue={setHarmonyPayStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"Credit card"}
              value={`${loyaltyProgram?.CreditCardStarRate}`}
              setValue={setCreditCardStarRate}
            />
            <View style={styles.margin} />
            <PaymentMethodRate
              method={"Other"}
              value={`${loyaltyProgram?.OtherStarRate}`}
              setValue={setOtherStarRate}
            />
          </>
        )}
      </View>
      <View style={styles.buttonContent}>
        <ButtonGradient
          label={"SAVE"}
          width={scaleWidth(180)}
          height={scaleHeight(50)}
          borderRadius={scaleWidth(3)}
          onPress={onSaveButtonPress}
        />
      </View>
    </View>
  );
};

const Title = ({ text }) => <Text style={styles.header}>{`${text}`}</Text>;
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
        onChangeText={setValue}
      />
    </View>
  </RowContent>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(20),
  },

  content: { flex: 1 },

  header: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(24),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(37,37,37)",
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  halfContent: {
    width: "50%",
    height: scaleHeight(100),
  },

  label: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(18),
    fontStyle: "normal",
    letterSpacing: 0,
    color: "rgb(73,73,73)",
  },

  rowContent: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  margin: {
    width: scaleWidth(15),
    height: scaleHeight(15),
  },

  buttonContent: {
    height: scaleHeight(50),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
