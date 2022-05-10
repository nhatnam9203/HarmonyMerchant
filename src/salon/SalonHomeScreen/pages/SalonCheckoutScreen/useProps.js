import React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as CheckoutState from "./SalonCheckoutState";
import { useCallApis } from "./useCallApis";
import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";

export const useProps = ({ props }) => {
  const categoriesRef = React.useRef(null);

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

  const profileStaffLogin = useSelector(
    (state) => state.dataLocal?.profileStaffLogin
  );
  const isOfflineMode = useSelector((state) => state.network?.isOfflineMode);

  const [stateLocal, dispatchLocal] = React.useReducer(
    CheckoutState.reducer,
    CheckoutState.initState
  );
  // console.log(stateLocal);

  const { apiLoading, getCategoriesByStaff } = useCallApis({
    dispatchLocal,
  });

  const setSelectStaffFromCalendar = (staffId, isFirstPressCheckout = null) => {
    if (!staffId) return;
    dispatchLocal(CheckoutState.setSelectStaffFromCalendar(staffId));
    console.log(categoriesRef);
    categoriesRef.current?.scrollFlatListToStaffIndex(
      staffId,
      isFirstPressCheckout
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (profileStaffLogin?.staffId && _.isEmpty(groupAppointment)) {
        if (!isOfflineMode)
          getCategoriesByStaff(profileStaffLogin?.staffId, () => {});
        setSelectStaffFromCalendar(profileStaffLogin?.staffId, true);
      }
    }, [profileStaffLogin?.staffId])
  );

  return {
    categoriesRef,

    ...stateLocal,
    staffListCurrentDate,
    customerInfoBuyAppointment,
    groupAppointment,
    paymentDetailInfo,
    blockAppointments,
    isBookingFromCalendar,
    isDonePayment,
    categoriesByMerchant,
    isOfflineMode,

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
    displayCategoriesColumn: (staff) => {},
  };
};
