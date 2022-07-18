import actions from "@actions";
import NavigatorServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenName } from "@src/ScreenName";
import React from "react";
import { useDispatch } from "react-redux";
import * as controllers from "../../controllers";
import * as CheckoutState from "./SalonCheckoutState";
import { useProps } from "./useProps";

// Appointment Tab booking appointment
export const useBookingProps = (args) => {
  const dispatch = useDispatch();

  const {
    bookingStaffId = 0,
    bookingAppointmentId,
    bookingFromTime,
  } = args?.params || {};

  const homePageCtx = React.useContext(controllers.SalonHomePageContext);

  const props = useProps(
    Object.assign({}, args, {
      isBookingFromCalendar: true,
      homePageCtx: homePageCtx,
    })
  );

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
    ...props,
    onHandleGoBack: props.onHandleGoBack,
    clearDataConfirm: async () => {
      props.clearDataConfirm();

      const goToTab =
        homePageCtx.nextTab ?? ScreenName.SALON.APPOINTMENT_LAYOUT;

      await homePageCtx.homePageDispatch(
        controllers.resetCheckOut(ScreenName.SALON.APPOINTMENT)
      );

      if (goToTab === homePageCtx.currentTab) {
        NavigatorServices.goBack();
      } else {
        NavigatorServices.goBack();
        NavigatorServices.navigate(goToTab);
      }
    },
  };
};
