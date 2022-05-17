import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { fonts } from "@shared/themes";
import { useDispatch } from "react-redux";
import { appMerchant } from "@redux/slices";

export const BottomToastMessage = ({ message }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onCloseWarning = () => {
    dispatch(appMerchant?.hideExpiredMessage());
  };

  if (!message) return <></>;
  return (
    <View style={styles.container}>
      {!!message && (
        <View style={styles.content}>
          <Text style={styles.text}>{message}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={onCloseWarning}>
        <Text style={styles.text}>{t("Close")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scaleHeight(40),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffae",
    flexDirection: "row",
    paddingHorizontal: scaleHeight(20),
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  text: {
    fontSize: scaleFont(15),
    color: "red",
    marginLeft: scaleWidth(10),
  },

  button: {
    height: scaleHeight(28),
    width: scaleWidth(60),
    borderRadius: scaleWidth(4),
    borderColor: "#aaa",
    borderWidth: scaleHeight(1),
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontFamily: fonts.REGULAR,
    fontSize: scaleFont(16),
    color: "#333",
  },
});
