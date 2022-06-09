import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { useProps } from "./useProps";

export const useCheckoutProps = (args) => {
  const dispatch = useDispatch();
  const { params } = args || {};
  const { checkoutStaffId } = params || {};
  const props = useProps(args);

  const { profileStaffLogin, groupAppointment } = props || {};
  // Effects
  useFocusEffect(
    React.useCallback(() => {
      if (_.isEmpty(groupAppointment)) {
        props.getCategoriesByStaff(
          checkoutStaffId > 0 ? checkoutStaffId : profileStaffLogin?.staffId,
          () => {}
        );
      }
      props.setSelectStaffFromCalendar(
        checkoutStaffId > 0 ? checkoutStaffId : profileStaffLogin?.staffId,
        true
      );

      props.setBlockStateFromCalendar(false); // allow select other staff
    }, [profileStaffLogin?.staffId, checkoutStaffId])
  );

  return {
    isBookingFromCalendar: false,
    ...props,
  };
};
