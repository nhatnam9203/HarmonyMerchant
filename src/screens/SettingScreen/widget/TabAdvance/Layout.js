import {
  ButtonGradient,
  ButtonGradientWhite,
  CustomTextInput,
  FormLabelSwitch,
} from "@shared/components";
import { fonts, colors } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInputMask } from "react-native-masked-text";
import { LoyaltyProgram, DepositProgram } from "./widgets";

export const Layout = ({
  advanceSetting,
  setIsCashDiscount,
  isHadUpdate,
  setIsLoyaltyProgram,
  setCashStarRate,
  setCreditCardStarRate,
  setHarmonyPayStarRate,
  setOtherStarRate,
  onSaveButtonPress,
  onCancelButtonPress,
  setDepositMiniumAmount,
  setDepositPercent,
  setIsDepositProgram,
}) => {
  const [t] = useTranslation();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView bounces={false}>
        <View style={styles.content}>
          <Title text={"Advance"} />
          <View style={styles.margin} />

          {/* ------- Loyalty Program ------ */}
          <LoyaltyProgram
            advanceSetting={advanceSetting}
            setIsLoyaltyProgram={setIsLoyaltyProgram}
            setCashStarRate={setCashStarRate}
            setHarmonyPayStarRate={setHarmonyPayStarRate}
            setCreditCardStarRate={setCreditCardStarRate}
            setOtherStarRate={setOtherStarRate}
          />

          {/* ------- Cash Discount ------ */}
          <FormLabelSwitch
            defaultValue={advanceSetting?.IsCashDiscount}
            onValueChange={setIsCashDiscount}
            label={"-  Apply Cash Discount program"}
            textStyle={styles.label}
          />

          {/* ------- Deposit ------ */}
          {/* <DepositProgram
            advanceSetting={advanceSetting}
            setDepositMiniumAmount={setDepositMiniumAmount}
            setDepositPercent={setDepositPercent}
            setIsDepositProgram={setIsDepositProgram}
          /> */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(20),
  },

  content: { flex: 1 },

  containerInputView: {
    backgroundColor: colors.WHITE,
    flexDirection: "row",
    width: scaleWidth(200),
    height: scaleHeight(42),
  },
  border: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: scaleWidth(3),
  },

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
    fontFamily: fonts.BOLD,
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
