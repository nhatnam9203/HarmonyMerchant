import {
  getInfoFromModelNameOfPrinter,
  getReceiptItems,
  getReceiptSymbol,
  getTaxRateFromGroupAppointment,
} from "@utils";
import { useSelector } from "react-redux";

export const useProps = ({
  appointment,
  invoice,
  groupAppointment,
  printTemp,
  fromAppointmentTab,
  isSignature,
}) => {
  const { profile, profileStaffLogin, printerList, printerSelect } =
    useSelector((state) => state.dataLocal) ?? {};

  const { portName, emulation, widthPaper } = getInfoFromModelNameOfPrinter(
    printerList,
    printerSelect
  );

  const { paymentMachineType } = useSelector((state) => state.hardware) ?? {};

  const getItems = () => {
    if (appointment) {
      return getReceiptItems(appointment);
    }

    if (groupAppointment) {
      let temps = [];
      groupAppointment.appointments?.forEach((app) => {
        temps.push(...getReceiptItems(app));
      });
      return temps;
    }

    if (invoice) {
      return getReceiptItems(invoice.basket);
    }
  };

  const getCustomer = () => {
    if (appointment) return appointment.customer;
    return null;
  };

  const getSymbol = () => {
    if (fromAppointmentTab) return "TICKET";

    let status;
    if (invoice) {
      status = invoice.status;
    }
    if (appointment) {
      status = appointment.status;
    }
    if (groupAppointment) {
      status = groupAppointment?.status;
    }

    if (!status) return "TICKET";

    return getReceiptSymbol(status);
  };

  const getInvoiceDate = () => {
    if (invoice) return invoice.createdDate;
    if (appointment) return appointment.invoice?.createdDate;
  };

  const getInvoiceNO = () => {
    if (invoice) return invoice.checkoutId;
    if (appointment) return appointment.invoice?.checkoutId;
    return null;
  };

  const getTypeOfReceipt = () => {
    let status;

    if (invoice) {
      status = invoice.status;
    }

    if (appointment) {
      status = appointment.status;
    }

    if (groupAppointment) {
      status = groupAppointment?.status;
    }

    if (fromAppointmentTab || printTemp || !isSignature)
      return "Customer's Receipt";
    return "Merchant's Receipt";
  };

  const getInvoiceCode = () => {
    if (invoice) return invoice.code;
    if (appointment) return appointment.invoice?.code;
    return null;
  };

  const getSubTotal = () => {
    if (groupAppointment) return groupAppointment?.subTotal;
    if (appointment) return appointment?.subTotal;
    return 0;
  };
  const getDiscount = () => {
    if (groupAppointment) return groupAppointment?.discount;
    if (appointment) return appointment?.discount;
    return 0;
  };
  const getTipAmount = () => {
    if (groupAppointment) return groupAppointment?.tipAmount;
    if (appointment) return appointment?.tipAmount;
    return 0;
  };

  const getTax = () => {
    if (groupAppointment) {
      return groupAppointment?.tax;
    }
    if (appointment) {
      return appointment?.tax;
    }
    return 0;
  };

  const getTotal = () => {
    if (groupAppointment) return groupAppointment?.total;
    if (appointment) return appointment?.total;
    return 0;
  };

  const getNonCashFee = () => {
    if (groupAppointment) {
      return groupAppointment?.checkoutPaymentFeeSum;
    } else if (invoice) {
      return invoice?.checkoutPaymentFeeSum;
    }
    return 0;
  };

  const getCashDiscount = () => {
    if (groupAppointment) {
      return groupAppointment?.checkoutPaymentCashDiscountSum;
    } else if (invoice) {
      return invoice?.checkoutPaymentCashDiscountSum;
    }
    return 0;
  };

  const getDue = () => {
    if (groupAppointment && groupAppointment?.dueAmount > 0)
      return groupAppointment?.dueAmount;
    if (appointment && appointment?.dueAmount > 0)
      return appointment?.dueAmount;
    return 0;
  };

  const getChange = () => {
    if (groupAppointment && groupAppointment?.dueAmount < 0)
      return Math.abs(groupAppointment?.dueAmount);
    if (appointment && appointment?.dueAmount < 0)
      return Math.abs(appointment?.dueAmount);
    if (invoice) {
      return invoice.refundAmount;
    }
    return 0;
  };

  const getTaxRate = () => {
    return getTaxRateFromGroupAppointment(groupAppointment);
  };

  const getPromotionNotes = (appointments) => {
    let promotionNotes = [];
    appointments?.forEach((appointment) => {
      const note = appointment?.promotionNotes?.note || "";
      if (note) {
        promotionNotes.push(note);
      }
    });

    return promotionNotes.join(",");
  };

  const getCheckoutPaymentMethods = () => {
    if (invoice) {
      return invoice?.checkoutPayments?.slice(0).reverse() || [];
    }

    if (appointment) {
      return appointment.payment;
    }

    return groupAppointment?.paymentMethods?.length > 0
      ? groupAppointment?.paymentMethods
      : groupAppointment?.checkoutPayments;
  };

  return {
    portName,
    emulation,
    widthPaper,
    profile,
    profileStaffLogin,
    items: getItems(),
    customer: getCustomer(),
    machineType: paymentMachineType,
    symbol: getSymbol(),
    invoiceDate: getInvoiceDate(),
    invoiceNO: getInvoiceNO(),
    typeReceipt: getTypeOfReceipt(),
    invoiceCode: getInvoiceCode(),
    subTotal: getSubTotal(),
    discount: getDiscount(),
    tip: getTipAmount(),
    tax: getTax(),
    total: getTotal(),
    fee: getNonCashFee(),
    cashDiscount: getCashDiscount(),
    due: getDue(),
    change: getChange(),
    taxRate: getTaxRate(),
    promotionNotes: getPromotionNotes(),
    checkoutPaymentMethods: getCheckoutPaymentMethods(),
  };
};
