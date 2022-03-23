import actions from "@actions";
import ICON from "@resources";
import { ReceiptViewShot } from "@shared/components";
import { usePrinter } from "@shared/components/Receipts/usePrinter";
import { useProps } from "@shared/components/Receipts/useProps";
import { checkIsTablet, PaymentTerminalType } from "@utils";
import React from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTitleSendLinkGoogle, scaleSize } from "../utils";
import Button from "./Button";
import ButtonCustom from "./ButtonCustom";
import ModalCustom from "./ModalCustom";
import { metrics } from "@shared/themes";
import { useTranslation } from "react-i18next";
import { fonts, colors } from "@shared/themes";

const DEFAULT_WIDTH = scaleWidth(391);

export const DialogPayCompleted = ({
  donotPrintBill,
  printBill,
  onRequestClose,
  cancelInvoicePrint,
  doPrintClover,
  paymentSelected,
  groupAppointment,
}) => {
  const viewShotRef = React.useRef(null);
  const { t } = useTranslation();
  const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};

  const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);
  const [printTemp, setPrintTemp] = React.useState(false);
  const [isSignature, setIsSignature] = React.useState(true);
  const [receiptBackground, setReceiptBackground] = React.useState("#fff");
  const [autoPrint, setAutoPrint] = React.useState(false);

  const dispatch = useDispatch();
  const checkIcon = isSendLink ? ICON.checkBox : ICON.checkBoxEmpty;
  const visiblePaymentCompleted = useSelector(
    (state) => state.appointment.visiblePaymentCompleted
  );

  const [isSendLink, setSendLink] = React.useState(false);

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
    groupAppointment,
    printTemp,
    fromAppointmentTab: false,
    isSignature,
  });

  const { printProcess, shareProcess, processLoading } = usePrinter({
    printTemp,
    viewShotRef,
    doPrintClover,
    isSignature,
    fromAppointmentTab: false,
    setIsSignature,
    onCancelPrint: async (temp) => {
      printBill();

      if (cancelInvoicePrint && typeof cancelInvoicePrint === "function") {
        cancelInvoicePrint(temp);
      }
      resetAll();
    },
    onCancelShare: async () => {
      resetAll();
    },
  });

  const resetAll = () => {
    // reset
    setIsSignature(true);
    setPrintTemp(false);
    setAutoPrint(false);
  };

  switchSendLink = () => {
    setSendLink((prev) => !prev);
  };

  handleSendGoogleLinkReview = async () => {
    if (isSendLink) {
      let customerIdList = new Set();
      const appointments = groupAppointment?.appointments || [];
      for (let i = 0; i < appointments.length; i++) {
        customerIdList.add(appointments[i]?.customerId);
      }
      const customerIdListNeedToSendLink = [...customerIdList];
      const merchantId = profile?.merchantId || 0;
      customerIdListNeedToSendLink.forEach((customerId) =>
        dispatch(actions.customer.sendGoogleReviewLink(customerId, merchantId))
      );
      await setSendLink(false);
    }
  };

  onButtonPrintBillPress = async () => {
    handleSendGoogleLinkReview();

    if (paymentMachineType === PaymentTerminalType.Pax && !portName) {
      alert("Please connect to your printer!");
      printBill();

      if (cancelInvoicePrint && typeof cancelInvoicePrint === "function") {
        cancelInvoicePrint(printTemp);
      }
      resetAll();
    } else {
      if (
        paymentSelected === "Cash" ||
        (paymentSelected === "Other" && profile?.isOpenCashier)
      ) {
        if (paymentMachineType === PaymentTerminalType.Clover && !portName) {
          this.openCashDrawerClover();
        } else {
          this.openCashDrawer(portName);
        }
      }

      await printProcess();
    }

    // TEST
    // await printProcess();
  };

  cancelPrintBill = () => {
    handleSendGoogleLinkReview();
    donotPrintBill();
  };

  return (
    <>
      <ModalCustom
        transparent={true}
        visible={visiblePaymentCompleted}
        onRequestClose={() => {}}
      >
        {processLoading ? (
          <View
            style={{
              width: scaleSize(120),
              height: scaleSize(80),
              backgroundColor: "#fff",
              borderRadius: scaleSize(8),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={colors.WEIRD_GREEN} size="large" />
            <View style={{ height: scaleHeight(10) }} />
            <Text
              style={{
                fontFamily: fonts.LIGHT,
                fontSize: scaleFont(13),
                // color: colors.GREYISH_BROWN,
              }}
            >
              {t("Printer processing ... ")}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: scaleSize(450),
              height: scaleSize(230),
              backgroundColor: "#fff",
              borderRadius: scaleSize(16),
            }}
          >
            <View style={{ flex: 1 }}>
              {/* ---------- header ------ */}
              <View
                style={{
                  alignItems: "center",
                  paddingTop: scaleSize(16),
                  paddingBottom: scaleSize(12),
                }}
              >
                <Text
                  style={{
                    color: "#0764B0",
                    fontSize: scaleSize(28),
                    fontWeight: "bold",
                  }}
                >
                  {`Transaction completed!`}
                </Text>
              </View>
              {/* ------------ content ----- */}
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#404040", fontSize: scaleSize(20) }}>
                  {`Do you want to print receipt?`}
                </Text>
              </View>

              {/* ------------ Check box ----- */}
              {profile.sendReviewLinkOption === "manual" ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onPress={switchSendLink}
                    style={{ justifyContent: "center" }}
                  >
                    <Image source={checkIcon} />
                  </Button>
                  <Text
                    style={{
                      color: "rgb(130,130,130)",
                      fontSize: scaleSize(18),
                      marginLeft: scaleSize(12),
                    }}
                  >
                    {`Send Google Review Link`}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "rgb(130,130,130)",
                      fontSize: scaleSize(16),
                      marginLeft: scaleSize(12),
                    }}
                  >
                    {`You Are Choosing ${getTitleSendLinkGoogle(
                      profile.sendReviewLinkOption
                    )} Send Google Review Link`}
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                height: scaleSize(75),
                flexDirection: "row",
                paddingHorizontal: scaleSize(70),
                alignItems: "center",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: "rgb(212,211,211)",
              }}
            >
              <ButtonCustom
                width={scaleSize(100)}
                height={40}
                backgroundColor="#0764B0"
                // title={localize('Search', language)}
                title="Yes"
                textColor="#fff"
                onPress={onButtonPrintBillPress}
                style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
                styleText={{ fontSize: scaleSize(18), fontWeight: "normal" }}
              />

              <ButtonCustom
                width={scaleSize(100)}
                height={40}
                backgroundColor="#F1F1F1"
                title="No"
                textColor="#6A6A6A"
                onPress={cancelPrintBill}
                style={{ borderWidth: 1, borderColor: "#C5C5C5" }}
                styleText={{ fontSize: scaleSize(18), fontWeight: "normal" }}
              />
            </View>
          </View>
        )}
      </ModalCustom>
      {visiblePaymentCompleted && (
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
      )}
    </>
  );
};

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

  content: {
    position: "absolute",
    top: metrics.screenHeight,
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});
