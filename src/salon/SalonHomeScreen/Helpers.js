import { NativeModules, Platform, NativeEventEmitter } from "react-native";

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
