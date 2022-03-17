import { ButtonGradient, ButtonGradientWhite } from "@shared/components";
import { checkIsTablet } from "@utils";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { useProps } from "./useProps";
import { ReceiptViewShot } from "./widgets";
import { useTranslation } from "react-i18next";

export const PopupReceipt = React.forwardRef(
  ({ cancelInvoicePrint, doPrintClover }, ref) => {
    const { t } = useTranslation();
    // const {} = useProps();
    const dialogRef = React.useRef(null);

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
        backdropOpacity={0.2}
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
          <View style={styles.content}>
            <View style={{ height: tempHeight }}>
              <ScrollView
                style={{ flex: 1 }}
                automaticallyAdjustContentInsets={true}
                keyboardShouldPersistTaps="always"
              >
                <ReceiptViewShot />
              </ScrollView>
            </View>
          </View>

          <View style={styles.bottomStyle}>
            <ButtonGradientWhite
              label={t("NO")}
              width={scaleWidth(160)}
              height={scaleHeight(45)}
              borderRadius={scaleWidth(3)}
              onPress={onPrintButtonPress}
            />
            <ButtonGradient
              label={t("Print")}
              width={scaleWidth(160)}
              height={scaleHeight(45)}
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
    width: scaleWidth(480),
  },

  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
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
