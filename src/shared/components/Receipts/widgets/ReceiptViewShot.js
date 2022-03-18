import { useAppType } from "@shared/hooks";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptItemType } from "./ReceiptItem";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptFooter } from "./ReceiptFooter";
import { ReceiptTotal } from "./ReceiptTotal";

export const ReceiptViewShot = React.forwardRef(
  (
    {
      backgroundColor,
      items,
      profile,
      customer,
      symbol,
      printTemp,
      fromAppointmentTab,
      invoiceDate,
      invoiceNO,
      typeReceipt,
      invoiceCode,
      subTotal,
      discount,
      tip,
      tax,
      total,
      fee,
      cashDiscount,
      due,
      change,
      taxRate,
      promotionNotes,
      checkoutPaymentMethods,
      isSignature,
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
          customer={customer}
          symbol={symbol}
          invoiceDate={invoiceDate}
          invoiceNO={invoiceNO}
        />
        <ReceiptContent items={items} type={getReceiptType()} />
        <ReceiptTotal
          subtotal={subTotal}
          discount={discount}
          tip={tip}
          tax={tax}
          taxRate={taxRate}
          change={change}
          cashDiscount={cashDiscount}
          fee={fee}
          total={total}
          printTemp={printTemp}
          fromAppointmentTab={fromAppointmentTab}
          checkoutPaymentMethods={checkoutPaymentMethods}
          isSignature={isSignature}
        />
        <ReceiptFooter
          fromAppointmentTab={fromAppointmentTab}
          profile={profile}
          typeReceipt={typeReceipt}
          invoiceCode={invoiceCode}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  viewShotContainer: {
    paddingHorizontal: scaleWidth(10),
  },
});
