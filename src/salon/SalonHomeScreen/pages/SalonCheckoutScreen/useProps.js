import React from "react";
import { useSelector, useDispatch } from "react-redux";

export const useProps = (props) => {
  const {
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
  } = useSelector((state) => state.appointment);

  const [isShowColAmount, setIsShowColAmount] = React.useState(false);
  const [isBlockBookingFromCalendar, setIsBlockBookingFromCalendar] =
    React.useState(false);
  const [isShowPayment, setIsShowPayment] = React.useState(false);
  const [basket, setBasket] = React.useState([]);
  const [paymentSelected, setPaymentSelected] = React.useState("");
  const [changeButtonDone, setChangeButtonDone] = React.useState(false);
  const [isCancelHarmonyPay, setIsCancelHarmonyPay] = React.useState(false);

  return {
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isShowColAmount,
    isBlockBookingFromCalendar,
    isDonePayment,
    tabCurrent: isShowPayment ? 1 : 0,
    basket,
    paymentSelected,
    changeButtonDone,
    isCancelHarmonyPay,

    displayCustomerInfoPopup: () => {},
    displayEnterUserPhonePopup: () => {},
    addAppointmentCheckout: () => {},
    cancelHarmonyPayment: () => {},
    payBasket: () => {},
    confimPayOfflinemode: () => {},
    bookAppointmentFromCalendar: () => {},
    selectPayment: () => {},
    bookBlockAppointment: () => {},
    checkBlockAppointment: () => {},
  };
};
