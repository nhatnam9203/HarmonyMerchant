import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { colors } from "@shared/themes";
import {
  Button,
  ButtonCustom,
  PopupActiveGiftCard,
  PopupChangeMoney,
  PopupChangePriceAmountProduct,
  PopupChangeStylist,
  PopupChangeTip,
  PopupCheckStaffPermission,
  PopupConfirm,
  PopupInvoicePrint,
  PopupProcessingCredit,
  PopupScanCode,
  PopupSendLinkInstall,
  ScrollableTabView,
  Text,
} from "@components";
import ICON from "@resources";
import { scaleSize, checkIsTablet } from "@utils";
import _ from "ramda";
import { useTranslation } from "react-i18next";
import {
  checkCategoryIsNotExist,
  formatMoney,
  formatNumberFromCurrency,
  localize,
  menuTabs,
  roundFloatNumber,
} from "@utils";

export const ButtonBasket = ({
  isDonePayment,
  groupAppointment,
  blockAppointments,
  isBookingFromCalendar,
  tabCurrent,
  basket,
  paymentSelected,
  changeButtonDone,
  isCancelHarmonyPay,
  cancelHarmonyPayment,
  payBasket,
  confimPayOfflinemode,
  bookAppointmentFromCalendar,
  selectPayment,
  bookBlockAppointment,
  checkBlockAppointment,
}) => {
  const { t } = useTranslation();

  let isAcceptPay = !_.isEmpty(groupAppointment)
    ? groupAppointment.total && parseFloat(groupAppointment.total) > 0
      ? true
      : false
    : basket?.length > 0
    ? true
    : false;
  isAcceptPay = paymentSelected === "Cash" ? true : isAcceptPay;

  if (tabCurrent === 1) {
    if (changeButtonDone && isCancelHarmonyPay) {
      if (paymentSelected === "HarmonyPay") {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#0764B0"
            title={t("CANCEL")}
            textColor="#fff"
            onPress={cancelHarmonyPayment}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
          />
        );
      }
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#F1F1F1"
          title={t("DONE")}
          textColor="#6A6A6A"
          onPress={() => {}}
          style={styles.btn_basket}
          styleText={styles.txt_btn_basket}
          activeOpacity={1}
        />
      );
    } else if (changeButtonDone && isDonePayment) {
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#0764B0"
          title={t("DONE")}
          textColor="#fff"
          onPress={() => {}}
          style={styles.btn_basket}
          styleText={styles.txt_btn_basket}
        />
      );
    } else if (
      paymentSelected === "" ||
      paymentSelected === "Gift Card" ||
      !isAcceptPay
    ) {
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#F1F1F1"
          title={t("PAY")}
          textColor="#6A6A6A"
          onPress={() => {}}
          style={styles.btn_basket}
          activeOpacity={1}
          styleText={styles.txt_btn_basket}
        />
      );
    }
    return (
      <ButtonCustom
        width={`100%`}
        backgroundColor="#0764B0"
        title={t("PAY")}
        textColor="#fff"
        onPress={payBasket}
        style={styles.btn_basket}
        styleText={styles.txt_btn_basket}
      />
    );
  } else if (tabCurrent === 2) {
    return (
      <ButtonCustom
        width={`100%`}
        backgroundColor="#0764B0"
        title={t("CONFIRM")}
        textColor="#fff"
        onPress={confimPayOfflinemode}
        style={styles.btn_basket}
        styleText={styles.txt_btn_basket}
      />
    );
  } else {
    if (blockAppointments.length > 0) {
      const isBooking = checkBlockAppointment(blockAppointments);
      if (isBooking) {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#0764B0"
            title={t("BOOK")}
            textColor="#fff"
            onPress={bookBlockAppointment}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
          />
        );
      }
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#F1F1F1"
          title={t("BOOK")}
          textColor="#6A6A6A"
          onPress={() => {}}
          style={styles.btn_basket}
          activeOpacity={1}
          styleText={styles.txt_btn_basket}
        />
      );
    } else if (isBookingFromCalendar) {
      if (
        !_.isEmpty(groupAppointment) &&
        formatNumberFromCurrency(groupAppointment?.total) > 0
      ) {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#0764B0"
            title={t("BOOK")}
            textColor="#fff"
            onPress={bookAppointmentFromCalendar}
            style={styles.btn_basket}
            styleText={styles.txt_btn_basket}
          />
        );
      } else {
        return (
          <ButtonCustom
            width={`100%`}
            backgroundColor="#F1F1F1"
            title={t("BOOK")}
            textColor="#6A6A6A"
            onPress={() => {}}
            style={styles.btn_basket}
            activeOpacity={1}
            styleText={styles.txt_btn_basket}
          />
        );
      }
    } else if (basket?.length > 0 || !_.isEmpty(groupAppointment)) {
      return (
        <ButtonCustom
          width={`100%`}
          backgroundColor="#0764B0"
          title={t("SELECT PAYMENT")}
          textColor="#fff"
          onPress={selectPayment}
          style={styles.btn_basket}
          styleText={styles.txt_btn_basket}
        />
      );
    }
    return (
      <ButtonCustom
        width={`100%`}
        backgroundColor="#F1F1F1"
        title={t("SELECT PAYMENT")}
        textColor="#6A6A6A"
        onPress={() => {}}
        style={styles.btn_basket}
        activeOpacity={1}
        styleText={styles.txt_btn_basket}
      />
    );
  }
};

const styles = StyleSheet.create({
  btn_basket: {
    borderWidth: 1,
    borderColor: "#C5C5C5",
    flex: 1,
    borderRadius: 4,
  },
  txt_btn_basket: {
    fontSize: scaleSize(19),
    fontWeight: "600",
  },
});
