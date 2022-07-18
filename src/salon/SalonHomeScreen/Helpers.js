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

export const getPaymentMethod = (paymentType) => {
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

export const createItemAddBasket = (basket, staffId) => {
  const arrayProductBuy = [];
  const arryaServicesBuy = [];
  const arrayExtrasBuy = [];
  for (let i = 0; i < basket?.length; i++) {
    if (basket[i].type === "Product") {
      arrayProductBuy.push({
        ...basket[i],
        productId: basket[i].data.productId,
        quantity: basket[i].quanlitySet,
      });
    } else if (basket[i].type === "Service") {
      arryaServicesBuy.push({
        ...basket[i],
        serviceId: basket[i].data.serviceId,
        staffId: staffId,
        tipAmount: 0,
      });
    } else if (basket[i].type === "Extra") {
      arrayExtrasBuy.push({
        ...basket[i],
        extraId: basket[i].data.extraId,
      });
    }
  }
  return {
    arrayProductBuy,
    arryaServicesBuy,
    arrayExtrasBuy,
    staffId: staffId,
  };
};

export const getBasketOnline = (appointments) => {
  const arrayProductBuy = [];
  const arryaServicesBuy = [];
  const arrayExtrasBuy = [];
  const arrayGiftCards = [];
  const promotionNotes = [];

  appointments.forEach((appointment) => {
    const note = appointment?.promotionNotes?.note || "";
    if (note) {
      promotionNotes.push(note);
    }
    // ------ Push Service -------
    appointment?.services.forEach((service) => {
      arryaServicesBuy.push({
        type: "Service",
        data: {
          name: service?.serviceName || "",
          price: service?.price || "",
        },
        staff: service?.staff || false,
        note: service?.note || "",
      });
    });

    // ------ Push Product -------
    appointment?.products.forEach((product) => {
      arrayProductBuy.push({
        type: "Product",
        data: {
          name: product?.productName || "",
          price: product?.price || "",
        },
        quanlitySet: product?.quantity || "",
      });
    });

    // ------ Push Product -------
    appointment?.extras.forEach((extra) => {
      arrayExtrasBuy.push({
        type: "Extra",
        data: {
          name: extra?.extraName || "",
          price: extra?.price || "",
        },
      });
    });

    // ------ Push Gift Card -------
    appointment?.giftCards.forEach((gift) => {
      arrayGiftCards.push({
        type: "GiftCards",
        data: {
          name: gift?.name || "Gift Card",
          price: gift?.price || "",
        },
        quanlitySet: gift?.quantity || "",
      });
    });
  });

  return {
    arryaServicesBuy,
    arrayProductBuy,
    arrayExtrasBuy,
    arrayGiftCards,
    promotionNotes,
  };
};

export const getBasketOffline = (basket, staffId) => {
  const arrayProductBuy = [];
  const arryaServicesBuy = [];
  const arrayExtrasBuy = [];
  for (let i = 0; i < basket?.length; i++) {
    if (basket[i].type === "Product") {
      arrayProductBuy.push({
        ...basket[i],
        productId: basket[i].data.productId,
        quantity: basket[i].quanlitySet,
      });
    } else if (basket[i].type === "Service") {
      arryaServicesBuy.push({
        ...basket[i],
        serviceId: basket[i].data.serviceId,
        staffId: staffId,
        tipAmount: 0,
      });
    } else if (basket[i].type === "Extra") {
      arrayExtrasBuy.push({
        ...basket[i],
        extraId: basket[i].data.extraId,
      });
    }
  }
  return {
    arrayProductBuy,
    arryaServicesBuy,
    arrayExtrasBuy,
    staffId: staffId,
  };
};

export const createProductItemAddAppointment = (item, quantity = 1) => {
  return {
    services: [],
    extras: [],
    products: [
      {
        productId: item?.productId,
        quantity: quantity,
      },
    ],
    giftCards: [],
  };
};

export const createServiceItemAddAppointment = (
  item,
  staffId,
  temptExtra = []
) => {
  return {
    services: [
      {
        serviceId: item?.serviceId,
        ...(staffId && {
          staffId: staffId,
        }),
        ...(item?.isCustomService && {
          categoryId: item?.categoryId,
          price: item?.price,
        }),
      },
    ],
    extras: temptExtra,
    products: [],
    giftCards: [],
  };
};

export const createServiceItemAddBasket = (item, staff) => {
  return {
    type: "Service",
    id: `${item?.serviceId}_ser`,
    data: {
      name: item?.name ?? "Custom Service",
      serviceId: item?.serviceId,
      price: item?.price,
    },
    serviceName: item?.name ?? "Custom Service",
    staff: staff,
    ...(item?.isCustomService && {
      categoryId: item?.categoryId,
      price: item?.price,
    }),
  };
};

export const createProductItemAddBasket = (item, quality = 1) => {
  return {
    type: "Product",
    id: `${item?.productId}_pro`,
    data: {
      name: item?.name || "",
      productId: item?.productId || 0,
      price: item?.price || 0,
    },
    quanlitySet: quality,
  };
};

export const createExtraItemAddBasket = (extra, serviceName) => {
  return {
    type: "Extra",
    id: `${extra?.extraId}_extra`,
    data: {
      name: extra?.name,
      extraId: extra?.extraId,
      price: extra?.price,
    },
    serviceName: serviceName,
  };
};
