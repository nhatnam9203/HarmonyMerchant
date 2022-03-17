import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { checkIsTablet, getReceiptItems } from "@utils";
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

    const { portName, emulation, widthPaper } = useProps();
    const tempHeight = checkIsTablet() ? scaleHeight(400) : scaleHeight(450);

    const [open, setOpen] = React.useState(false);

    const onModalHide = () => {
      setOpen(false);
    };

    const onModalWillHide = () => {};

    const onForceClose = () => {
      setOpen(false);
      if (onForceClose && typeof onForceClose === "function") {
        onForceClose();
      }
    };

    const onPrintButtonPress = () => {};

    const getItems = () => {
      if (appointment) {
        return getReceiptItems(appointment);
      }

      if (groupAppointment) {
        let temps = [];
        groupAppointment.appointments?.forEach((app) => {
          temps.push(...getReceiptItems(appointment));
        });
        return temps;
      }

      if (invoice) {
        return getReceiptItems(invoice.basket);
      }
    };

    // forward Ref
    React.useImperativeHandle(ref, () => ({
      show: () => {
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
        // backdropTransitionOutTiming={0}
        // backdropTransitionInTiming={0}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropTransitionInTiming={150}
        backdropTransitionOutTiming={0}
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
              <ReceiptViewShot items={getItems()} />
            </ScrollView>
          </View>

          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              label={t("NO")}
              width={scaleWidth(140)}
              height={scaleHeight(40)}
              borderRadius={scaleWidth(3)}
              onPress={onPrintButtonPress}
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
