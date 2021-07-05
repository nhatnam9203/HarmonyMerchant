import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { fonts, layouts, colors } from "../themes";
import IMAGE from "@resources";
import { ButtonGradientWhite, ButtonGradient } from "./Button";

// !! Test Component chưa có xài
export const SlideInRightModal = ({
  children,
  bottomComponent,
  visible,
  onRequestClose,
}) => {
  const [t] = useTranslation();

  const onHandleModalShow = () => {};

  const onHandleModalHide = () => {};

  return (
    <Modal
      transparent={true}
      // animationType="slide"
      style={styles.modal}
      isVisible={visible}
      testID={"modal"}
      onRequestClose={onRequestClose}
      onModalShow={onHandleModalShow}
      onModalHide={onHandleModalHide}
      backdropTransitionOutTiming={0}
      animationInTiming={0}
      useNativeDriver={true}
      onBackdropPress={onRequestClose}
      hasBackdrop={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
    >
      <View style={styles.panel}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("Filters")}</Text>
          <TouchableOpacity onPress={onRequestClose}>
            <Image source={IMAGE.close_noti_popup} style={styles.close} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>{children}</View>
        {bottomComponent && (
          <View style={styles.bottom}>{bottomComponent()}</View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    padding: 0,
  },

  container: {
    flex: 0,
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
    justifyContent: "space-between",
    paddingHorizontal: scaleWidth(12),
    marginBottom: scaleHeight(10),
  },
});
