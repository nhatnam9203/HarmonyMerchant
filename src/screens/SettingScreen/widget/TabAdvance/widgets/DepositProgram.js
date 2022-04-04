import React from "react";
import {
  ButtonGradient,
  ButtonGradientWhite,
  FormLabelSwitch,
  InputFloatNumber,
} from "@shared/components";
import { fonts, colors } from "@shared/themes";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const DepositProgram = ({
  advanceSetting,
  setDepositMiniumAmount,
  setDepositPercent,
  setIsDepositProgram,
}) => {
  return (
    <View>
      <View style={styles.container}>
        <FormLabelSwitch
          defaultValue={advanceSetting?.IsAppointmentDeposit}
          onValueChange={setIsDepositProgram}
          label={"- Appointment deposit"}
          textStyle={styles.label}
        />
      </View>
      {advanceSetting?.IsAppointmentDeposit && (
        <>
          <View style={styles.content}>
            <View style={styles.margin} />

            <DepositAmount
              method={"Minium appointment amount ($)"}
              value={`${advanceSetting?.MinimumAppointmentAmountRequireDeposit}`}
              setValue={setDepositMiniumAmount}
            />
            <View style={styles.margin} />
            <DepositAmount
              method={"Deposit amount (%)"}
              value={`${advanceSetting?.DepositPercent}`}
              setValue={setDepositPercent}
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

const DepositAmount = ({ method = "", value, setValue }) => (
  <RowContent>
    <Text
      style={[styles.text, { flex: 1, color: "#0764B0" }]}
    >{`${method}`}</Text>
    <View
      style={{
        flex: 1,
        alignItems: "flex-start",
      }}
    >
      <InputFloatNumber
        width={scaleWidth(200)}
        height={scaleHeight(40)}
        keyboardType="numeric"
        textAlign="left"
        selectTextOnFocus={true}
        value={value}
        onChangeText={setValue}
        // clearButtonMode="always"
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
