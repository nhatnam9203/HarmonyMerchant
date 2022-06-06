import { NativeModules, Platform, NativeEventEmitter } from "react-native";
import PrintManager from "@lib/PrintManager";

import _ from "lodash";
import * as AppUtils from "@utils";

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

export const isBookingBlockAppointment = (blockAppointments) => {
  let isBooking = false;
  for (let i = 0; i < blockAppointments.length; i++) {
    const subTotal = AppUtils.formatNumberFromCurrency(
      blockAppointments[i].subTotal
    );
    if (parseFloat(subTotal) > 0) {
      isBooking = true;
      break;
    }
  }

  return isBooking;
};

export const getPaymentString = (paymentType) => {
  let method = "";
  switch (paymentType) {
    case "HarmonyPay":
      method = "harmony";
      break;
    case "Cash":
      method = "cash";
      break;
    case "Credit Card":
      method = "credit_card";
      break;
    case "Debit Card":
      method = "credit_card";
      break;
    case "Gift Card":
      method = "giftcard";
      break;
    case "Other":
      method = "other";
      break;
    default:
      method = "";
  }
  return method;
};

export const openCashDrawer = async (printerSelect, printerList) => {
  const { portName } = AppUtils.getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  if (portName) {
    await PrintManager.getInstance().openCashDrawer(portName);
  } else {
    setTimeout(() => {
      alert("Please connect to your cash drawer.");
    }, 500);
  }
};

export const openCashDrawerClover = (hardware) => {
  const port = _.get(hardware.cloverMachineInfo, "port")
    ? _.get(hardware.cloverMachineInfo, "port")
    : 80;

  const url = `wss://${_.get(
    hardware.cloverMachineInfo,
    "ip"
  )}:${port}/remote_pay`;

  clover.openCashDrawer({
    url,
    remoteAppId: AppUtils.REMOTE_APP_ID,
    appName: AppUtils.APP_NAME,
    posSerial: AppUtils.POS_SERIAL,
    token: _.get(hardware.cloverMachineInfo, "dataLocal.token")
      ? _.get(hardware.cloverMachineInfo, "dataLocal.token", "")
      : "",
  });
};

export const getPriceOfBasket = (basket) => {
  let total = 0;
  for (let i = 0; i < basket?.length; i++) {
    if (basket[i].type === "Product") {
      total = total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
    } else {
      total = total + AppUtils.formatNumberFromCurrency(basket[i].data.price);
    }
  }
  return total;
};

export const getTotalTaxOfBasket = (basket, dataLocal) => {
  const taxService = dataLocal.profile.taxService
    ? AppUtils.formatNumberFromCurrency(dataLocal.profile.taxService)
    : 0;
  const taxProduct = dataLocal.profile.taxProduct
    ? AppUtils.formatNumberFromCurrency(dataLocal.profile.taxProduct)
    : 0;

  let taxTotal = 0;
  for (let i = 0; i < basket?.length; i++) {
    if (basket[i].type === "Product") {
      taxTotal =
        taxTotal +
        (parseFloat(basket[i].data.price) *
          basket[i].quanlitySet *
          taxProduct) /
          100;
    } else if (basket[i].type === "Service") {
      taxTotal =
        taxTotal +
        (AppUtils.formatNumberFromCurrency(basket[i].data.price) * taxService) /
          100;
    }
  }
  return Number(taxTotal).toFixed(2);
};
