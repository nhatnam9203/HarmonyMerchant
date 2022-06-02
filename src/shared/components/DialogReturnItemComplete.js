import {
  ButtonGradient,
  ButtonGradientWhite,
  ReceiptViewShot,
} from "@shared/components";
import { usePrinter } from "@shared/components/Receipts/usePrinter";
import { useProps } from "@shared/components/Receipts/useProps";
import { useGetAppointment } from "@shared/services/api/retailer";
import { colors, fonts, metrics } from "@shared/themes";
import { statusSuccess } from "@shared/utils";
import { PaymentTerminalType } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";

const DEFAULT_WIDTH = scaleWidth(400);

export const DialogReturnItemComplete = React.forwardRef(
  ({ groupAppointmentId, cancelPrint }, ref) => {
    const { t } = useTranslation();
    const viewShotRef = React.useRef(null);
    const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};

    const [show_modal, setShowModal] = React.useState(false);
    const [itemReturn, setItemReturn] = React.useState(null);
    const [autoPrint, setAutoPrint] = React.useState(false);
    const [receiptBackground, setReceiptBackground] = React.useState("#fff");
    const [appointment, setAppointment] = React.useState(null);
    const [isSignature, setIsSignature] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const [appointmentGet, getAppointment] = useGetAppointment();

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
      staffName,
      returnTotal,
    } = useProps({
      appointment,
      printTemp: false,
      fromAppointmentTab: false,
      isSignature,
      itemReturn,
    });

    const { printProcess, shareProcess, processLoading } = usePrinter({
      printTemp: false,
      viewShotRef,
      doPrintClover: () => {},
      isSignature,
      fromAppointmentTab: false,
      setIsSignature,
      onCancelPrint: async (temp) => {
        setShowModal(false);

        if (cancelPrint && typeof cancelPrint === "function") {
          cancelPrint();
        }
        resetAll();
      },
      onCancelShare: async () => {
        setShowModal(false);
        setTimeout(() => {
          resetAll();
        }, 2000);
      },
      getContentXmlReceipt: () => {},
    });

    const resetAll = () => {
      // reset
      setIsSignature(true);
      setShowModal(false);
      setAutoPrint(false);
      setItemReturn(null);
      setAppointment(null);
      setLoading(false);
    };

    const hideModal = () => {
      setShowModal(false);
      if (cancelPrint && typeof cancelPrint === "function") {
        cancelPrint();
      }
      resetAll();
    };

    const onNoButtonPress = () => {
      hideModal();
    };

    const onYesButtonPress = () => {
      if (paymentMachineType === PaymentTerminalType.Pax && !portName) {
        alert("Please connect to your printer!");
        setShowModal(false);

        if (cancelPrint && typeof cancelPrint === "function") {
          cancelPrint();
        }
        resetAll();
      } else {
        printProcess();
      }
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setShowModal(true);
      },
    }));

    React.useEffect(() => {
      if (show_modal && groupAppointmentId) {
        setLoading(true);
        getAppointment(groupAppointmentId);
        setLoading(true);
      }
    }, [show_modal, groupAppointmentId]);

    React.useEffect(() => {
      const { codeStatus, data } = appointmentGet || {};
      if (statusSuccess(codeStatus)) {
        setAppointment(data);
        if (data?.returns?.length > 0) {
          let temps = [...data?.returns];
          temps.sort(
            (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
          );
          setItemReturn(temps[0]);
        }
      } else {
      }

      if (appointmentGet) {
        setLoading(false);
      }
    }, [appointmentGet]);

    React.useEffect(() => {
      if (itemReturn) {
        setLoading(false);
      }
    }, [itemReturn]);

    return (
      <>
        <Modal
          style={styles.modal}
          visible={show_modal}
          onRequestClose={hideModal}
        >
          <View style={[styles.container, styles.containerStyle]}>
            <View style={styles.margin} />
            <Text style={styles.txtTitle}>{t("Return Complete")}</Text>
            <View style={styles.margin} />
            <Text style={styles.txtQuestion}>
              {t("Do you want to print receipt ?")}
            </Text>
            <View style={styles.margin} />
            <View style={styles.line} />
            <View style={styles.buttonContent}>
              <ButtonGradientWhite
                label={t("No")}
                width={scaleWidth(140)}
                height={scaleHeight(45)}
                borderRadius={scaleWidth(3)}
                onPress={onNoButtonPress}
              />
              <ButtonGradient
                label={t("Yes")}
                width={scaleWidth(140)}
                height={scaleHeight(45)}
                borderRadius={scaleWidth(3)}
                onPress={onYesButtonPress}
                loading={loading}
                disable={loading}
              />
            </View>
          </View>
        </Modal>
        {show_modal && (
          <View
            style={[
              styles.content,
              {
                height: scaleHeight(450),
                width: DEFAULT_WIDTH,
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
                printTemp={false}
                fromAppointmentTab={false}
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
                returnTotal={returnTotal}
                fee={fee}
                cashDiscount={cashDiscount}
                due={due}
                change={change}
                taxRate={taxRate}
                promotionNotes={promotionNotes}
                checkoutPaymentMethods={checkoutPaymentMethods}
                isSignature={false}
                itemReturn={itemReturn}
                staffName={staffName}
              />
            </ScrollView>
          </View>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(0,0,0,0.5)",
    margin: 0,
  },

  container: {
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    width: scaleWidth(480),
    height: scaleHeight(247),
    borderRadius: scaleHeight(20),
    padding: scaleWidth(10),
  },

  containerStyle: {
    shadowColor: colors.OCEAN_BLUE,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(28),
    fontWeight: "600",
    textAlign: "center",
    color: "#0764B0",
  },

  txtQuestion: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(22),
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  margin: {
    height: scaleHeight(30),
    width: scaleWidth(30),
  },

  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#EEEEEE",
  },

  buttonContent: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    paddingTop: scaleHeight(10),
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  content: {
    position: "absolute",
    // top: 0,
    top: metrics.screenHeight,
  },
});
