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
    staffListCurrentDate,
  } = useSelector((state) => state.appointment);

  const categoriesByMerchant = useSelector(
    (state) => state.category.categoriesByMerchant
  );

  const [isShowColAmount, setIsShowColAmount] = React.useState(false);
  const [isBlockBookingFromCalendar, setIsBlockBookingFromCalendar] =
    React.useState(false);
  const [isShowPayment, setIsShowPayment] = React.useState(false);
  const [basket, setBasket] = React.useState([]);
  const [paymentSelected, setPaymentSelected] = React.useState("");
  const [changeButtonDone, setChangeButtonDone] = React.useState(false);
  const [isCancelHarmonyPay, setIsCancelHarmonyPay] = React.useState(false);
  const [isShowCategoriesColumn, setIsShowCategoriesColumn] =
    React.useState(false);
  const [isShowColProduct, setIsShowColProduct] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState(null);

  const [categorySelected, setCategorySelected] = React.useState({
    categoryId: -1,
    categoryType: "",
  });
  const [categoryStaff, setCategoryStaff] = React.useState(null);

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
    staffListCurrentDate,
    categoriesByMerchant,

    isShowCategoriesColumn,
    isShowColProduct,
    selectedStaff,
    isShowColAmount,
    isBlockBookingFromCalendar,

    categoryStaff,
    isLoadingCategory: false,
    categorySelected,

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
    onPressSelectCategory: () => {},
    onSelectGiftCard: () => {},
    displayCategoriesColumn: (item) => {},
  };
};
