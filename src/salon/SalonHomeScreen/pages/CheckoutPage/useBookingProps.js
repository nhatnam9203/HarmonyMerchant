import { useFocusEffect } from "@react-navigation/native";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { useProps } from "./useProps";
import actions from "@actions";

// Appointment Tab booking appointment
export const useBookingProps = (args) => {
  const dispatch = useDispatch();

  const {
    bookingStaffId = 0,
    bookingAppointmentId,
    bookingFromTime,
  } = args?.params || {};
  const props = useProps(args);

  const { groupAppointment } = props || {};

  /**
   * Event book appointment
   * bookingStaffId: check In (no staff = 0), booking (staffId)
   * ...
   */
  useFocusEffect(
    React.useCallback(() => {
      props.getCategoriesByStaff(bookingStaffId, () => {}); // call api get categories list with staff selected
      if (bookingStaffId > 0) {
        // && _.isEmpty(groupAppointment)
        props.setBlockStateFromCalendar(false); // allow select other staff
        dispatch(
          actions.appointment.getGroupAppointmentById(
            bookingAppointmentId,
            false,
            true,
            false
          )
        );
        props.setSelectStaffFromCalendar(bookingStaffId, false); // highlight staff selected in categories column
      } else {
        props.setBlockStateFromCalendar(true); // not select other staff
      }

      return () => {};
    }, [bookingStaffId])
  );

  return {
    isBookingFromCalendar: true,
    ...props,
  };
};
