import { useAppType } from "@shared/hooks";
import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { ReceiptContent } from "./ReceiptContent";
import { ReceiptItemType } from "./ReceiptItem";
import { ReceiptHeader } from "./ReceiptHeader";
import { ReceiptFooter } from "./ReceiptFooter";
import { ReceiptTotal } from "./ReceiptTotal";
import { captureRef, ViewShot } from "react-native-view-shot";

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
      staffName,
      widthPaper,
      returnTotal,
      groupAppointment,
      getItemsOfAppointment,
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
        });
        return imageUri;
      },
    }));

    const _renderAppointments = () => {
      if (groupAppointment) {
        return (
          <>
            {groupAppointment.appointments?.map((x) => (
              <>
                <ReceiptContent
                  groupTitle={`#${x.code} - ${x.firstName}`}
                  items={getItemsOfAppointment(x.appointmentId)}
                  type={getReceiptType()}
                  isGroupLayout={!!groupAppointment}
                />
                <ReceiptTotal
                  subtotal={x.subTotal}
                  discount={x.discount}
                  tip={x.tip}
                  tax={x.tax}
                  taxRate={x.taxRate}
                  change={x.change}
                  // cashDiscount={cashDiscount}
                  // fee={x.fee}
                  total={x.total}
                  returnTotal={x.returnTotal}
                  printTemp={printTemp}
                  fromAppointmentTab={fromAppointmentTab}
                  // checkoutPaymentMethods={checkoutPaymentMethods}
                  isSignature={isSignature}
                  isGroupLayout={!!groupAppointment}
                />
              </>
            ))}
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
              returnTotal={returnTotal}
              printTemp={printTemp}
              fromAppointmentTab={fromAppointmentTab}
              checkoutPaymentMethods={checkoutPaymentMethods}
              isSignature={isSignature}
              isGroupLayout={!!groupAppointment}
            />
          </>
        );
      } else
        return (
          <>
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
              returnTotal={returnTotal}
              printTemp={printTemp}
              fromAppointmentTab={fromAppointmentTab}
              checkoutPaymentMethods={checkoutPaymentMethods}
              isSignature={isSignature}
            />
          </>
        );
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
          staffName={staffName}
          returnCode={itemReturn?.code}
          isGroupLayout={!!groupAppointment}
        />
        {_renderAppointments()}
        <ReceiptFooter
          fromAppointmentTab={fromAppointmentTab}
          profile={profile}
          typeReceipt={typeReceipt}
          invoiceCode={invoiceCode}
          promotionNotes={promotionNotes}
          widthPaper={widthPaper}
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
