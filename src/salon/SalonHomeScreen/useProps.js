import actions from "@actions";
import { useIsFocused } from "@react-navigation/native";
import { ScreenName } from "@src/ScreenName";
import { getPosotion } from "@utils";
import _ from "lodash";
import { AppState, BackHandler, NativeModules } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import * as controllers from "./controllers";

const PosLink = NativeModules.payment;

export const useProps = ({ navigation }) => {
  const dispatch = useDispatch();
  const [homePageState, homePageDispatch] = React.useReducer(
    controllers.SalonHomePageReducer,
    controllers.InitState
  );

  const {
    profileStaffLogin,
    profile,
    listAppointmentsOfflineMode,
    isLoginStaff,
  } = useSelector((state) => state.dataLocal) || {};
  const {
    groupAppointment,
    appointmentIdOffline,
    appointmentDetail,
    isCheckAppointmentBeforeOffline,
    blockAppointments,
  } = useSelector((state) => state.appointment);

  const isFocused = useIsFocused();
  const notiIntervalId = useSelector((state) => state.app.notiIntervalId);

  const [appState, setAppState] = React.useState(AppState.currentState);

  const _getCurrentLocation = async () => {
    if (!profile.longitude || !profile.latitude) {
      try {
        const position = await getPosotion();
        const { latitude, longitude } = position.coords;
        dispatch(
          actions.app.merchantSetting({
            businessHourStart: profile.businessHourStart,
            businessHourEnd: profile.businessHourEnd,
            webLink: profile.webLink,
            latitude: latitude,
            longitude: longitude,
            taxService: profile.taxService,
            taxProduct: profile.taxProduct,
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const _goToAppointmentTab = () => {};

  const _goToCheckOutTab = () => {};

  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // this.checkUpdateCodePush();
    } else {
      if (!_.isEmpty(groupAppointment)) {
        PosLink.cancelTransaction();
      }
    }
  };

  const _backAction = () => {};

  React.useEffect(() => {
    // this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
    BackHandler.addEventListener("hardwareBackPress", _backAction);
    BackHandler.addEventListener("change", _handleAppStateChange);
  }, []);

  React.useEffect(() => {
    if (isLoginStaff) {
      // if tab appointments -> update calendar
      // if (this.tabAppointmentRef?.current) {
      //   setTimeout(() => {
      //     this.tabAppointmentRef?.current?.updateLinkOfCalendar();
      //   }, 500);
      // }
      _getCurrentLocation();
      Promise.all([
        dispatch(actions.category.getCategoriesByMerchantId()),
        dispatch(actions.extra.getExtraByMerchant()),
        dispatch(actions.service.getServicesByMerchant()),
        dispatch(actions.product.getProductsByMerchant()),
        dispatch(actions.staff.getStaffByMerchantId()),
        dispatch(
          actions.appointment.getStaffListByCurrentDate(profile?.merchantId)
        ),
        dispatch(actions.app.getNotificationList()),
        dispatch(actions.app.getCountUnReadOfNotification()),
        dispatch(
          actions.service.getCustomServiceByMerchantId(profile?.merchantId)
        ),
      ])
        .then((data) => {
          dispatch(actions.staff.reloadButtonEnterPincode());
          if (data.length >= 5) {
            dispatch(actions.app.changeFlagVisibleEnteerPinCode(false));
          }
        })
        .catch((error) => {
          dispatch(actions.staff.reloadButtonEnterPincode());
        });

      dispatch(actions.dataLocal.resetStateLoginStaff());
    }
  }, [isLoginStaff]);

  React.useEffect(() => {
    if (
      profile &&
      listAppointmentsOfflineMode &&
      listAppointmentsOfflineMode.length > 0
    ) {
      // if offline mode -> sync appoint to calendar
      //   this.props.actions.appointment.submitAppointmentOffline(
      //     listAppointmentsOfflineMode
      //   );
    }
  }, [profile, listAppointmentsOfflineMode]);

  return {
    navigation,
    activeScreen: true,
    ...homePageState,
    homePageDispatch: homePageDispatch,
    handleLockScreen: () => {
      if (isFocused) {
        NavigationServices.navigate(ScreenName.SALON.APPOINTMENT);
        popupPinCodeRef.current?.show(); // ! ???
      }
    },
    clearIntervalById: () => {
      if (notiIntervalId) {
        clearInterval(notiIntervalId);
        dispatch(actions.app.resetNotiIntervalId());
      }
    },
  };
};
