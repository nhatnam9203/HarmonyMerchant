import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { fonts, layouts, colors } from "../themes";
import IMAGE from "@resources";
import { ButtonGradientWhite, ButtonGradient } from "./Button";

export const ButtonRightPanelFilter = ({ children, onReset, onApply }) => {
  const [t] = useTranslation();
  const [open, setOpen] = React.useState(false);

  const hideModal = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  const onResetButtonPressed = () => {
    if (onReset && typeof onReset === "function") {
      onReset();
    }
    hideModal();
  };

  const onApplyButtonPressed = () => {
    if (onApply && typeof onApply === "function") {
      onApply();
    }
    hideModal();
  };

  return (
    <View>
      <TouchableOpacity style={styles.buttonContainer} onPress={showModal}>
        <Text style={styles.text}>{t("Filters")}</Text>
        <View style={layouts.marginHorizontal} />
        <Image source={IMAGE.filter} style={styles.icon} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        style={styles.modal}
        isVisible={open}
        testID={"modal"}
        onRequestClose={hideModal}
        backdropTransitionOutTiming={0}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        // animationInTiming={10000}
        // animationOutTiming={10000}
        useNativeDriver={true}
        hasBackdrop={true}
        backdropOpacity={0}
        onBackdropPress={hideModal}
      >
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("Filters")}</Text>
            <TouchableOpacity onPress={hideModal}>
              <Image source={IMAGE.close_noti_popup} style={styles.close} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
          <View style={styles.bottom}>
            <ButtonGradientWhite
              label={t("Reset")}
              width={scaleWidth(100)}
              height={scaleHeight(35)}
              onPress={onResetButtonPressed}
              borderRadius={scaleWidth(3)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    padding: 0,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  buttonContainer: {
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#cccccc",
    flexDirection: "row",
    height: scaleHeight(40),
    alignItems: "center",
    minWidth: scaleWidth(128),
    justifyContent: "space-between",
    paddingHorizontal: scaleWidth(10),
    flex: 0,
  },

  icon: {
    width: scaleWidth(24),
    height: scaleHeight(24),
    tintColor: colors.BROWNISH_GREY,
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(17),
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  panel: {
    width: scaleWidth(240),
    height: scaleHeight(700),
    backgroundColor: colors.WHITE,
    shadowColor: "#40404040",
    shadowOffset: {
      width: -3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },

  header: {
    backgroundColor: colors.WHITE,
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    height: scaleHeight(52),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: scaleWidth(16),
  },

  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: scaleFont(17),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.GREYISH_BROWN,
  },

  close: {
    width: scaleWidth(16),
    height: scaleHeight(16),
    tintColor: "#00001d",
  },

  content: {
    paddingHorizontal: scaleWidth(16),
    flex: 1,
  },

  bottom: {
    height: scaleHeight(40),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaleWidth(12),
    marginBottom: scaleHeight(10),
  },
});
