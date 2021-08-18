import React from "react";
import _ from "ramda";
import { AppState } from "react-native";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import {
  validateIsNumber,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
} from "@utils";
import Configs from "@configs";
import { isEmpty } from "lodash";

const initState = {
  appointmentIdOffline: 0,
};

class TabAppointment extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      ...initState,
      appState: AppState.currentState,
      calendarLink: this.getLinkForCalendar(),
    };
    this.webviewRef = React.createRef();
    this.amountRef = React.createRef();
    this.changeStylistRef = React.createRef();
    this.changePriceAmountProductRef = React.createRef();
    this.popupCheckDiscountPermissionRef = React.createRef();
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  getLinkForCalendar() {
    const { profile, profileStaffLogin, deviceId } = this.props;
    const staffColumn = profile?.staffColumn || 8;
    const staffToken = profileStaffLogin?.token || "";
    const merchantId = profile?.merchantId || "";
    const staffId = profileStaffLogin?.staffId || 0;
    const tempDeviceId = deviceId ?? "";
    const roleName = profileStaffLogin?.roleName || "Admin";
    const url = `${Configs.CALENDAR_URL}${staffColumn}/index.html?role=${roleName}&token=${staffToken}&merchantid=${merchantId}&staffId=${staffId}&deviceId=${tempDeviceId}`;

    return url;
  }

  updateLinkOfCalendar = async () => {
    const url = this.getLinkForCalendar();
    if (url !== `${this.state.calendarLink}`) {
      this.setState({
        calendarLink: url,
      });
    }
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (this.webviewRef.current) {
        this.webviewRef.current?.postMessage(
          JSON.stringify({
            action: "resetWeb",
          })
        );
      }
    }
    this.setState({ appState: nextAppState });
  };

  reloadWebviewFromParent = () => {
    this.webviewRef.current?.postMessage(
      JSON.stringify({
        action: "reloadWed",
      })
    );
  };

  connectWebview = () => {
    this.webviewRef.current?.postMessage(
      JSON.stringify({
        action: "PaidOffline",
        idAppointment: this.state.appointmentIdOffline,
      })
    );
  };

  pushNotiDataToWebView = (data) => {
    this.webviewRef.current?.postMessage(
      JSON.stringify({
        action: "appointmentNotification",
        data: data,
      })
    );
  };

  setStateFromParent = async () => {
    await this.setState(initState);
  };

  onLoadEndWebview = () => {
    this.props.actions.app.stopLoadingApp();
  };

  onLoadStartWebview = () => {
    this.webviewRef.current?.reload();
  };

  onMessageFromWebview = async (event) => {
    const { groupAppointment, isOfflineMode } = this.props;
    try {
      if (event.nativeEvent && event.nativeEvent.data) {
        const data = JSON.parse(event.nativeEvent.data);

        if (validateIsNumber(data) && data < -150) {
          this.onLoadStartWebview();
        } else {
          const { action, appointmentId } = data;
          // console.log("onMessageFromWebview: ", JSON.stringify(data));
          if (action === "checkout") {
            if (!isOfflineMode && isEmpty(groupAppointment)) {
              this.props.getCategoryStaff(
                data?.appointment?.staffId || data?.staffId
              );
            }

            const arrayProducts = getArrayProductsFromAppointment(
              data?.appointment?.products || []
            );
            const arryaServices = getArrayServicesFromAppointment(
              data?.appointment?.services || []
            );
            const arrayExtras = getArrayExtrasFromAppointment(
              data?.appointment?.extras || []
            );
            const arrayGiftCards = getArrayGiftCardsFromAppointment(
              data?.appointment?.giftCards || []
            );
            const temptBasket = arrayProducts.concat(
              arryaServices,
              arrayExtras,
              arrayGiftCards
            );
            // if (temptBasket.length > 0) {
            //     this.props.checkoutAppointment(appointmentId, data?.appointment || {});
            //     this.props.actions.appointment.checkoutAppointmentOffline(appointmentId);
            //     this.setState({
            //         appointmentIdOffline: appointmentId
            //     })
            // } else {
            //     this.props.bookAppointment(appointmentId, data?.staffId ? data?.staffId : (data?.appointment?.staffId || 0));
            // }

            this.props.checkoutAppointment(
              appointmentId,
              data?.appointment || {}
            );
            this.props.actions.appointment.checkoutAppointmentOffline(
              appointmentId
            );
            this.setState({
              appointmentIdOffline: appointmentId,
            });
          } else if (action == "signinAppointment") {
            if (data?.staffId === 0) {
              this.props.createABlockAppointment(
                appointmentId,
                new Date()
              );
            } else {
              this.props.bookAppointment(appointmentId, data?.staffId || 0);
              if (
                !isOfflineMode &&
                isEmpty(groupAppointment) &&
                data?.staffId !== 0
              ) {
                this.props.getCategoryStaff(
                  data?.appointment?.staffId || data?.staffId
                );
              }
            }
          } else if (action === "addGroupAnyStaff") {
            this.props.createABlockAppointment(
              appointmentId,
              data.dataAnyStaff && data.dataAnyStaff.fromTime
                ? data.dataAnyStaff.fromTime
                : new Date()
            );
          } else if (
            action === "push_notification" ||
            action === "update_notification"
          ) {
            // ---------- Handle Push Notification from weview --------------
            if (this.props?.profileStaffLogin?.token) {
              this.props.actions.app.getCountUnReadOfNotification();
            }
          } else if (action == "addMore") {
            this.props.addMoreAppointmentFromCalendar(
              data?.appointmentId,
              data?.staffId || 0
            );
            if (!isOfflineMode && isEmpty(groupAppointment)) {
              this.props.getCategoryStaff(
                data?.appointment?.staffId || data?.staffId
              );
            }
          } else if (action == "addMoreAnyStaff") {
            this.props.addMoreAppointmentFromCalendar(
              data?.appointmentId,
              data?.staffId || 0
            );
          }
        }
      }
    } catch (error) { }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { isReloadWebview } = this.props;
    if (isReloadWebview && isReloadWebview != prevProps.isReloadWebview) {
      this.reloadWebviewFromParent();
      this.props.actions.app.resetStateReloadWebView();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
  token: state.dataLocal.token,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  categoriesByMerchant: state.category.categoriesByMerchant,
  productsByMerchantId: state.product.productsByMerchantId,
  servicesByMerchant: state.service.servicesByMerchant,
  appointmentDetail: state.appointment.appointmentDetail,
  isGetAppointmentSucces: state.appointment.isGetAppointmentSucces,
  isLoginStaff: state.dataLocal.isLoginStaff,
  loading: state.app.loading,
  isReloadWebview: state.app.isReloadWebview,
  deviceId: state.dataLocal.deviceId,
  extrasByMerchant: state.extra.extrasByMerchant,
  groupAppointment: state.appointment.groupAppointment,
  isOfflineMode: state.network.isOfflineMode,
});

export default connectRedux(mapStateToProps, TabAppointment);
