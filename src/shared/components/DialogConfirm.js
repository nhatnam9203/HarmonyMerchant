import IMAGE from "@resources";
import { colors, fonts, layouts } from "@shared/themes";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { ButtonGradient, ButtonGradientWhite } from "./Button";

export const DialogConfirm = React.forwardRef(
  ({ onConfirmYes, description }, ref) => {
    const [t] = useTranslation();

    const [open, setOpen] = React.useState(false);
    const hideModal = () => {
      setOpen(false);
    };

    const onHandleNOButtonPress = () => {
      hideModal();
    };

    const onHandleYESButtonPress = () => {
      hideModal();
      if (onConfirmYes && typeof onConfirmYes === "function") {
        onConfirmYes();
      }
    };

    React.useImperativeHandle(ref, () => ({
      show: () => {
        setOpen(true);
      },
    }));

    return (
      <Modal
        style={styles.modal}
        isVisible={open}
        onRequestClose={hideModal}
        backdropTransitionOutTiming={0}
        backdropTransitionInTiming={0}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[layouts.fill, styles.txtTitle]}>
              {t("Confirmation")}
            </Text>
            <TouchableOpacity style={styles.buttonClose} onPress={hideModal}>
              <Image source={IMAGE.closePopup} style={styles.iconButtonClose} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <View style={layouts.marginVertical} />
            <View style={layouts.marginVertical} />
            <Text style={styles.titleContent}>
              {description ??
                t("Are you sure you want to Delete this Product ?")}
            </Text>
            <View style={layouts.marginVertical} />

            <View style={styles.bottomStyle}>
              <ButtonGradientWhite
                label={t("Yes")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onHandleYESButtonPress}
              />
              <ButtonGradient
                label={t("No")}
                width={scaleWidth(140)}
                height={scaleHeight(40)}
                borderRadius={scaleWidth(3)}
                onPress={onHandleNOButtonPress}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: scaleWidth(480),
    borderRadius: scaleHeight(20),
    shadowColor: "#004080bf",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
  },

  content: { flex: 0, width: "100%", paddingHorizontal: scaleWidth(20) },

  modal: {
    backgroundColor: "#40404030",
    margin: 0,
  },

  header: {
    height: scaleWidth(48),
    width: "100%",
    backgroundColor: colors.OCEAN_BLUE,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: scaleHeight(20),
    borderTopRightRadius: scaleHeight(20),
  },

  txtTitle: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(23),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.WHITE,
  },

  buttonClose: {
    width: scaleWidth(28),
    height: scaleHeight(28),
    borderRadius: scaleWidth(14),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: scaleWidth(10),
  },

  iconButtonClose: {
    width: scaleWidth(14),
    height: scaleHeight(14),
  },

  titleContent: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(20),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "center",
    color: colors.GREYISH_BROWN,
  },

  bottomStyle: {
    width: "100%",
    height: scaleHeight(80),
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});
