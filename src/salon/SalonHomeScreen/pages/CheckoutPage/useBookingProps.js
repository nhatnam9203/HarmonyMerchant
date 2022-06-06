import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { useProps } from "./useProps";

// Appointment Tab booking appointment
export const useBookingProps = (args) => {
  const dispatch = useDispatch();

  const { bookingStaffId = 0 } = args?.params || {};
  const props = useProps(args);

  const { groupAppointment } = props || {};

  /**
   * Event book appointment
   * bookingStaffId: check In (no staff = 0), booking (staffId)
   * ...
   */
  useFocusEffect(
    React.useCallback(() => {
      if (bookingStaffId > 0) {
        // && _.isEmpty(groupAppointment)
        props.getCategoriesByStaff(bookingStaffId, () => {}); // call api get categories list with staff selected
        props.setSelectStaffFromCalendar(bookingStaffId, false); // highlight staff selected in categories column
        props.setBlockStateFromCalendar(false); // allow select other staff
      } else {
        props.getCategoriesByStaff(0, () => {}); // call api get categories list
        props.setBlockStateFromCalendar(true); // not select other staff
      }
    }, [bookingStaffId])
  );

  return {
    ...props,
  };
};
