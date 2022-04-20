import PrintManager from "@lib/PrintManager";
import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import {
  checkIsTablet,
  formatNumberFromCurrency,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  PaymentTerminalType,
} from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import { StarPRNT } from "react-native-star-prnt";
import { useSelector } from "react-redux";
import RNFetchBlob from "rn-fetch-blob";
import { ReceiptHeaderItem, ReceiptItem } from "./widgets/ReceiptItem";
import { LineHeader } from "./widgets/ReceiptLine";
import { captureRef, releaseCapture } from "react-native-view-shot";

const DEFAULT_WIDTH = scaleWidth(410);

export const PopupSettlementReceipt = React.forwardRef(
  ({ settlement, staffSales, gitfCardSales }, ref) => {
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);
    const viewShotRef = React.useRef(null);

    const { profile, profileStaffLogin, printerList, printerSelect } =
      useSelector((state) => state.dataLocal) ?? {};
    const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};

    const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

    const { settlementDate } = settlement || { settlementDate: new Date() };

    const [open, setOpen] = React.useState(false);
    const [printTemp, setPrintTemp] = React.useState(false);
    const [isShare, setIsShare] = React.useState(false);
    const [receiptBackground, setReceiptBackground] = React.useState("#fff");
    const [loading, setLoading] = React.useState(false);

    const getTotalAmount = () => {
      let totalAmount = 0;
      if (staffSales.length > 0) {
        staffSales.forEach((staff) => {
          totalAmount =
            parseFloat(totalAmount) +
            parseFloat(
              formatNumberFromCurrency(staff.total ? staff.total : 0.0)
            );
        });
      }

      return totalAmount;
    };

    const getGiftCardTotal = () => {
      let giftCardTotal = 0;

      if (gitfCardSales.length > 0) {
        gitfCardSales.forEach((giftCard) => {
          giftCardTotal =
            parseFloat(giftCardTotal) +
            parseFloat(
              formatNumberFromCurrency(giftCard.total ? giftCard.total : 0.0)
            );
        });
      }

      return giftCardTotal;
    };

    const resetAll = () => {
      // reset
      setOpen(false);
      setIsSignature(true);
      setPrintTemp(false);
      setFromAppointmentTab(false);
      setIsShare(false);
      setItemReturn(null);
    };

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
      if (!portName && paymentMachineType === PaymentTerminalType.Pax) {
        alert("Please connect to your printer! ");
        hide();

        return;
      }

      await setLoading(true);

      const imageUrl = await captureRef(viewShotRef, {
        format: "jpg",
        quality: 1,
      });

      if (imageUrl) {
        if (portName) {
          let commands = [];
          commands.push({ appendLineFeed: 0 });
          commands.push({
            appendBitmap: imageUrl,
            width: parseFloat(widthPaper),
            bothScale: true,
            diffusion: true,
            alignment: "Center",
          });

          commands.push({
            appendCutPaper: StarPRNT.CutPaperAction.FullCutWithFeed,
          });

          await PrintManager.getInstance().print(emulation, commands, portName);
        }

        // clear image
        releaseCapture(imageUrl);
        setLoading(false);
      }

      hide();
    };

    const onShareButtonPress = async () => {
      try {
        await setLoading(true);
        // var startTime = performance.now();

        const imageUrl = await captureRef(viewShotRef, {});

        setLoading(false);
        console.log(imageUrl);

        setTimeout(async () => {
          await setLoading(false);

          if (Platform.OS === "ios") {
            RNFetchBlob.ios.previewDocument(imageUrl);
          } else {
            await Share.open({
              url: `file://${imageUri}`,
            });
          }
        }, 550);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }

      hide();
    };
    const onCancelButtonPress = () => {
      hide();
    };

    // forward Ref
    React.useImperativeHandle(ref, () => ({
      share: (params) => {
        const { isPrintTempt, isAppointmentTab } = params ?? {};
        setIsShare(true);
        setOpen(true);
        setReceiptBackground("#fff");
      },
      print: (params) => {
        const { isPrintTempt, isAppointmentTab } = params ?? {};
        setIsShare(false);
        setOpen(true);

        const receiptContentBg =
          paymentMachineType == PaymentTerminalType.Clover && !portName
            ? "#fff"
            : "#0000";
        setReceiptBackground(receiptContentBg);
      },
    }));

    return (
      <Modal
        transparent={true}
        style={styles.modal}
        testID={"popupSettlementReceipt"}
        isVisible={open}
        // useNativeDriver={true}
        hasBackdrop={true}
        backdropOpacity={0.6}
        onModalHide={onModalHide}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={1}
        animationOutTiming={1}
        onModalWillHide={onModalWillHide}
      >
        <View
          style={[
            styles.container,
            { width: widthPaper ? parseFloat(widthPaper) : DEFAULT_WIDTH },
          ]}
        >
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
              <View
                ref={viewShotRef}
                style={[
                  styles.viewShotContainer,
                  { backgroundColor: receiptBackground },
                ]}
              >
                <TextLabel>{`Settlement`}</TextLabel>
                <View style={styles.margin} />
                <TextTime>
                  {` ${formatWithMoment(
                    settlementDate,
                    "MM/DD/YYYY hh:mm A"
                  )} `}
                </TextTime>
                <LineHeader />

                <View style={{ alignItems: "flex-start" }}>
                  <TextLabel>{`Sales by staff`}</TextLabel>
                  <ReceiptHeaderItem
                    key="receipt-sett-header"
                    type="Settlement"
                  />
                  <View style={styles.line} />
                  {staffSales?.map((x, idx) => (
                    <ReceiptItem
                      key={`receipt-sett-${x.staffId}`}
                      item={x}
                      index={idx}
                      type="Settlement"
                    />
                  ))}
                  <ReceiptItem
                    key={`receipt-sett-gift-card`}
                    item={{
                      name: "Gift Card Sold",
                      total: `${getGiftCardTotal()}`,
                    }}
                    index={1000}
                    type="Settlement"
                  />
                  <View style={styles.line} />
                  <ReceiptItem
                    key={`receipt-sett-total`}
                    item={{
                      name: "Total",
                      total: `${getTotalAmount()}`,
                    }}
                    index={0}
                    type="Settlement"
                  />
                  <View style={styles.margin} />
                  <TextLabel>{`Incomes by payment method`}</TextLabel>
                  <ReceiptHeaderItem
                    key="receipt-payment-header"
                    type="TwoCols"
                    items={["Payments", "Amount"]}
                  />
                  <View style={styles.line} />
                  <ReceiptItem
                    key={`receipt-payment-harmony`}
                    item={{
                      name: "Harmony account",
                      value: settlement.paymentByHarmony,
                    }}
                    index={0}
                    type="TwoCols"
                  />

                  <ReceiptItem
                    key={`receipt-payment-credit`}
                    item={{
                      name: "Credit card",
                      value: settlement.paymentByCreditCard,
                    }}
                    index={1}
                    type="TwoCols"
                  />

                  <ReceiptItem
                    key={`receipt-payment-cash`}
                    item={{
                      name: "Cash",
                      value: settlement.paymentByCash,
                    }}
                    index={2}
                    type="TwoCols"
                  />

                  <ReceiptItem
                    key={`receipt-payment-gift-card`}
                    item={{
                      name: "Gift card",
                      value: settlement.paymentByGiftcard,
                    }}
                    index={3}
                    type="TwoCols"
                  />

                  <ReceiptItem
                    key={`receipt-payment-other`}
                    item={{
                      name: "Other",
                      value: settlement.otherPayment,
                    }}
                    index={3}
                    type="TwoCols"
                  />

                  <ReceiptItem
                    key={`receipt-payment-discount`}
                    item={{
                      name: "Discount",
                      value: settlement.discount,
                    }}
                    index={3}
                    type="TwoCols"
                  />

                  <View style={styles.line} />
                  <ReceiptItem
                    key={`receipt-payment-total`}
                    item={{
                      name: "Total",
                      total: settlement.total,
                    }}
                    index={0}
                    type="Settlement"
                  />
                  <View style={styles.margin} />
                  <TextTime>{"Note : "}</TextTime>
                  <View style={styles.margin} />
                  <View style={styles.margin} />
                  <View style={styles.margin} />
                  <View style={styles.margin} />
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              disable={loading}
              label={t("NO")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onCancelButtonPress}
            />
            {isShare ? (
              <ButtonGradient
                label={t("Share")}
                disable={loading}
                loading={loading}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onShareButtonPress}
              />
            ) : (
              <ButtonGradient
                disable={loading}
                loading={loading}
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

const TextLabel = ({ children }) => (
  <Text style={styles.textLabelStyle}>{children}</Text>
);

const TextTime = ({ children }) => (
  <Text style={styles.textTimeStyle}>{children}</Text>
);

const styles = StyleSheet.create({
  dialog: {
    flex: 0,
  },

  viewShotContainer: {
    flex: 0,
    padding: scaleWidth(10),
  },

  container: {
    flex: 0,
    backgroundColor: "#fff",
    // width: scaleWidth(391),
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

  textLabelStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(20),
    textAlign: "center",
    fontWeight: "600",
  },

  textTimeStyle: {
    // fontFamily: fonts.MEDIUM,
    color: "#000",
    fontSize: scaleFont(16),
    textAlign: "center",
    fontWeight: "500",
  },

  margin: {
    width: scaleWidth(10),
    height: scaleHeight(10),
  },

  line: {
    flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    width: "100%",
    paddingVertical: scaleHeight(4),
  },
});
