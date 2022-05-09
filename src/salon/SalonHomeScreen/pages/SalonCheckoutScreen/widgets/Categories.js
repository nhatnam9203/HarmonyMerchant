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

export const Categories = () => {
  const { t } = useTranslation();

  return <View></View>;
};

const styles = StyleSheet.create({});
