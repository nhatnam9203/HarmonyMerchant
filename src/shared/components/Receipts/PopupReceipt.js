import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { checkIsTablet } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useProps } from "./useProps";
import { ReceiptViewShot } from "./widgets";
import { usePrinter } from "./usePrinter";

const DEFAULT_WIDTH = scaleWidth(391);

export const PopupReceipt = React.forwardRef(
  (
    {
      cancelInvoicePrint,
      doPrintClover,
      appointment,
      invoice,
      groupAppointment,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);
    const viewShotRef = React.useRef(null);

    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

    const [open, setOpen] = React.useState(false);
    const [printTemp, setPrintTemp] = React.useState(false);
    const [fromAppointmentTab, setFromAppointmentTab] = React.useState(false);
    const [isSignature, setIsSignature] = React.useState(true);
    const [isShare, setIsShare] = React.useState(false);
    const [receiptBackground, setReceiptBackground] = React.useState("#fff");

    const {
      portName,
      emulation,
      widthPaper,
      profile,
      profileStaffLogin,
      items,
      customer,
      machineType,
      symbol,
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
    } = useProps({
      appointment,
      invoice,
      groupAppointment,
      printTemp,
      fromAppointmentTab,
    });

    const { printProcess, shareProcess, processLoading } = usePrinter({
      printTemp,
      viewShotRef,
      doPrintClover,
      isSignature,
      setIsSignature,
      onCancelPrint: async (temp) => {
        if (cancelInvoicePrint && typeof cancelInvoicePrint === "function") {
          cancelInvoicePrint(temp);
        }

        // reset
        setOpen(false);
        setIsSignature(true);
        setPrintTemp(false);
        setFromAppointmentTab(false);
        setIsShare(false);
      },
      onCancelShare: async () => {
        // reset
        setOpen(false);
        setIsSignature(true);
        setPrintTemp(false);
        setFromAppointmentTab(false);
        setIsShare(false);
      },
    });

    const hide = () => {
      setOpen(false);
    };

    const onModalHide = () => {
      // setOpen(false);
    };

    const onModalWillHide = () => {};

    const onForceClose = () => {
      setOpen(false);
      if (onForceClose && typeof onForceClose === "function") {
        onForceClose();
      }
    };

    const onPrintButtonPress = async () => {
      await printProcess();
      hide();
    };

    const onShareButtonPress = async () => {
      await shareProcess();
    };
    const onCancelButtonPress = () => {
      hide();
    };

    // forward Ref
    React.useImperativeHandle(ref, () => ({
      show: (params) => {
        const { isPrintTempt, isAppointmentTab } = params ?? {};
        setIsShare(false);
        setPrintTemp(isPrintTempt);
        setFromAppointmentTab(isAppointmentTab);
        setOpen(true);

        const receiptContentBg =
          machineType == PaymentTerminalType.Clover && !portName
            ? "#fff"
            : "#0000";
        setReceiptBackground(receiptContentBg);
      },
      share: (params) => {
        const { isPrintTempt, isAppointmentTab } = params ?? {};
        setIsShare(true);
        setPrintTemp(isPrintTempt);
        setFromAppointmentTab(isAppointmentTab);
        setOpen(true);
        setReceiptBackground("#fff");
      },
    }));

    return (
      <Modal
        transparent={true}
        style={styles.modal}
        testID={"popupReceipt"}
        isVisible={open}
        // useNativeDriver={true}
        hasBackdrop={true}
        backdropOpacity={0.6}
        onModalHide={onModalHide}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={0}
        animationOutTiming={0}
        onModalWillHide={onModalWillHide}
      >
        <View style={styles.container}>
          <View
            style={[
              styles.content,
              {
                height: tempHeight,
                width: widthPaper ? parseFloat(widthPaper) : DEFAULT_WIDTH,
              },
            ]}
          >
            <ScrollView
              style={{ flex: 1 }}
              automaticallyAdjustContentInsets={true}
              keyboardShouldPersistTaps="always"
            >
              <ReceiptViewShot
                ref={viewShotRef}
                backgroundColor={receiptBackground}
                items={items}
                profile={profile}
                customer={customer}
                printTemp={printTemp}
                fromAppointmentTab={fromAppointmentTab}
                invoiceDate={invoiceDate}
                invoiceNO={invoiceNO}
                symbol={symbol}
                typeReceipt={typeReceipt}
                invoiceCode={invoiceCode}
                subTotal={subTotal}
                discount={discount}
                tip={tip}
                tax={tax}
                total={total}
                fee={fee}
                cashDiscount={cashDiscount}
                due={due}
                change={change}
                taxRate={taxRate}
                promotionNotes={promotionNotes}
                checkoutPaymentMethods={checkoutPaymentMethods}
                isSignature={isSignature}
              />
            </ScrollView>
          </View>

          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              label={t("NO")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onCancelButtonPress}
            />
            {isShare ? (
              <ButtonGradient
                label={t("Share")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onShareButtonPress}
              />
            ) : (
              <ButtonGradient
                label={t("Print")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onPrintButtonPress}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
  },

  container: {
    flex: 0,
    backgroundColor: "#fff",
    width: scaleWidth(391),
    alignSelf: "center",
  },

  modal: {
    backgroundColor: "transparent",
    margin: 0,
  },

  content: {},

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});
