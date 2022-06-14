import actions from "@actions";
import Configs from "@configs";
import PrintManager from "@lib/PrintManager";
import {
  APP_NAME,
  PaymentTerminalType,
  POS_SERIAL,
  REMOTE_APP_ID,
  requestSettlementDejavoo,
} from "@utils";
import axios from "axios";
import * as l from "lodash";
import moment from "moment";
import React from "react";
import {
  Alert,
  Dimensions,
  Linking,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import env, { Config } from "react-native-config";
import { openSettings } from "react-native-permissions";
import { parseString } from "react-native-xml2js";
import Localization from "../localization";
import configureStore from "../redux/store";
import ICON from "../resources";

export * from "./dejavooRequest";
export * from "./enums";
const { persistor, store } = configureStore();

const PosLink = NativeModules.batch;
const PosLinkReport = NativeModules.report;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { width, height } = Dimensions.get("window");

const { clover } = NativeModules;

export const checkIsTablet = () => {
  const isTablet = parseFloat(width / height) > 1.5 ? true : false;
  return isTablet;
};

export const hiddenTabbar = (stack) => {
  stack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }
    return {
      tabBarVisible,
    };
  };
};

export const isPlatformIOS = (_) => {
  return Platform.OS === "ios";
};

export const scaleSize = (size) => {
  return (width * size) / Configs.DEFAULT_WIDTH;
};

export const requestAPI = async (
  action,
  header = {},
  isChangeServerReport = false
) => {
  let method = action.method || "GET";
  let headers = Object.assign(
    { Accept: "application/json", "Content-Type": "application/json" },
    header
  );

  if (action.token) {
    headers["Authorization"] = `Bearer ${action.token}`;
  }

  headers["User-Agent"] = `HarmonyMerchant/${
    action.versionApp
      ? `${action.versionApp}.${Configs.CODEPUSH_VERSION}`
      : `${Configs.VERSION}.${Configs.CODEPUSH_VERSION}`
  }/${Platform.OS}`;
  headers["DeviceID"] = `${encodeURIComponent(action?.deviceName)}_${
    action?.deviceId
  }`;
  const configs = {
    method: `${method}`.toLowerCase(),
    baseURL: action.isChangeServerReport
      ? Config.API_REPORT_URL
      : Configs.API_URL,
    url: `${action.api}`,
    headers: headers,
    timeout: action?.timeOut ?? action?.timeoutIncrease ? 90000 : 30000,
    validateStatus: (status) => status >= 200 && status < 600,
  };

  if (
    (method == "POST" || method == "DELETE" || method == "PUT") &&
    action.body
  ) {
    configs["data"] = JSON.stringify(action.body);
  }
  try {
    let response = await axios(configs);
    const codeNumber = response.status ? response.status : 0;
    if (codeNumber === 401) {
      return { codeNumber: codeNumber };
    }
    return response.data;
  } catch (error) {
    if (error.request) {
      if (error.message.includes("timeout")) {
        throw "TIME_OUT";
      } else if (error.message.includes("Network Error")) {
        throw "NET_WORK_REQUEST_FAIL";
      } else {
        throw error;
      }
    }
  }
};

export const uploadFromData = async (action, header = {}) => {
  let method = action.method || "GET";
  let baseURL = action.api;
  let headers = Object.assign(
    { Accept: "application/json", "Content-Type": "application/json" },
    header
  );
  if (action.token) {
    headers["Authorization"] = `Bearer ${action.token}`;
  }
  const configs = {
    method: `${method}`.toLowerCase(),
    baseURL: Configs.API_URL,
    url: `${action.api}`,
    headers: headers,
    timeout: 20000,
    validateStatus: (status) => status >= 200 && status < 600,
  };
  configs["data"] = this.createFormData(action.media);
  try {
    let response = await axios(configs);
    return response.data;
  } catch (error) {
    if (error.request) {
      if (error.message.includes("timeout")) {
        throw "TIME_OUT";
      } else if (error.message.includes("Network Error")) {
        throw "NET_WORK_REQUEST_FAIL";
      } else {
        throw error;
      }
    }
  }
};

createFormData = (media) => {
  const data = new FormData();
  for (let i = 0; i < media.length; i++) {
    data.append("files[]", {
      uri:
        Platform.OS === "android"
          ? media[i].uri
          : media[i].uri.replace("file://", ""),
      name: media[i].fileName ? media[i].fileName : "phi.jpg",
      type: media[i].type ? media[i].type : "image/jpeg",
    });
  }

  return data;
};

export const getPosotion = (
  options = { timeout: 20000, maximumAge: 20000, enableHighAccuracy: true }
) => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

export const gotoSettingsDevice = () => {
  Alert.alert(
    "Confirmation",
    "You not allowed this permission. Please go to settings .Then enable allow this permission!",
    [
      { text: "Ask me later", onPress: () => {} },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () =>
          openSettings().catch(() => console.warn("cannot open settings")),
      },
    ],
    { cancelable: false }
  );
};

export const isIphoneX = () => {
  const { height, width } = Dimensions.get("window");
  return Platform.OS === "ios" && (height === 812 || width === 812);
};

export const validateEmail = (email) => {
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validYear = (year) => {
  let rex = /^[12][0-9]{3}$/;
  return rex.test(year);
};

export const openBrowser = (urlSocial) => {
  Linking.canOpenURL(urlSocial)
    .then((supported) => {
      if (!supported) {
      } else {
        return Linking.openURL(urlSocial);
      }
    })
    .catch((err) => console.error("An error occurred", err));
};

export const validateIsNumber = (number) => {
  var n = Number(number);
  return !(n !== n);
};

export const localize = (value, lang = "en") => {
  const temptValue = Localization[lang][value];
  return temptValue ? `${Localization[lang][value]}` : `${value}`;
};

export const getCategoryName = (categories, id) => {
  let name = "";
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].categoryId == id) {
      name = categories[i].name;
      break;
    }
  }
  return name;
};

export const getCategoryIdByName = (categories, name, type = "") => {
  let categoryId = "";
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].name == name) {
      if (type === "") {
        categoryId = categories[i].categoryId;
        break;
      } else {
        if (categories[i].categoryType == type) {
          categoryId = categories[i].categoryId;
          break;
        }
      }
    }
  }
  return categoryId;
};

export const getArrayNameCategories = (categories = [], type = "") => {
  const arrayName = [];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    // if (category?.isDisabled === 1) continue;
    if (type == "") {
      arrayName.push({ value: categories[i].name });
    } else {
      if (categories[i].categoryType == type) {
        arrayName.push({ value: categories[i].name });
      }
    }
  }
  return arrayName;
};

export const getArrayNameStateCity = (stateCity = []) => {
  const arrayName = stateCity.map((state) => {
    return { value: state.name };
  });
  return arrayName;
};

export const getIdStateByName = (stateCity = [], name = "") => {
  let stateId = "";
  for (let i = 0; i < stateCity.length; i++) {
    if (stateCity[i].name == name) {
      stateId = stateCity[i].stateId;
      break;
    }
  }
  if (stateId == "") {
    return 0;
  }
  return stateId;
};

export const getNameStateById = (stateCity = [], id = "") => {
  let stateName = "";
  for (let i = 0; i < stateCity.length; i++) {
    if (stateCity[i].stateId == id) {
      stateName = stateCity[i].name;
      break;
    }
  }
  return stateName;
};

export const getNameLanguage = (keyLanguage) => {
  let language = "";
  switch (keyLanguage) {
    case "en":
      language = "English";
      break;
    case "vi":
      language = "Viet Nam";
      break;
    default:
      language = "Viet Nam";
      break;
  }
  return language;
};

export const getArrayProductsFromAppointment = (products = []) => {
  const temptArrayProducts = products.map((product) => {
    // console.log(product);
    return {
      type: "Product",
      id: `${product.bookingProductId}_pro`,
      quanlitySet: product.quantity, // de khỏi bị bug
      data: {
        name: product.productName,
        qty: product.quantity,
        label: product.value,
        discount: product.discount,
        productId: product.productId,
        price: product.price,
        bookingProductId: product.bookingProductId,
        barCode: product.barCode,
        returnQuantity: product.returnQuantity,
        returnAmount: product.returnAmount,
      },
    };
  });
  return temptArrayProducts;
};

export const getArrayServicesFromAppointment = (services = []) => {
  const temptArrayServices = services.map((service) => {
    return {
      type: "Service",
      id: `${service.bookingServiceId}_ser`,
      data: {
        name: service?.serviceName || "",
        serviceId: service?.serviceId || 0,
        price: service?.price || 0,
        bookingServiceId: service?.bookingServiceId || 0,
      },
      serviceName: "Service",
      staff: service?.staff || {},
      note: service?.note || "",
      extras: [],
      imageUrl: service?.imageUrl || "",
      bookingServiceId: service.bookingServiceId,
    };
  });
  return temptArrayServices;
};

export const getArrayExtrasFromAppointment = (extras = []) => {
  const temptArrayExtras = extras.map((extra) => {
    return {
      type: "Extra",
      id: `${extra?.bookingExtraId}_extra`,
      data: {
        name: extra?.extraName || "",
        extraId: extra?.extraId || 0,
        price: extra?.price || 0,
        bookingExtraId: extra?.bookingExtraId || 0,
        bookingServiceId: extra?.bookingServiceId || 0,
      },
      serviceName: "Extra",
    };
  });

  return temptArrayExtras;
};

export const getArrayGiftCardsFromAppointment = (giftCards = []) => {
  const temptArrayGiftCards = giftCards.map((gift) => {
    return {
      type: "GiftCards",
      id: `${gift.giftCardId}_gift`,
      quanlitySet: gift.quantity,
      data: {
        name: gift.name ? gift.name : "Gift Card",
        giftCardId: gift.giftCardId,
        price: gift.price,
        bookingGiftCardId: gift.bookingGiftCardId,
      },
    };
  });

  return temptArrayGiftCards;
};

export const updateStateChildren = (key, value, parent) => {
  return { ...parent, [key]: value };
};

export const ListCodeAreaPhone = [
  {
    value: "+1",
  },
  {
    value: "+84",
  },
];

export const getCodeAreaPhone = (phone) => {
  if (`${phone}`.includes("+1")) {
    const temptPhone = phone?.split("+1");
    return {
      phone: temptPhone[1],
      areaCode: "+1",
    };
  } else if (`${phone}`.includes("+84")) {
    const temptPhone = phone?.split("+84");
    return {
      phone: temptPhone[1],
      areaCode: "+84",
    };
  }
  return {
    phone: phone,
    areaCode: "+1",
  };
};

export const round2 = (value) => {
  return +(Math.round(value + "e+2") + "e-2");
};

export const formatNumberFromCurrency = (currency) => {
  return Number(`${currency}`.replace(/[^0-9.-]+/g, ""));
};

export const formatMoney = (
  number,
  decimalCount = 2,
  decimal = ".",
  thousands = ","
) => {
  let amount = formatNumberFromCurrency(number);
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {}
};

export const formatMoneyWithUnit = (amount = 0, unit = "$") => {
  if (unit === "$") {
    if (!amount) return unit + " 0.00";
    return unit + " " + formatMoney(amount);
  }

  if (unit === "VND") {
    if (!amount) return "0.00 " + unit;
    return formatMoney(amount) + " " + unit;
  }

  return formatMoney(amount || 0);
};

export const getStaffInfoById = (staffs, staffId) => {
  const temptData = staffs.filter((staff, index) => staff.staffId == staffId);
  if (temptData.length > 0) {
    return { ...temptData[0] };
  }
  return false;
};

export const getServiceNameById = (services, serviceId = 0) => {
  let serviceName = "";
  for (let i = 0; i < services.length; i++) {
    if (services[i].serviceId === serviceId) {
      serviceName = services[i].name;
      break;
    }
  }
  return serviceName;
};

export const getServiceIdByName = (services, name) => {
  let serviceId = 0;
  for (let i = 0; i < services.length; i++) {
    if (services[i].name === name) {
      serviceId = services[i].serviceId;
      break;
    }
  }

  if (serviceId === 0) {
    return name;
  }
  return serviceId;
};

export const getQuickFilterTimeRange = (type) => {
  let quickFilter = "";
  switch (type) {
    case "Today":
      quickFilter = "today";
      break;
    case "Yesterday":
      quickFilter = "yesterday";
      break;
    case "This Week":
      quickFilter = "thisWeek";
      break;
    case "Last Week":
      quickFilter = "lastWeek";
      break;
    case "This Month":
      quickFilter = "thisMonth";
      break;
    case "Last Month":
      quickFilter = "lastMonth";
      break;
    default:
      quickFilter = "";
  }
  return quickFilter;
};

export const YOUTUBE_DATA = [
  {
    videoId: "eQq5knMITLk",
    description: "HarmonyPayment - Mobile Payment App With POS Systems",
  },
];

export const checkEnvironment = () => {
  return Configs.API_URL === "http://api2.levincidemo.com/api/" ? "DEV" : "PRO";
};

export const removeAccent = (str) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/ |/g, "");
  return str;
};

export const checkStateIsValid = (arrayState, state) => {
  let isValid = false;
  for (let i = 0; i < arrayState?.length; i++) {
    if (
      removeAccent(arrayState[i].name.toLowerCase()) ===
      removeAccent(state.toLowerCase())
    ) {
      isValid = true;
      break;
    }
  }
  return isValid;
};

export const splitPlusInPhoneNumber = (phone) => {
  let temptPhone = [];
  for (let i = 0; i < phone.length; i++) {
    if (phone[i] !== "+") {
      temptPhone.push(phone[i]);
    }
  }
  return temptPhone.join("");
};

export const WorkingTime = [
  {
    value: "00:00 AM",
  },
  {
    value: "00:30 AM",
  },
  {
    value: "01:00 AM",
  },
  {
    value: "01:30 AM",
  },
  {
    value: "02:00 AM",
  },
  {
    value: "02:30 AM",
  },
  {
    value: "03:00 AM",
  },
  {
    value: "03:30 AM",
  },
  {
    value: "04:00 AM",
  },
  {
    value: "04:30 AM",
  },
  {
    value: "05:00 AM",
  },
  {
    value: "05:30 AM",
  },
  {
    value: "06:00 AM",
  },
  {
    value: "06:30 AM",
  },
  {
    value: "07:00 AM",
  },
  {
    value: "07:30 AM",
  },
  {
    value: "08:00 AM",
  },
  {
    value: "08:30 AM",
  },
  {
    value: "09:00 AM",
  },
  {
    value: "09:30 AM",
  },
  {
    value: "10:00 AM",
  },
  {
    value: "10:30 AM",
  },
  {
    value: "11:00 AM",
  },
  {
    value: "11:30 AM",
  },
  {
    value: "12:00 PM",
  },
  {
    value: "12:30 PM",
  },
  {
    value: "01:00 PM",
  },
  {
    value: "01:30 PM",
  },
  {
    value: "02:00 PM",
  },
  {
    value: "02:30 PM",
  },
  {
    value: "03:00 PM",
  },
  {
    value: "03:30 PM",
  },
  {
    value: "04:00 PM",
  },
  {
    value: "04:30 PM",
  },
  {
    value: "05:00 PM",
  },
  {
    value: "05:30 PM",
  },
  {
    value: "06:00 PM",
  },
  {
    value: "06:30 PM",
  },
  {
    value: "07:00 PM",
  },
  {
    value: "07:30 PM",
  },
  {
    value: "08:00 PM",
  },
  {
    value: "08:30 PM",
  },
  {
    value: "09:00 PM",
  },
  {
    value: "09:30 PM",
  },
  {
    value: "10:00 PM",
  },
  {
    value: "10:30 PM",
  },
  {
    value: "11:00 PM",
  },
  {
    value: "11:30 PM",
  },
];

export const getWorkingTime = (date) => {
  const index = getCurrentIndexWorkingTime(date);
  return WorkingTime[index]?.value;
};

export const getCurrentIndexWorkingTime = (date) => {
  const currentTime = formatWithMoment(date ?? new Date(), "hh:mm A");
  const splitTime = currentTime?.split(":");
  const splitSpace = splitTime[1]?.split(" ");
  let str;
  if (parseInt(splitSpace[0]) >= 30) {
    str = `${splitTime[0]}:30 ${splitSpace[1]}`;
  } else {
    str = `${splitTime[0]}:00 ${splitSpace[1]}`;
  }

  return WorkingTime.findIndex((x) => x.value === str);
};

export const Roles = [
  {
    value: "Admin",
  },
  {
    value: "Staff",
  },
];

export const Status = [
  {
    value: "Active",
  },
  {
    value: "Disable",
  },
];
export const getMonthNameShort = (month) => {
  const monthNamesShort = {
    "01": "Jan",
    "02": "Fer",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  return monthNamesShort[month];
};
export function formatDateApi(eDate) {
  var dateT = eDate?.split("T");
  var date = dateT[0]?.split("-");
  var month = getMonthNameShort(date[1]);
  return {
    month,
    day: date[2],
    year: date[0],
  };
}

export const getShortNameToPrintInvoice = (name) => {
  if (name.length < 17) {
    return name;
  }
  const shortName = name.slice(0, 16);

  return `${shortName}...`;
};

export const getPaymentString = (type) => {
  let method = "";
  switch (type) {
    case "harmony":
      method = "HarmonyPay";
      break;
    case "cash":
      method = "Cash";
      break;
    case "credit_card":
      method = "Credit Cards";
      break;
    case "other":
      method = "Other - Check";
      break;
    case "giftcard":
      method = "Gift Card";
      break;

    default:
      method = "Debit Cards";
  }
  return method;
};

export const formatWithMoment = (data, key) => {
  const temtFormatDate = moment.parseZone(data).format(key);
  return temtFormatDate != "Invalid date" ? temtFormatDate : "";
};

export const PRINTER_MACHINE = {
  "BT:mPOP": {
    printerModels: "mPOP",
    portName: "BT:mPOP",
    isCashier: true,
    isPrint: true,
    emulation: "StarPRNT",
    widthPaper: "400",
  },
  "BT:TSP100": {
    printerModels: "TSP100",
    portName: "BT:TSP100",
    isCashier: false,
    isPrint: true,
    emulation: "StarGraphic",
    widthPaper: "576",
  },
  WIFI: {
    printerModels: "TSP100",
    portName: "TCP:192.168.254.12",
    isCashier: false,
    isPrint: true,
    emulation: "StarGraphic",
    widthPaper: "576",
  },
};

export const getInfoFromModelNameOfPrinter = (
  printers = [],
  modelName = []
) => {
  let emulation = "";
  let widthPaper = "";
  let portName = "";

  for (let i = 0; i < printers.length; i++) {
    const printer = printers[i];
    if (printer.modelName == modelName) {
      portName = printer.portName;
      break;
    }
  }

  if (portName) {
    const tempPortName = `${modelName}`.toLowerCase();
    if (tempPortName.indexOf("pop") != -1) {
      emulation = "StarPRNT";
      widthPaper = "400";
    } else if (tempPortName.indexOf("tsp") != -1) {
      emulation = "StarGraphic";
      widthPaper = "576";
    }
  }

  return { portName, emulation, widthPaper };
};

export const getPortNameOfPrinter = (printers = [], modelName = "") => {
  let portName = "";
  for (let i = 0; i < printers.length; i++) {
    const printer = printers[i];
    if (printer.modelName == modelName) {
      portName = printer.portName;
      break;
    }
  }
  if (portName) {
  }
  return portName;
};

export const getModalNameOfPrinter = (printers, tempModalName) => {
  let modelName = "";
  for (let i = 0; i < printers.length; i++) {
    const printer = printers[i];
    if (printer.modelName == tempModalName) {
      modelName = printer.modelName;
      break;
    }
  }
  return modelName;
};

export const checkStatusPrint = async (portType = "Bluetooth") => {
  try {
    const printer = await PrintManager.getInstance().portDiscovery(portType);
    return printer ? printer : [];
  } catch (error) {
    throw error;
  }
};

export const roundNumber = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const roundFloatNumber = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const TimeZones = [
  { value: "(UTC+07:00) Asia/Bangkok" },
  { value: "(UTC-09:00) US/Alaska" },
  { value: "(UTC-10:00) US/Aleutian" },
  { value: "(UTC-07:00) US/Arizona" },
  { value: "(UTC-06:00) US/Central" },
  { value: "(UTC-06:00) US/East-Indiana" },
  { value: "(UTC-05:00) US/Eastern" },
  { value: "(UTC-10:00) US/Hawaii" },
  { value: "(UTC-06:00) US/Indiana-Starke" },
  { value: "(UTC-05:00) US/Michigan" },
  { value: "(UTC-07:00) US/Mountain" },
  { value: "(UTC-08:00) US/Pacific" },
  { value: "(UTC-08:00) US/Pacific-New" },
  { value: "(UTC-11:00) US/Samoa" },
];

export const validBirthday = (birthday) => {
  const temptBirthday = new Date(birthday);
  const currentDay = new Date();

  if (currentDay.getTime() < temptBirthday.getTime()) {
    return false;
  }
  return true;
};

export const PAYMENT_METHODS = [
  { value: "" },
  { value: "HarmonyPay" },
  { value: "Credit Card" },
  { value: "Cash" },
  { value: "Other" },
  { value: "Gift Card" },
];

export const getPaymentStringInvoice = (type) => {
  let method = "";
  switch (type) {
    case "HarmonyPay":
      method = "harmony";
      break;
    case "Cash":
      method = "cash";
      break;
    case "Credit Card":
      method = "credit_card";
      break;
    case "Other":
      method = "other";
      break;
    case "Debit Card":
      method = "debit_card";
      break;
    case "Gift Card":
      method = "giftcard";
      break;
    default:
      method = "";
  }
  return method;
};

export const getStatusStringInvoice = (type) => {
  let status = "";
  switch (type) {
    case "Pending":
      status = "pending";
      break;
    case "Incomplete":
      status = "incomplete";
      break;
    case "Transaction Fail":
      status = "transaction fail";
      break;
    case "Paid":
      status = "paid";
      break;
    case "Fail":
      status = "fail";
      break;
    case "Cancel":
      status = "cancel";
      break;
    case "Void":
      status = "void";
      break;
    case "Refund":
      status = "refund";
      break;
    default:
      status = "pending";
  }
  return status;
};

export const getQuickFilterStringInvoice = (type) => {
  let quickFilter = "";
  switch (type) {
    case "Today":
      quickFilter = "today";
      break;
    case "Yesterday":
      quickFilter = "yesterday";
      break;
    case "This Week":
      quickFilter = "thisWeek";
      break;
    case "Last Week":
      quickFilter = "lastWeek";
      break;
    case "This Month":
      quickFilter = "thisMonth";
      break;
    case "Last Month":
      quickFilter = "lastMonth";
      break;
    case "Customize Date":
      quickFilter = "custom";
      break;
    default:
      quickFilter = "";
  }
  return quickFilter;
};

export const getStaffNameForInvoice = (basket = []) => {
  // const staffNameLogin = profileStaffLogin.displayName ? profileStaffLogin.displayName : "";

  let staffArr = [];
  for (let i = 0; i < basket?.length; i++) {
    if (basket[i].type === "Service") {
      let temptName =
        basket[i].staff && basket[i].staff.displayName
          ? basket[i].staff.displayName
          : "";
      staffArr.push(temptName);
    }
  }

  const staffs = [...new Set(staffArr)];
  return staffs.length > 0 ? staffs.join(", ") : "";
};

export const hideCharactes = (str, numShow = 4) => {
  let temptStr = [];

  if (!str) return "";

  for (let i = parseInt(str.length - 1); i >= 0; i--) {
    if (temptStr.length < numShow) {
      temptStr.unshift(str[i]);
    } else {
      str[i] === "-" || str[i] === " "
        ? temptStr.unshift(str[i])
        : temptStr.unshift("*");
    }
  }

  return temptStr.join("");
};

export const BusinessWorkingTime = {
  Monday: {
    timeStart: "10:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Tuesday: {
    timeStart: "10:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Wednesday: {
    timeStart: "08:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Thursday: {
    timeStart: "10:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Friday: {
    timeStart: "08:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Saturday: {
    timeStart: "08:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
  Sunday: {
    timeStart: "08:00 AM",
    timeEnd: "08:00 PM",
    isCheck: true,
  },
};

export const getCredicardIcon = (type) => {
  let icon = "";
  if (`${type}`.indexOf("visa") !== -1) {
    icon = ICON.visaLogo;
  } else if (`${type}`.indexOf("mastercard") !== -1) {
    icon = ICON.masterCardLogo;
  } else if (`${type}`.indexOf("discover") !== -1) {
    icon = ICON.discover;
  } else if (`${type}`.indexOf("americanexpress") !== -1) {
    icon = ICON.amricanExpressLogo;
  } else if (`${type}`.indexOf("other") !== -1) {
    icon = ICON.otherPaymentLogo;
  } else {
    icon = ICON.otherPaymentLogo;
  }

  return icon;
};

export const getTotalProductByQuantity = (unitPrice = 0, quantity = 0) => {
  const total = formatNumberFromCurrency(unitPrice) * parseInt(quantity);

  return formatMoney(roundFloatNumber(total));
};

export const CARD_TYPE = ["VISA", "MASTERCARD", "AMEX", "DISCOVER"];
export const PAYMENT_TYPE = ["SALE", "RETURN", "VOID SALE"];

export const getTitleSignInAppDisplay = (value) => {
  let title = "";
  switch (value) {
    case "service_with_category":
      title = "Services with categories";
      break;
    case "category_only":
      title = "Show categories only";
      break;
    default:
      title = "Services with categories";
  }
  return title;
};

export const getValueSignInAppDisplay = (title) => {
  let value = "";
  switch (title) {
    case "Services with categories":
      value = "service_with_category";
      break;
    case "Show categories only":
      value = "category_only";
      break;
    default:
      value = "service_with_category";
  }
  return value;
};

export const getTitleSendLinkGoogle = (value) => {
  let title = "";
  switch (value) {
    case "auto":
      title = "Automatic";
      break;
    case "manual":
      title = "Manually";
      break;
    case "off":
      title = "Off";
      break;
    default:
      title = "Manually";
  }
  return title;
};

export const getValueSendLinkGoogle = (title) => {
  let value = "";
  switch (title) {
    case "Automatic":
      value = "auto";
      break;
    case "Manually":
      value = "manual";
      break;
    case "Off":
      value = "off";
      break;
    default:
      value = "manual";
  }
  return value;
};

export const checkCategoryIsNotExist = (category, IdCategoriesList) => {
  let isNotExist = true;
  for (let i = 0; i < IdCategoriesList.length; i++) {
    if (IdCategoriesList[i] === category?.categoryId) {
      isNotExist = false;
      break;
    }
  }
  return isNotExist;
};

export const getColorStatus = (status) => {
  let color = "";
  switch (`${status}`.toLowerCase()) {
    case "paid":
      color = "#4CD964";
      break;
    case "pending":
      color = "#0764B0";
      break;
    case "complete":
      color = "#0035FF";
      break;
    case "cancel":
      color = "#C5C5C5";
      break;
    case "checkin":
      color = "#0764B0";
      break;
    default:
      color = "#C5C5C5";
  }
  return color;
};

export const isValidDate = (date) => {
  return /((^(10|12|0?[13578])([/])(3[01]|[12][0-9]|0?[1-9])([/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(11|0?[469])([/])(30|[12][0-9]|0?[1-9])([/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(0?2)([/])(2[0-8]|1[0-9]|0?[1-9])([/])((1[8-9]\d{2})|([2-9]\d{3}))$)|(^(0?2)([/])(29)([/])([2468][048]00)$)|(^(0?2)([/])(29)([/])([3579][26]00)$)|(^(0?2)([/])(29)([/])([1][89][0][48])$)|(^(0?2)([/])(29)([/])([2-9][0-9][0][48])$)|(^(0?2)([/])(29)([/])([1][89][2468][048])$)|(^(0?2)([/])(29)([/])([2-9][0-9][2468][048])$)|(^(0?2)([/])(29)([/])([1][89][13579][26])$)|(^(0?2)([/])(29)([/])([2-9][0-9][13579][26])$))/.test(
    date
  );
};

export const stringToDate = (d) => {
  const date = `${d}`?.split("/");

  if (date.length >= 3) {
    return `${date[2]}-${date[0]}-${date[1]}`;
  }
  return null;
};

export const msToTime = (tempDuration) => {
  const duration = tempDuration * 60 * 1000;
  let minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  return hours == 0 ? `${minutes} min` : `${hours} hour ${minutes} min`;
};

export const MARKETING_CONDITIONS = [
  { value: "No condition" },
  { value: "Using specific services" },
  { value: "Customer birthday is within the week" },
  { value: "Times using the service reached the quantity" },
  { value: "The customer is the referral" },
];

export const DISCOUNT_ACTION = [
  { value: "Discount for whole cart" },
  { value: "Discount for specific services" },
  { value: "Discount by category" },
];

export const formatHourMinute = (time) => {
  if (`${time}`.includes("PM")) {
    const tempTime = `${time}`?.split(":");
    const tempHour =
      parseInt(tempTime[0]) !== 12
        ? parseInt(tempTime[0]) + 12
        : parseInt(tempTime[0]);

    return `${tempHour}:${tempTime[1]}`.replace(" PM", "");
  }
  return `${time}`.replace(" AM", "");
};

export const getConditionIdByTitle = (title) => {
  let id;
  switch (title) {
    case "No condition":
      id = 1;
      break;
    case "Using specific services":
      id = 2;
      break;
    case "Customer birthday is within the week":
      id = 3;
      break;
    case "Times using the service reached the quantity":
      id = 4;
      break;
    case "The customer is the referral":
      id = 5;
      break;
    default:
      id = 1;
  }

  return id;
};

export const getConditionTitleIdById = (id) => {
  let title;
  switch (id) {
    case 1:
      title = "No condition";
      break;
    case 2:
      title = "Using specific services";
      break;
    case 3:
      title = "Customer birthday is within the week";
      break;
    case 4:
      title = "Times using the service reached the quantity";
      break;
    case 5:
      title = "The customer is the referral";
      break;
    default:
      title = "No condition";
  }

  return title;
};

export const getShortNameForDiscountAction = (title) => {
  let shortName = "";
  switch (title) {
    case "Discount for specific services":
      shortName = "specific";
      break;
    case "Discount for whole cart":
      shortName = "all";
      break;
    case "Discount by category":
      shortName = "category";
      break;
    default:
      shortName = "all";
  }

  return shortName;
};

export const getDiscountActionByShortName = (shortName) => {
  let actionDiscount = "";
  switch (shortName) {
    case "specific":
      actionDiscount = "Discount for specific services";
      break;
    case "all":
      actionDiscount = "Discount for whole cart";
      break;
    case "category":
      actionDiscount = "Discount by category";
      break;
    default:
      actionDiscount = "Discount for whole cart";
  }

  return actionDiscount;
};

export const getFormatTags = (data) => {
  const services = [];
  const products = [];
  const categories = [];

  for (let i = 0; i < data.length; i++) {
    const tempData = data[i];
    if (tempData.type === "Service") {
      services.push(tempData?.originalId);
    } else if (tempData.type === "Product") {
      products.push(tempData?.originalId);
    } else {
      categories.push(tempData?.originalId);
    }
  }
  return {
    services,
    products,
    categories,
  };
};

export const getTagInfoById = (type, arrTagId = [], data = []) => {
  const arrInfoTag = [];

  for (let i = 0; i < arrTagId.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j]?.type === type && data[j]?.originalId === arrTagId[i]) {
        arrInfoTag.push({ ...data[j] });
        break;
      }
    }
  }

  return arrInfoTag;
};

export const getIconByNotiType = (type) => {
  let icon;
  switch (type) {
    case "appointment_add":
      icon = "new_appointment";
      break;
    case "appointment_update":
      icon = "appointment_change";
      break;
    case "appointment_schedule_changes":
      icon = "appointment_change";
      break;
    case "appointment_checkin":
      icon = "customer_checkin";
      break;
    case "appointment_confirm":
      icon = "appointment_confirmation";
      break;
    case "appointment_cancel":
      icon = "appointment_cancel";
      break;
    default:
      icon = "new_appointment";
  }
  return icon;
};

export const isPermissionToTab = (permission, tabMenu) => {
  const tabItem = l.find(permission, (item) => {
    return l.get(item, "key") == tabMenu;
  });
  if (l.get(tabItem, "isChecked", true)) {
    return true;
  } else {
    return false;
  }
};

export const getColorTitleByNotiType = (isRead, type) => {
  let color;
  if (isRead == 1) {
    color = "#6A6A6A";
  } else {
    switch (type) {
      case "appointment_cancel":
        color = "#FF3B30";
        break;
      default:
        color = "#0764B0";
    }
  }
  return color;
};

const styles = StyleSheet.create({
  txt_content: {
    color: "#404040",
    fontSize: scaleSize(14),
    fontWeight: "300",
  },
});

export const getNotiContentByType = (noti) => {
  let message;
  switch (noti?.type) {
    case "appointment_add":
      message = (
        <Text style={styles.txt_content}>
          {`${noti?.message || ""} `}
          <Text style={{ fontWeight: "500" }}>
            {`${noti?.customerName || ""} `}
          </Text>
          <Text>{`${noti?.customerPhone || ""}`}</Text>
        </Text>
      );
      break;
    case "appointment_update":
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          {`${noti?.staffName || ""} `}
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
        </Text>
      );
      break;
    case "appointment_schedule_changes":
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          {`${noti?.staffName || ""} `}
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
        </Text>
      );
      break;
    case "appointment_checkin":
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          {`${noti?.customerName || ""} `}
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
          <Text style={{ color: "#0764B0" }}>
            {`#${noti?.appointmentId || ""} `}
          </Text>
        </Text>
      );
      break;
    case "appointment_confirm":
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          {`${noti?.customerName || ""} `}
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
          <Text style={{ color: "#0764B0" }}>
            {`#${noti?.appointmentId || ""} `}
          </Text>
        </Text>
      );
      break;
    case "appointment_cancel":
      message = (
        <Text style={[styles.txt_content]}>
          {`Appointment `}
          <Text style={{ fontWeight: "500", color: "#0764B0" }}>
            {`#${noti?.appointmentCode || ""} `}
          </Text>
          <Text style={{}}>{`${noti?.message || ""} `}</Text>
        </Text>
      );
      break;
    case "close_settlement":
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
        </Text>
      );
      break;
    default:
      message = (
        <Text style={[styles.txt_content, { fontWeight: "500" }]}>
          {`${noti?.customerName || ""} `}
          <Text style={{ fontWeight: "300" }}>{`${noti?.message || ""} `}</Text>
          <Text style={{ color: "#0764B0" }}>
            {`#${noti?.appointmentId || ""} `}
          </Text>
        </Text>
      );
  }
  return message;
};

export const getShortOrderRetailStatus = (status) => {
  let shortStatus;
  switch (status) {
    case "All Status":
      shortStatus = "all";
      break;
    case "Canceled":
      shortStatus = "canceled";
      break;
    case "Completed":
      shortStatus = "completed";
      break;
    case "Pending":
      shortStatus = "pending";
      break;
    case "Processing":
      shortStatus = "processing";
      break;
    case "Shipped":
      shortStatus = "shipped";
      break;
    case "Returned":
      shortStatus = "returned";
      break;
    default:
      shortStatus = "all";
      break;
  }

  return shortStatus;
};

export const getShortOrderPurchasePoint = (purchasePoint) => {
  let shortPurchasePoint;
  switch (purchasePoint) {
    case "All Points":
      shortPurchasePoint = "all";
      break;
    case "Store":
      shortPurchasePoint = "store";
      break;
    case "Website":
      shortPurchasePoint = "website";
      break;
    case "Phone Call":
      shortPurchasePoint = "phone";
      break;
    default:
      shortPurchasePoint = "all";
      break;
  }

  return shortPurchasePoint;
};
export const checkNotSelectedPrinter = () => {
  const { hardware, dataLocal } = store.getState();
  const {
    cloverMachineInfo,
    paymentMachineType,
    dejavooMachineInfo,
  } = hardware;
  const { printerList, printerSelect } = dataLocal;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );
  if (!portName && 
    (paymentMachineType === PaymentTerminalType.Pax 
      || (!dejavooMachineInfo?.isSetup
      && !cloverMachineInfo?.isSetup))) {
    return true;
  }
  return false;
}

export const handleAutoClose = async () => {
  const { dataLocal, hardware } = store.getState();
  const {
    paxMachineInfo,
    cloverMachineInfo,
    paymentMachineType,
    dejavooMachineInfo,
  } = hardware;
  const { token, deviceId, deviceName } = dataLocal;

  if (
    paymentMachineType == PaymentTerminalType.Clover &&
    l.get(cloverMachineInfo, "isSetup")
  ) {
    //Clover
    store.dispatch(actions.invoice.autoCloseBatch());
    const sn = l.get(cloverMachineInfo, "serialNumber");
    requestAPI({
      type: "GET_SETTLEMENT_WAITING",
      method: "GET",
      api: `${Configs.API_URL}settlement/waiting?sn=${sn}&paymentTerminal=clover`,
      token,
      deviceName,
      deviceId,
    }).then((settleWaitingResponse) => {
      const settleWaiting = l.get(settleWaitingResponse, "data");
      store.dispatch(actions.invoice.saveSettleWaiting(settleWaiting));
      settle(settleWaiting, 0, sn);
    });
  } else if (l.get(dejavooMachineInfo, "isSetup")) {
    //Dejavoo
    const sn = l.get(dejavooMachineInfo, "sn");
    requestAPI({
      type: "GET_SETTLEMENT_WAITING",
      method: "GET",
      api: `${Configs.API_URL}settlement/waiting?sn=${sn}&paymentTerminal=clover`,
      token,
      deviceName,
      deviceId,
    }).then((settleWaitingResponse) => {
      const settleWaiting = l.get(settleWaitingResponse, "data");
      settle(settleWaiting, 0, sn);
    });
  } else if (l.get(paxMachineInfo, "isSetup")) {
    //Pax
    const { ip, port, commType, bluetoothAddr } = paxMachineInfo;
    let totalRecord = 0;

    try {
      const tempEnv = env.ENV;
      const tempIpPax = commType == "TCP" ? ip : "";
      const tempPortPax = commType == "TCP" ? port : "";
      const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
      // ----------- Total Amount --------
      let data = await PosLinkReport.reportTransaction({
        transType: "LOCALDETAILREPORT",
        edcType: "ALL",
        cardType: "",
        paymentType: "",
        commType: commType,
        destIp: tempIpPax,
        portDevice: tempPortPax,
        timeoutConnect: "90000",
        bluetoothAddr: idBluetooth,
        refNum: "",
      });
      let result = JSON.parse(data);
      const ExtData = result?.ExtData || "";
      const xmlExtData =
        "<xml>" + ExtData.replace("\\n", "").replace("\\/", "/") + "</xml>";

      if (result?.ResultCode && result?.ResultCode == "000000") {
        if (tempEnv == "Production" && result?.Message === "DEMO APPROVED") {
          console.log("Demo mode");
        } else {
          totalRecord = parseInt(result?.TotalRecord || 0);
          const creditCount = totalRecord;
          parseString(xmlExtData, (err, result) => {
            if (err) {
              processingSettlementWithoutConnectPax();
            } else {
              const terminalID = `${result?.xml?.SN || null}`;

              requestAPI({
                type: "GET_SETTLEMENT_WAITING",
                method: "GET",
                api: `${Configs.API_URL}settlement/waiting?sn=${terminalID}&paymentTerminal=pax`,
                token,
                deviceName,
                deviceId,
              }).then((settleWaitingResponse) => {
                const settleWaiting = l.get(settleWaitingResponse, "data");

                settle(settleWaiting, creditCount, terminalID);
              });
            }
          });
        }
      } else {
        processingSettlementWithoutConnectPax();
      }
    } catch (error) {
      processingSettlementWithoutConnectPax();
    }
  } else {
    processingSettlementWithoutConnectPax();
  }
};

export const processingSettlementWithoutConnectPax = () => {
  const { dataLocal } = store.getState();
  const { token, deviceId, deviceName } = dataLocal;
  requestAPI({
    type: "GET_SETTLEMENT_WAITING",
    method: "GET",
    api: `${Configs.API_URL}settlement/waiting?sn=${null}`,
    token,
    deviceName,
    deviceId,
  }).then((settleWaitingResponse) => {
    const settleWaiting = l.get(settleWaitingResponse, "data");
    store.dispatch(actions.invoice.saveSettleWaiting(settleWaiting));
    proccessingSettlement([], settleWaiting, null, false);
  });
};

export const settle = async (settleWaiting, creditCount, terminalID) => {
  const { dataLocal, hardware } = store.getState();
  const {
    paxMachineInfo,
    cloverMachineInfo,
    paymentMachineType,
    dejavooMachineInfo,
  } = hardware;
  const { ip, port, commType, bluetoothAddr, isSetup } = paxMachineInfo;

  if (
    paymentMachineType == PaymentTerminalType.Clover &&
    l.get(cloverMachineInfo, "isSetup")
  ) {
    //Clover
    const port = l.get(cloverMachineInfo, "port")
      ? l.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;
    clover.closeout({
      url,
      remoteAppId: REMOTE_APP_ID,
      appName: APP_NAME,
      posSerial: POS_SERIAL,
      token: l.get(cloverMachineInfo, "token")
        ? l.get(cloverMachineInfo, "token", "")
        : "",
    });
  } else if (
    paymentMachineType == PaymentTerminalType.Dejavoo &&
    l.get(dejavooMachineInfo, "isSetup")
  ) {
    //Dejavoo
    const responses = await requestSettlementDejavoo();
    parseString(responses, (err, result) => {
      if (l.get(result, "xmp.response.0.ResultCode.0") == 0) {
        //success
        proccessingSettlement("[]", settleWaiting, terminalID, true);
      }
    });
  } else if (isSetup && terminalID) {
    //Pax
    if (Platform.OS === "android") {
      PoslinkAndroid.batchTransaction(
        ip,
        port,
        "",
        "BATCHCLOSE",
        (err) => {},
        (data) => {
          proccessingSettlement(data, settleWaiting, terminalID, true);
        }
      );
    } else {
      const tempIpPax = commType == "TCP" ? ip : "";
      const tempPortPax = commType == "TCP" ? port : "";
      const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
      const paymentTransaction = settleWaiting?.paymentTransaction?.length || 0;
      const responseData = [];

      if (creditCount != paymentTransaction) {
        for (let i = 1; i <= creditCount; i++) {
          let data = await PosLinkReport.reportTransaction({
            transType: "LOCALDETAILREPORT",
            edcType: "ALL",
            cardType: "",
            paymentType: "",
            commType: commType,
            destIp: tempIpPax,
            portDevice: tempPortPax,
            timeoutConnect: "90000",
            bluetoothAddr: idBluetooth,
            refNum: `${i}`,
          });
          const result = JSON.parse(data);
          responseData.push(result);
        }
      }

      PosLink.batchTransaction(
        {
          transType: "BATCHCLOSE",
          edcType: "ALL",
          commType: commType,
          destIp: tempIpPax,
          portDevice: tempPortPax,
          timeoutConnect: "90000",
          bluetoothAddr: idBluetooth,
        },
        (message) => {
          const result = JSON.parse(message);
          if (result.status != 0) {
            proccessingSettlement(
              responseData,
              settleWaiting,
              terminalID,
              true
            );
          }
        }
      );
    }
  }
};

export const proccessingSettlement = async (
  responseData,
  settleWaiting,
  terminalID,
  isConnectPax
) => {
  const { dataLocal } = store.getState();
  const { token, deviceId, deviceName } = dataLocal;
  const editPaymentByHarmony = settleWaiting?.paymentByHarmony || 0.0;
  const editPaymentByCash = settleWaiting?.paymentByCash || 0.0;
  const editOtherPayment = settleWaiting?.otherPayment || 0.0;
  const discountSettlement = settleWaiting?.discount || 0.0;
  const editPaymentByCreditCard = settleWaiting?.paymentByCreditCard || 0.0;
  const paymentByGiftcard = settleWaiting?.paymentByGiftcard || 0.0;
  const depositedAmount = settleWaiting?.depositedAmount || 0.0;
  const settleTotal = {
    paymentByHarmony: editPaymentByHarmony,
    paymentByCreditCard: editPaymentByCreditCard,
    paymentByCash: editPaymentByCash,
    otherPayment: editOtherPayment,
    discount: discountSettlement,
    paymentByCashStatistic: settleWaiting.paymentByCash
      ? settleWaiting.paymentByCash
      : 0.0,
    otherPaymentStatistic: settleWaiting.otherPayment
      ? settleWaiting.otherPayment
      : 0.0,
    paymentByGiftcard: paymentByGiftcard,
    depositedAmount: depositedAmount,
    total: roundFloatNumber(
      formatNumberFromCurrency(editPaymentByHarmony) +
        formatNumberFromCurrency(editPaymentByCreditCard) +
        formatNumberFromCurrency(editPaymentByCash) +
        formatNumberFromCurrency(editOtherPayment) +
        formatNumberFromCurrency(discountSettlement) +
        formatNumberFromCurrency(paymentByGiftcard) +
        formatNumberFromCurrency(depositedAmount)
    ),
    note: "",
    terminalID,
  };
  const body = {
    ...settleTotal,
    checkout: settleWaiting.checkout,
    isConnectPax,
    responseData,
  };
  requestAPI({
    method: "POST",
    api: `${Configs.API_URL}settlement`,
    body,
    token,
    deviceName,
    deviceId,
  });
};

export const stringIsEmptyOrWhiteSpaces = (str) => {
  return (
    str == null ||
    str == undefined ||
    (typeof str === "string" && str.trim().length == 0)
  );
};

export const doPrintClover = (imageUri) => {
  const { hardware } = store.getState();
  const { cloverMachineInfo } = hardware;
  const port = l.get(cloverMachineInfo, "port")
    ? l.get(cloverMachineInfo, "port")
    : 80;
  const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

  const printInfo = {
    imageUri,
    url,
    remoteAppId: REMOTE_APP_ID,
    appName: APP_NAME,
    posSerial: POS_SERIAL,
    token: l.get(cloverMachineInfo, "token")
      ? l.get(cloverMachineInfo, "token", "")
      : "",
  };
  clover.doPrintWithConnect(printInfo);
};

export const getArrayBeakLineString = (text, maxWidth) => {
  let arrayString = [];
  let words = text?.split(" ");
  let textLine = "";
  let oldTextLine = "";
  for (let i = 0; i < words.length; i++) {
    oldTextLine = textLine;
    textLine = textLine + words[i] + " ";
    if (textLine.length > maxWidth) {
      textLine = oldTextLine;
      arrayString.push(textLine);
      textLine = "";

      if (i == words.length - 1) {
        arrayString.push(words[i]);
      }
    } else if (i == words.length - 1) {
      arrayString.push(textLine);
    }
  }

  return arrayString;
};

export const getCenterStringArrayXml = (text) => {
  const arrayString = getArrayBeakLineString(text, 24);
  if (!arrayString) return "";
  let result = "";
  for (let i = 0; i < arrayString.length; i++) {
    result = result + `<t><c>${arrayString[i]}</c></t>`;
  }
  return result;
};

export const getCenterBoldStringArrayXml = (text) => {
  const arrayString = getArrayBeakLineString(text, 24);
  if (!arrayString) return "";
  let result = "";
  for (let i = 0; i < arrayString.length; i++) {
    result = result + `<t><b><c>${arrayString[i]}</c></b></t>`;
  }
  return result;
};

export const getTaxRateFromInvoice = (invoiceDetail) => {
  // taxRate
  let taxRate = 0;
  if (invoiceDetail) {
    const { products = [], services = [] } = invoiceDetail.basket || {};
    if (products?.length > 0) {
      const productItem = products[0];
      taxRate = formatNumberFromCurrency(productItem?.taxRate ?? 0);
      if (taxRate > 0) return taxRate;
    }

    if (services?.length > 0) {
      const serviceItem = services[0];
      taxRate = formatNumberFromCurrency(serviceItem?.taxRate ?? 0);
      if (taxRate > 0) return taxRate;
    }
  }

  return taxRate;
};

export const getTaxRateFromAppointment = (appointment) => {
  // taxRate
  let taxRate = 0;
  if (appointment) {
    const { products, services } = appointment;
    if (products?.length > 0) {
      const productItem = products[0];
      taxRate = formatNumberFromCurrency(productItem?.taxRate ?? 0);
      if (taxRate > 0) return taxRate;
    }

    if (services?.length > 0) {
      const serviceItem = services[0];
      taxRate = formatNumberFromCurrency(serviceItem?.taxRate ?? 0);
      if (taxRate > 0) return taxRate;
    }
  }

  return taxRate;
};

export const getTaxRateFromGroupAppointment = (groupAppointment) => {
  // taxRate
  let taxRate = 0;
  if (groupAppointment) {
    const { appointments = [] } = groupAppointment;
    appointments?.forEach((x) => {
      const { products, services } = x;
      if (products?.length > 0) {
        const productItem = products[0];
        taxRate = formatNumberFromCurrency(productItem?.taxRate);
        if (taxRate > 0) return taxRate;
      }

      if (services?.length > 0) {
        const serviceItem = services[0];
        taxRate = formatNumberFromCurrency(serviceItem?.taxRate);
        if (taxRate > 0) return taxRate;
      }
    });
  }

  return taxRate;
};

export const getReceiptItems = (params = {}) => {
  const { services, products, giftCards, extras } = params;

  const arrayProducts = getArrayProductsFromAppointment(products);
  let arrayServices = getArrayServicesFromAppointment(services);
  const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);

  const extraServiceItems = extras || [];
  if (extraServiceItems?.length > 0) {
    const temps = arrayServices.map((item) => {
      const findItems = extraServiceItems.filter(
        (x) => x.bookingServiceId === item.bookingServiceId
      );

      if (findItems?.length) {
        return Object.assign({}, item, {
          extras: [...(item?.extras ?? []), ...findItems],
        });
      }
      return item;
    });
    arrayServices = temps;
  }

  return arrayServices.concat(arrayProducts, arrayGiftCards);
};

export const getReceiptSymbol = (status) => {
  const salesStatus = ["PAID", "PENDING", "INCOMPLETE", "COMPLETE"];

  if (!status) return "TICKET";
  status = `${status}`.toUpperCase();
  if (salesStatus.includes(status)) return "SALE";
  return status;
};

export const calculateSubTotal = (appointment) => {
  let subTotalTemp = 0
  if (appointment) {
    const { services, products, giftCards, extras } = appointment;
    let totalServices = 0;
    services.forEach((item) => {
      totalServices += formatNumberFromCurrency(item?.price)
    })

    let totalProducts = 0;
    products.forEach((item) => {
      console.log('item', item)
      const totalProductItem = formatNumberFromCurrency(item?.price) * item?.quantity
      console.log('totalProductItem', totalProductItem)
      totalProducts += totalProductItem;
    })

    let totalGiftCards = 0;
    giftCards.forEach((item) => {
      totalGiftCards += formatNumberFromCurrency(item?.price)
    })

    let totalExtras = 0;
    extras.forEach((item) => {
      totalExtras += formatNumberFromCurrency(item?.price)
    })
    console.log('totalProducts', totalProducts)
    subTotalTemp = totalServices + totalProducts + totalGiftCards + totalExtras;
  }
  
  return subTotalTemp;
}
