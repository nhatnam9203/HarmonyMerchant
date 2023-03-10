import NavigationServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import { basketRetailer } from "@redux/slices";
import { ORDERED_STATUS } from "@shared/components/OrderStatusView";
import {
  useCancelAppointment,
  useCompleteAppointment,
  useConfirmAppointment,
  useEditNotes,
  useGetAppointment,
  useShippingAppointment,
} from "@shared/services/api/retailer";
import {
  PURCHASE_POINTS_STORE,
  SHIPPING_METHOD_GROUP,
  statusSuccess,
} from "@shared/utils";
import {
  APP_NAME,
  getTaxRateFromAppointment,
  POS_SERIAL,
  REMOTE_APP_ID,
  getInfoFromModelNameOfPrinter,
  checkNotSelectedPrinter,
} from "@utils";
import _ from "lodash";
import React from "react";
import { NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const log = (obj, message = "") => {
  Logger.log(`[HomeOrderDetail] ${message}`, obj);
};

const { clover } = NativeModules;

export const useProps = ({
  params: {
    order,
    orderId,
    addressId,
    addressCreate,
    editShippingAddress,
    editBillingAddress,
    screenId,
    backScreenId,
  },
  navigation,
}) => {
  const formAddressRef = React.useRef(null);
  const dispatch = useDispatch();
  const invoicePrintRef = React.useRef(null);
  const invoiceRef = React.useRef(null);
  const returnReceiptRef = React.useRef(null);

  /**
  |--------------------------------------------------
  | REDUX variables
  |--------------------------------------------------
  */
  const profile = useSelector((state) => state.dataLocal.profile);
  const paymentMachineType = useSelector(
    (state) => state.hardware.paymentMachineType
  );
  const cloverMachineInfo = useSelector(
    (state) => state.hardware.cloverMachineInfo
  );
  const printerList = useSelector((state) => state.dataLocal.printerList);
  const printerSelect = useSelector((state) => state.dataLocal.printerSelect);
  /**
  |--------------------------------------------------
  | STATE variables
  |--------------------------------------------------
  */

  const [appointmentDetail, setAppointmentDetail] = React.useState(null);
  const [shippingMethod, setShippingMethod] = React.useState(null);

  const [shippingAddressId, setShippingAddressId] = React.useState(null);
  const [billingAddressId, setBillingAddressId] = React.useState(null);
  const [isDidNotPay, setDidNotPay] = React.useState(false);
  const [visiblePrintInvoice, setVisiblePrintInvoice] = React.useState(false);
  const [shippingFlatRates, setShippingFlatRates] = React.useState(null);

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [appointmentGet, getAppointment] = useGetAppointment();

  const [appointmentCancel, cancelAppointment] = useCancelAppointment();
  const [appointmentConfirm, confirmAppointment] = useConfirmAppointment();
  const [appointmentShipping, shippingAppointment] = useShippingAppointment();
  const [appointmentComplete, completeAppointment] = useCompleteAppointment();
  const [editNoteResponse, editNote] = useEditNotes();

  /**
  |--------------------------------------------------
  | USE EFFECT
  |--------------------------------------------------
  */
  React.useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {});

    const unsubscribeBlur = navigation.addListener("blur", () => {});

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  React.useEffect(() => {
    if (profile) {
      setShippingFlatRates([
        ...(profile.shippingMethod?.shippingFlatRates || []),
      ]);
    } else {
      setShippingFlatRates(null);
    }
  }, [profile]);

  useFocusEffect(
    React.useCallback(() => {
      if (orderId || order?.appointmentId) {
        getAppointment(orderId ?? order.appointmentId);
      }

      if (addressId && addressCreate) {
        if (editBillingAddress) {
          formAddressRef.current?.updateBillingAddress(
            addressId,
            addressCreate
          );

          setBillingAddressId(addressId);

          if (!shippingAddressId) {
            formAddressRef.current?.updateShippingAddress(
              addressId,
              addressCreate
            );

            setShippingAddressId(addressId);
          }
        } else if (editShippingAddress) {
          formAddressRef.current?.updateShippingAddress(
            addressId,
            addressCreate
          );

          setShippingAddressId(addressId);
          if (!billingAddressId) {
            formAddressRef.current?.updateBillingAddress(
              addressId,
              addressCreate
            );

            setBillingAddressId(addressId);
          }
        }
      }
    }, [
      orderId,
      order,
      addressId,
      addressCreate,
      editShippingAddress,
      editBillingAddress,
    ])
  );

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentGet || {};
    if (statusSuccess(codeStatus)) {
      const { status, didNotPay, payment, purchasePoint } = data || {};

      if (payment?.length <= 0) {
        dispatch(basketRetailer.setAppointmentId(data.appointmentId));
        dispatch(basketRetailer.setAppointment(data));

        if (
          (status === ORDERED_STATUS.PENDING ||
            status === ORDERED_STATUS.PROCESS) &&
          purchasePoint === PURCHASE_POINTS_STORE
        ) {
          NavigationServices.navigate("retailer.home.order.pay", {
            orderItem: data,
            screenId: screenId,
            backScreenId: backScreenId,
          });
          return;
        }
      }

      setAppointmentDetail(data);
      formAddressRef.current?.reload();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentGet]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentCancel || {};
    if (statusSuccess(codeStatus)) {
      NavigationServices.navigate("retailer.home.order.list", { reload: true });
    }
  }, [appointmentCancel]);

  React.useEffect(() => {
    const { codeStatus, message, data } =
      appointmentShipping || appointmentComplete || editNoteResponse || {};
    if (statusSuccess(codeStatus)) {
      getAppointment(appointmentDetail?.appointmentId);
    }
  }, [appointmentShipping, appointmentComplete, editNoteResponse]);

  React.useEffect(() => {
    const { codeStatus, message, data } = appointmentConfirm || {};
    if (statusSuccess(codeStatus)) {
      if (isDidNotPay) {
        dispatch(basketRetailer.clearBasket());
        NavigationServices.navigate("retailer.home.order.list", {
          reload: true,
        });
      } else {
        NavigationServices.navigate("retailer.home.order.pay", {
          orderItem: appointmentDetail,
          screenId: screenId ?? "retailer.home.order.list",
          backScreenId: backScreenId ?? "retailer.home.order.check_out",
        });
      }
    }
  }, [appointmentConfirm]);

  const getPaymentString = (type) => {
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

  const getBasketOnline = (appointments) => {
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
      appointment?.services?.forEach((service) => {
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
      appointment?.products?.forEach((product) => {
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
      appointment?.extras?.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment?.giftCards?.forEach((gift) => {
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

  const showInvoicePrint = async (printMachine, isTemptPrint = true) => {
    // -------- Pass data to Invoice --------

    const appointments = [appointmentDetail];
    const {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    } = getBasketOnline(appointments);

    const baskets = arryaServicesBuy.concat(
      arrayExtrasBuy,
      arrayProductBuy,
      arrayGiftCards
    );
    const tipAmount = appointmentDetail?.tipAmount || 0;
    const subTotal = appointmentDetail?.subTotal || 0;
    const discount = appointmentDetail?.discount || 0;
    const tax = appointmentDetail?.tax || 0;
    const total = appointmentDetail?.total || 0;
    const invoiceNo = `${appointmentDetail?.invoice?.checkoutId}` || "";

    const temptSubTotal = subTotal;

    const temptTotal = total;
    const temptDiscount = discount;
    const temptTip = tipAmount;
    const temptTax = tax;

    let payment = "";
    const payments = appointmentDetail.payment;
    if (payments?.length > 0) {
      const firstPayment = payments[0];
      payment = firstPayment.paymentMethod;
    }

    invoicePrintRef.current?.setStateFromParent(
      baskets,
      temptSubTotal,
      temptTax,
      temptDiscount,
      temptTip,
      temptTotal,
      payment,
      isTemptPrint,
      printMachine,
      promotionNotes.join(","),
      "SALE",
      invoiceNo
    );

    await setVisiblePrintInvoice(true);
  };

  return {
    item: appointmentDetail,
    goBack: () => {
      if (backScreenId) {
        NavigationServices.navigate(backScreenId, {
          reload: true,
          reset: false,
          reloadAppointmentId: appointmentDetail?.appointmentId,
        });
      } else {
        dispatch(basketRetailer.clearBasket());
        NavigationServices.navigate("retailer.home.order.list", {
          reload: true,
        });
      }
    },
    cancel: () => {
      cancelAppointment(appointmentDetail?.appointmentId);
    },
    shipping: () => {
      shippingAppointment(appointmentDetail?.appointmentId);
    },
    confirm: () => {
      const params = Object.assign({}, shippingMethod, {
        // shippingAmount: 0,
        billingAddressId:
          billingAddressId ?? appointmentDetail?.billingAddress?.id,
        shippingAddressId:
          shippingAddressId ?? appointmentDetail?.shippingAddress?.id,
        didNotPay: isDidNotPay,
      });
      confirmAppointment(params, appointmentDetail?.appointmentId);
    },
    complete: () => {
      if (!appointmentDetail) return;
      const { appointmentId, purchasePoint, status } = appointmentDetail || {};
      if (purchasePoint === "CallOrder" && status === "Did Not Pay") {
        // XU => sai text tr??? v??? l?? sai
        NavigationServices.navigate("retailer.home.order.pay", {
          orderItem: appointmentDetail,
          screenId: screenId ?? "retailer.home.order.list",
          backScreenId: backScreenId ?? "retailer.home.order.check_out",
        });
      } else {
        completeAppointment(appointmentId);
      }
    },
    refund: () => {
      NavigationServices.navigate("retailer.home.order.return", {
        item: appointmentDetail,
      });
    },
    onChangeShippingMethod: (shipping) => {
      setShippingMethod(shipping);
    },
    onSubmitNotes: (noteText) => {
      editNote({ notes: noteText }, appointmentDetail?.appointmentId);
    },
    getPaymentString,
    onEditShippingAddress: (selectAddressId) => {
      setShippingAddressId(selectAddressId);
    },
    onEditBillingAddress: (selectAddressId) => {
      setBillingAddressId(selectAddressId);
    },
    formAddressRef,
    onDidNotPayCheck: (checked) => {
      setDidNotPay(checked);
    },
    printCustomerInvoice: async () => {
      const { portName } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );

      if (checkNotSelectedPrinter()) {
        alert("Please connect to your printer!");
        return;
      }

      // if (
      //   paymentSelected === "Cash" ||
      //   (paymentSelected === "Other" && profile?.isOpenCashier)
      // ) {
      //   if (paymentMachineType === PaymentTerminalType.Clover && !portName) {
      //     openCashDrawerClover();
      //   } else {
      //     openCashDrawer(portName);
      //   }
      // }

      invoiceRef.current?.show({
        isPrintTempt: true,
        isAppointmentTab: false,
      });
    },
    invoicePrintRef,
    visiblePrintInvoice,
    cancelInvoicePrint: async (isPrintTempt) => {
      setVisiblePrintInvoice(false);
    },
    invoiceRef,
    shareCustomerInvoice: async () => {
      invoiceRef.current?.share({
        isPrintTempt: true,
        isAppointmentTab: false,
      });
    },
    getShippingMethodLabel: React.useCallback(() => {
      if (appointmentDetail?.shipping?.shippingMethod) {
        switch (appointmentDetail?.shipping?.shippingMethod) {
          case SHIPPING_METHOD_GROUP.STORE_PICKUP:
            return "Store Pickup";
          case SHIPPING_METHOD_GROUP.FLAT_RATE:
            const flatRate = [...shippingFlatRates]
              ?.filter((x) => !x.isDeleted)
              ?.find(
                (x) => x.id === appointmentDetail?.shipping?.flatRateCustom
              );

            if (flatRate) {
              return `${flatRate?.label} - ${flatRate?.amount}$`;
            }

            return "Flat Rate";

          case SHIPPING_METHOD_GROUP.FREE:
            return "Free Shipping";

          default:
            return "Unknown";
        }
      }
    }, [appointmentDetail]),
    returnReceiptRef,
    printReturnInvoice: (itemReturn) => {
      // returnReceiptRef.current?.showReceipt({
      //   item: itemReturn,
      //   appointment: appointmentDetail,
      //   isShareMode: false,
      //   machineType: paymentMachineType,
      // });

      invoiceRef.current?.showWithReturnItem(itemReturn);
    },
    shareReturnInvoice: (itemReturn) => {
      // returnReceiptRef.current?.showReceipt({
      //   isShareMode: true,
      //   item: itemReturn,
      //   appointment: appointmentDetail,
      // });

      invoiceRef.current?.shareWithReturnItem(itemReturn);
    },
    doPrintClover: (imageUri) => {
      const port = _.get(cloverMachineInfo, "port")
        ? _.get(cloverMachineInfo, "port")
        : 80;
      const url = `wss://${_.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

      const printInfo = {
        imageUri,
        url,
        remoteAppId: REMOTE_APP_ID,
        appName: APP_NAME,
        posSerial: POS_SERIAL,
        token: _.get(cloverMachineInfo, "token")
          ? _.get(cloverMachineInfo, "token", "")
          : "",
      };
      clover.doPrintWithConnect(printInfo);
    },
    getTaxRate: () => {
      return getTaxRateFromAppointment(appointmentDetail);
    },

    getTotalQty: () => {
      const items =
        [
          ...(appointmentDetail?.products?.map((x) =>
            Object.assign({}, x, { key: x.bookingProductId })
          ) || []),
          ...(appointmentDetail?.giftCards?.map((x) =>
            Object.assign({}, x, { key: x.bookingGiftCardId })
          ) || []),
        ] || [];

      const totalQty = items?.reduce((prev, item, index) => {
        const qty = item.quantity ?? 1;
        return prev + qty;
      }, 0);

      return totalQty ?? 0;
    },
  };
};
