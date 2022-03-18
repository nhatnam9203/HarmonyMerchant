import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { checkIsTablet } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useProps } from "./useProps";
import { ReceiptViewShot } from "./widgets";

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

    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

    const [open, setOpen] = React.useState(false);
    const [printTemp, setPrintTemp] = React.useState(false);
    const [fromAppointmentTab, setFromAppointmentTab] = React.useState(false);

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
    } = useProps({
      appointment,
      invoice,
      groupAppointment,
      printTemp,
      fromAppointmentTab,
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

    const onPrintButtonPress = () => {};
    const onCancelButtonPress = () => {
      hide();
    };

    // forward Ref
    React.useImperativeHandle(ref, () => ({
      show: (params) => {
        const { isPrintTempt, isAppointmentTab } = params ?? {};
        setPrintTemp(isPrintTempt);
        setFromAppointmentTab(isAppointmentTab);
        setOpen(true);
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
                items={items}
                profile={profile}
                customer={customer}
                printTemp={printTemp}
                fromAppointmentTab={fromAppointmentTab}
                invoiceDate={invoiceDate}
                invoiceNO={invoiceNO}
                symbol={symbol}
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
            <ButtonGradient
              label={t("Print")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onPrintButtonPress}
            />
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
