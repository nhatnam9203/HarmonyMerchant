import { useAppType } from "@shared/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptItemType } from "./ReceiptItem";
import { ReceiptHeader } from "./ReceiptHeader";

export const ReceiptViewShot = React.forwardRef(
  (
    {
      backgroundColor,
      items,
      profile,
      staff,
      customer,
      symbol,
      printTemp,
      fromAppointmentTab,
    },
    ref
  ) => {
    const viewShotRef = React.useRef(null);
    const { isRetailApp, isSalonApp } = useAppType();

    const getReceiptType = () => {
      if (isSalonApp()) {
        return ReceiptItemType.SALON;
      }

      if (isRetailApp()) {
        return ReceiptItemType.RETAILER;
      }
    };

    return (
      <View
        ref={viewShotRef}
        style={[styles.viewShotContainer, { backgroundColor }]}
      >
        <ReceiptHeader
          profile={profile}
          staff={staff}
          customer={customer}
          symbol={symbol}
        />
        <ReceiptContent items={items} type={getReceiptType()} />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  viewShotContainer: {
    paddingHorizontal: scaleWidth(10),
  },
});
