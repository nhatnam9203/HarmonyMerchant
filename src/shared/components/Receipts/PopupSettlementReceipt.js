import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { checkIsTablet, PaymentTerminalType } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useProps } from "./useProps";
import { ReceiptViewShot } from "./widgets";
import { usePrinter } from "./usePrinter";
import { useDejavooReceiptXml } from "./useDejavooReceiptXml";
import {
  getInfoFromModelNameOfPrinter,
  getReceiptItems,
  getReceiptSymbol,
  getTaxRateFromGroupAppointment,
  getTaxRateFromAppointment,
} from "@utils";
import { useSelector } from "react-redux";
import { formatWithMoment } from "@utils";

const DEFAULT_WIDTH = scaleWidth(410);

export const PopupSettlementReceipt = React.forwardRef(
  ({ settlement }, ref) => {
    const { t } = useTranslation();
    const dialogRef = React.useRef(null);
    const viewShotRef = React.useRef(null);
    console.log(settlement);

    const { profile, profileStaffLogin, printerList, printerSelect } =
      useSelector((state) => state.dataLocal) ?? {};

    const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

    const [open, setOpen] = React.useState(false);
    const [printTemp, setPrintTemp] = React.useState(false);
    const [isShare, setIsShare] = React.useState(false);
    const [receiptBackground, setReceiptBackground] = React.useState("#fff");
    const [loading, setLoading] = React.useState(false);

    const resetAll = () => {
      // reset
      setOpen(false);
      setIsSignature(true);
      setPrintTemp(false);
      setFromAppointmentTab(false);
      setIsShare(false);
      setAutoPrint(false);
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
      hide();
    };

    const onShareButtonPress = async () => {};
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
          machineType == PaymentTerminalType.Clover && !portName
            ? "#fff"
            : "#0000";
        setReceiptBackground(receiptContentBg);
        setAutoPrint(true);
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
                <TextTime>
                  {` ${formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A")} `}
                </TextTime>
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
    paddingHorizontal: scaleWidth(10),
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
    fontSize: scaleFont(18),
    textAlign: "center",
    fontWeight: "600",
  },
});
