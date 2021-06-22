import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "@shared/themes";

export const ORDERED_STATUS = {
  COMPLETE: "Complete",
  PROCESS: "Processing",
  SHIP: "Shipped",
  PENDING: "Pending",
  CANCEL: "Canceled",
  CLOSED: "Closed",
  RETURN: "Return",
};

export const OrderStatusView = ({ status }) => {
  const theme = () => {
    switch (status) {
      case ORDERED_STATUS.COMPLETE:
        return {
          content: { backgroundColor: colors.WEIRD_GREEN, borderWidth: 0 },
          text: { color: colors.WHITE },
        };
      case ORDERED_STATUS.PROCESS:
        return {
          content: { backgroundColor: colors.OCEAN_BLUE, borderWidth: 0 },
          text: { color: colors.WHITE },
        };
      case ORDERED_STATUS.SHIP:
        return {
          content: {
            backgroundColor: colors.WHITE,
            borderColor: colors.WEIRD_GREEN,
          },
          text: { color: colors.BROWNISH_GREY },
        };
      case ORDERED_STATUS.PENDING:
        return {
          content: { backgroundColor: colors.SUNFLOWER_YELLOW, borderWidth: 0 },
          text: { color: colors.BROWNISH_GREY },
        };
      case ORDERED_STATUS.CANCEL:
      case ORDERED_STATUS.CLOSED:
      case ORDERED_STATUS.RETURN:
        return {
          content: { backgroundColor: colors.BROWNISH_GREY, borderWidth: 0 },
          text: { color: colors.VERY_LIGHT_PINK_E_5 },
        };

      default:
        break;
    }
  };
  return (
    <View style={[styles.container, theme()?.content]}>
      <Text style={[styles.textStyle, theme()?.text]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(88),
    height: scaleHeight(28),
    borderRadius: scaleWidth(14),
    borderStyle: "solid",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(13),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
  },
});
