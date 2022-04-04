import { useAppType } from "@shared/hooks";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptItemType } from "./ReceiptItem";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptFooter } from "./ReceiptFooter";
import { ReceiptTotal } from "./ReceiptTotal";
import { captureRef, releaseCapture } from "react-native-view-shot";
import { getStaffNameForInvoice } from "@utils";

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
      itemReturn,
    },
    ref
  ) => {
    const viewShotRef = React.useRef(null);
    const { isRetailApp, isSalonApp } = useAppType();

    const getReceiptType = () => {
      if (isRetailApp() && itemReturn) {
        return ReceiptItemType.RETAILER_RETURN;
      }

      if (isSalonApp()) {
        return ReceiptItemType.SALON;
      }

      if (isRetailApp()) {
        return ReceiptItemType.RETAILER;
      }
    };

    React.useImperativeHandle(ref, () => ({
      captureImageUrl: async ({
        paymentMachineType,
        printerSelect,
        quality = 1,
      }) => {
        const imageUri = await captureRef(viewShotRef, {
          ...(paymentMachineType === "Clover" &&
            !printerSelect && { result: "base64" }),
          // format: "jpg",
          // quality: quality,
        });

        return imageUri;
      },
    }));

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
          staffName={getStaffNameForInvoice(items)}
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
          promotionNotes={promotionNotes}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  viewShotContainer: {
    flex: 0,
    paddingHorizontal: scaleWidth(10),
  },
});
