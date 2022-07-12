import NavigatorServices from "@navigators/NavigatorServices";
import { useFocusEffect } from "@react-navigation/native";
import { ScreenName } from "@src/ScreenName";
import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import * as controllers from "../../controllers";
import { useProps } from "./useProps";

export const useCheckoutProps = (args) => {
  const dispatch = useDispatch();
  const { params } = args || {};
  const { checkoutStaffId } = params || {};
  const homePageCtx = React.useContext(controllers.SalonHomePageContext);
  const props = useProps(
    Object.assign({}, args, {
      isBookingFromCalendar: false,
    })
  );

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
    ...props,
    onHandleGoBack: null,
    clearDataConfirm: async () => {
      props.clearDataConfirm();

      const goToTab =
        homePageCtx.nextTab ?? ScreenName.SALON.APPOINTMENT_LAYOUT;

      await homePageCtx.homePageDispatch(controllers.resetCheckOut(goToTab));

      if (goToTab === homePageCtx.currentTab) {
        NavigatorServices.goBack();
      } else NavigatorServices.navigate(goToTab);
    },
  };
};
