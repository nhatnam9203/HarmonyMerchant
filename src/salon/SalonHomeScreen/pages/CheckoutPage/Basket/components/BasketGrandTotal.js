import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, layouts } from "@shared/themes";
import { i18n } from "@shared/services";
import { formatMoneyWithUnit, localize } from "@utils";

export const BasketGrandTotal = ({
  isBookingFromCalendar = false,
  grandTotal,
  paidAmounts,
  dueAmount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.padding} />
      <View style={layouts.horizontalSpaceBetween}>
        <CustomText color={colors.OCEAN_BLUE}>
          {localize("Grand Total")}
        </CustomText>
        <CustomText color={colors.DARKISH_GREEN}>{`${formatMoneyWithUnit(
          grandTotal
        )}`}</CustomText>
      </View>

      <View style={styles.padding} />
      <View
        style={[styles.line, { backgroundColor: colors.GREYISH_BROWN_50 }]}
      />
      <View style={styles.padding} />

      {paidAmounts?.length > 0 &&
        paidAmounts.map((x, index) => (
          <View style={layouts.horizontalSpaceBetween} key={`${index}`}>
            <CustomText color={colors.GREYISH_BROWN}>
              {localize("Paid")}
              <View style={{ width: scaleWidth(10) }} />
              <Text style={styles.normalText}>{`(${x?.paymentMethod})`}</Text>
            </CustomText>
            <CustomText color={colors.GREYISH_BROWN}>{`${formatMoneyWithUnit(
              x?.amount
            )}`}</CustomText>
          </View>
        ))}
      <View style={styles.padding} />

      {dueAmount > 0 && (
        <View style={layouts.horizontalSpaceBetween} key={`due-amount`}>
          <CustomText color={colors.ORANGEY_RED}>
            {localize("Amount Due")}
          </CustomText>
          <CustomText color={colors.ORANGEY_RED}>{`${formatMoneyWithUnit(
            dueAmount
          )}`}</CustomText>
        </View>
      )}
      <View style={{ paddingBottom: scaleHeight(30) }} />
    </View>
  );
};

const CustomText = ({ children, color }) => (
  <Text style={[styles.text, { color: color }]}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(10),
  },

  line: {
    height: 1,
    width: "100%",
    backgroundColor: colors.OCEAN_BLUE,
  },

  padding: {
    height: scaleHeight(18),
    width: scaleWidth(10),
  },

  text: {
    fontFamily: fonts.BOLD,
    fontSize: scaleFont(24),
    fontWeight: "bold",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  normalText: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(21),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },
});
