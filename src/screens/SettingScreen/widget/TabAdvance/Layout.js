import {
  ButtonGradient,
  ButtonGradientWhite,
  CustomTextInput,
  FormLabelSwitch,
} from "@shared/components";
import { fonts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const Layout = ({
  isCashDiscount,
  cashDiscountPercent,
  setIsCashDiscount,
  setCashDiscountPercent,
  dataLocal,
  isHadUpdate,
  setIsLoyaltyProgram,
  setCashStarRate,
  setCreditCardStarRate,
  setHarmonyPayStarRate,
  setOtherStarRate,
  onSaveButtonPress,
  onCancelButtonPress,
  cashStarRate,
  creditCardStarRate,
  harmonyPayStarRate,
  otherStarRate,
}) => {
  const [t] = useTranslation();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.content}>
          <Title text={"Advance"} />
          <View style={styles.halfContent}>
            <FormLabelSwitch
              defaultValue={dataLocal?.IsLoyaltyProgram}
              onValueChange={setIsLoyaltyProgram}
              label={"Loyalty program"}
              textStyle={styles.label}
            />
          </View>
          {dataLocal?.IsLoyaltyProgram && (
            <>
              <Text style={styles.label}>
                {"Star earn per "}
                <Text style={[styles.label, { color: "#0764B0" }]}>
                  {"$1.0"}
                </Text>
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
                value={`${cashStarRate}`}
                setValue={setCashStarRate}
              />
              <View style={styles.margin} />
              <PaymentMethodRate
                method={"HarmonyPay"}
                value={`${harmonyPayStarRate}`}
                setValue={setHarmonyPayStarRate}
              />
              <View style={styles.margin} />
              <PaymentMethodRate
                method={"Credit card"}
                value={`${creditCardStarRate}`}
                setValue={setCreditCardStarRate}
              />
              <View style={styles.margin} />
              <PaymentMethodRate
                method={"Other"}
                value={`${otherStarRate}`}
                setValue={setOtherStarRate}
              />
            </>
          )}

           {/* ------- Cash Discount ------ */}
          <View style={styles.halfContent}>
            <FormLabelSwitch
              defaultValue={dataLocal?.IsCashDiscount}
              onValueChange={setIsCashDiscount}
              label={"Apply Cash Discount program"}
              textStyle={styles.label}
            />
          </View>
          { isCashDiscount && 
             <PaymentMethodRate
               method={"Cash discount (%)"}
               value={`${cashDiscountPercent}`}
               setValue={setCashDiscountPercent}
             />
          }
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.buttonContent}>
        <ButtonGradientWhite
          disable={!isHadUpdate()}
          label={"CANCEL"}
          width={scaleWidth(180)}
          height={scaleHeight(50)}
          borderRadius={scaleWidth(3)}
          onPress={onCancelButtonPress}
        />
        <View style={styles.margin} />

        <ButtonGradient
          disable={!isHadUpdate()}
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
        defaultValue={"0"}
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
    flexDirection: "row",
  },
});
