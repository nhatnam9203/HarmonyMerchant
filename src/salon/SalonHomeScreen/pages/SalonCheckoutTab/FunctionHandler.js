import { NativeModules, Platform, NativeEventEmitter } from "react-native";
import {
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  formatNumberFromCurrency,
  getStaffInfoById,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getArrayGiftCardsFromAppointment,
  requestAPI,
  localize,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  PaymentTerminalType,
  requestTransactionDejavoo,
  requestPreviousTransactionReportDejavoo,
  stringIsEmptyOrWhiteSpaces,
  handleResponseDejavoo,
} from "@utils";
import _ from "lodash";

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;
