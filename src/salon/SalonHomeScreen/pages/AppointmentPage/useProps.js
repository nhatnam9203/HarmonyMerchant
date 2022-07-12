import React from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "@redux/actions";
import Configs from "@configs";
import NavigationServices from "@navigators/NavigatorServices";
import { AppState, NativeModules } from "react-native";
import {
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  validateIsNumber,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  requestEditTipDejavoo,
  handleResponseDejavoo,
} from "@utils";
import { isEmpty } from "lodash";
import _ from "lodash";
import { parseString } from "react-native-xml2js";
import { ScreenName } from "@src/ScreenName";
import * as controllers from "../../controllers";
import { useFocusEffect } from "@react-navigation/native";

const { clover } = NativeModules;

export const useProps = (props) => {
  const dispatch = useDispatch();
  const homePageCtx = React.useContext(controllers.SalonHomePageContext);

  const webviewRef = React.useRef(null);
  const invoiceRef = React.useRef(null);

  const { cloverMachineInfo, paymentMachineType } =
    useSelector((state) => state.hardware) || {};
  const {
    profile,
    profileStaffLogin,
    deviceId,
    language,
    token,
    isLoginStaff,
  } = useSelector((state) => state.dataLocal) || {};
  const { invoiceDetail } = useSelector((state) => state.invoice) || {};
  const { appointmentDetail, isGetAppointmentSucces, groupAppointment } =
    useSelector((state) => state.appointment) || {};

  const isOfflineMode = useSelector((state) => state.network.isOfflineMode);

  const { isReloadWebview } = useSelector(
    (state) => state.app.isReloadWebview
  ) || { isReloadWebview: false };

  const [loadAppointment, setLoadAppointment] = React.useState(null);
  const [editTipCreditCard, setEditCreditCard] = React.useState(false);
  const [appointmentIdOffline, setAppointmentIdOffline] = React.useState(null);

  const getLinkForCalendar = React.useCallback(() => {
    const staffColumn = profile?.staffColumn || 8;
    const staffToken = profileStaffLogin?.token || "";
    const merchantId = profile?.merchantId || "";
    const staffId = profileStaffLogin?.staffId || 0;
    const tempDeviceId = deviceId ?? "";
    const roleName = profileStaffLogin?.roleName || "Admin";
    const url = `${Configs.CALENDAR_URL}${staffColumn}/index.html?role=${roleName}&token=${staffToken}&merchantid=${merchantId}&staffId=${staffId}&deviceId=${tempDeviceId}`;

    return url;
  }, [profile, profileStaffLogin]);

  const reloadWebviewFromParent = async () => {
    webviewRef.current?.postMessage(
      JSON.stringify({
        action: "reloadWed",
      })
    );

    await dispatch(actions.app.resetStateReloadWebView());
  };

  const _pushNotiDataToWebView = (data) => {
    webviewRef.current?.postMessage(
      JSON.stringify({
        action: "appointmentNotification",
        data: data,
      })
    );
  };

  const handleEditTipCreditPayment = async (invoiceDetail, body) => {
    const { services } = body || {};
    let tipSum = 0;
    if (services) {
      tipSum = _.sumBy(services, (item) => {
        return parseFloat(item.tipAmount);
      });
    }

    setEditCreditCard({
      isEditTipCreditCard: false,
      body: null,
    });

    if (_.get(invoiceDetail, "paymentInformation", []).length > 0) {
      const paymentInformation = _.get(invoiceDetail, "paymentInformation.0");
      const paymentData = paymentInformation?.paymentData;
      parseString(paymentInformation?.responseData, (err, result) => {
        if (err) {
          setTimeout(() => {
            alert(err);
          }, 300);
        } else {
          const refId = _.get(result, "xmp.response.0.RefId.0");
          const invNum = _.get(result, "xmp.response.0.InvNum.0");
          const last4 = _.get(paymentData, "card_number");
          const extraData = _.get(result, "xmp.response.0.ExtData.0").split(
            ","
          );
          let amount = 0;
          if (extraData) {
            const findIndex = _.findIndex(extraData, (item) => {
              return item.includes("Amount");
            });
            amount =
              findIndex > -1 ? extraData[findIndex].replace("Amount=", "") : 0;
          }

          const params = {
            amount,
            refId,
            invNum,
            tip: tipSum.toFixed(2),
            last4,
          };
          requestEditTipDejavoo(params).then(async (responses) => {
            handleResponseDejavoo(responses).then(
              (result) => {
                dispatch(
                  actions.invoice.editPaidAppointment(
                    { ...body, responses },
                    invoiceDetail?.appointmentId
                  )
                );
              },
              (error) => {
                setTimeout(() => {
                  alert(error || "Error");
                }, 300);
              }
            );
          });
        }
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log(homePageCtx.currentTab);
    }, [])
  );

  React.useEffect(() => {
    if (isReloadWebview) {
      reloadWebviewFromParent();
    }
  }, [isReloadWebview]);

  React.useEffect(() => {
    const { isEditTipCreditCard, body } = editTipCreditCard || {};
    if (invoiceDetail && isEditTipCreditCard) {
      handleEditTipCreditPayment(invoiceDetail, body);
    }
  }, [invoiceDetail, editTipCreditCard]);

  React.useEffect(() => {
    if (homePageCtx?.showAppointment) {
      _pushNotiDataToWebView(homePageCtx?.showAppointment);
      homePageCtx.homePageDispatch(
        controllers.hadShowNotifyDataToAppointment()
      );
    }
  }, [homePageCtx?.showAppointment]);

  const _checkOutAppointment = async (appointmentId, appointment = {}) => {
    const staffId = appointment?.staffId;
    const checkoutGroupId = groupAppointment?.checkoutGroupId || 0;

    // go to check out page
    NavigationServices.navigate(ScreenName.SALON.CHECK_OUT, {
      checkoutStaffId: staffId,
    });

    homePageCtx.homePageDispatch(
      controllers.pressTab(ScreenName.SALON.CHECK_OUT)
    );
    dispatch(
      actions.appointment.checkoutAppointment(appointmentId, checkoutGroupId)
    );

    homePageCtx.homePageDispatch(controllers.blockChangeTab());
  };

  const _createBlockAppointment = async (appointmentId, fromTime, staffId) => {
    dispatch(
      actions.appointment.updateFromTimeBlockAppointment(fromTime ?? new Date())
    );

    dispatch(actions.appointment.getBlockAppointmentById(appointmentId, true));

    NavigationServices.navigate(ScreenName.SALON.BOOKING, {
      bookingStaffId: staffId ?? 0,
      bookingFromTime: fromTime ?? new Date(),
      bookingAppointmentId: appointmentId,
    });
    homePageCtx.homePageDispatch(
      controllers.pressTab(ScreenName.SALON.BOOKING)
    );
    homePageCtx.homePageDispatch(controllers.blockChangeTab());
  };

  const _addMoreAppointmentFromCalendar = (appointmentId, staffId = 0) => {
    if (staffId && staffId !== 0 && staffId !== -1) {
      dispatch(
        actions.appointment.getGroupAppointmentById(
          appointmentId,
          false,
          true,
          false
        )
      );

      NavigationServices.navigate(ScreenName.SALON.CHECK_OUT, {
        checkoutStaffId: staffId,
      });

      homePageCtx.homePageDispatch(
        controllers.pressTab(ScreenName.SALON.CHECK_OUT)
      );
    } else {
      dispatch(
        actions.appointment.getBlockAppointmentById(appointmentId, true)
      );

      NavigationServices.navigate(ScreenName.SALON.CHECK_OUT, {
        checkoutStaffId: staffId,
      });

      homePageCtx.homePageDispatch(
        controllers.pressTab(ScreenName.SALON.CHECK_OUT)
      );
    }

    homePageCtx.homePageDispatch(controllers.blockChangeTab());
  };

  return {
    webviewRef,
    invoiceRef,
    appointment: loadAppointment,
    calendarLink: getLinkForCalendar(),
    onMessageFromWebview: (event) => {
      try {
        if (event.nativeEvent && event.nativeEvent.data) {
          const data = JSON.parse(event.nativeEvent.data);

          if (validateIsNumber(data) && data < -150) {
            this.onLoadStartWebview();
          } else {
            const { action, appointmentId, appointment, staffId } = data;
            console.log("onMessageFromWebview => " + action);
            switch (action) {
              case "checkout":
                _checkOutAppointment(appointmentId, appointment || {});
                dispatch(
                  actions.appointment.checkoutAppointmentOffline(appointmentId)
                );
                setAppointmentIdOffline(appointmentId);

                break;
              case "signinAppointment":
                const tempStaffId = staffId ?? appointment?.staffId;

                if (tempStaffId === 0) {
                  _createBlockAppointment(appointmentId, new Date());
                } else {
                  _createBlockAppointment(
                    appointmentId,
                    new Date(),
                    tempStaffId ?? 0
                  );
                }

                break;
              case "addGroupAnyStaff":
                _createBlockAppointment(
                  appointmentId,
                  data.dataAnyStaff && data.dataAnyStaff.fromTime
                    ? data.dataAnyStaff.fromTime
                    : new Date()
                );
                break;

              case "push_notification":
              case "update_notification":
                if (profileStaffLogin?.token) {
                  dispatch(actions.app.getCountUnReadOfNotification());
                }
                break;

              case "addMore":
                _createBlockAppointment(
                  appointmentId,
                  new Date(),
                  data?.staffId || 0
                );
                break;

              case "addMoreAnyStaff":
                _addMoreAppointmentFromCalendar(
                  data?.appointmentId,
                  data?.staffId || 0
                );
                break;

              case "printFromCalendar":
                setLoadAppointment(appointment);
                setTimeout(() => {
                  invoiceRef.current?.show({
                    isPrintTempt: true,
                    isAppointmentTab: true,
                  });
                }, 2000);
                break;

              case "jumpToCustomerHistory":
                if (appointment?.checkOutId > 0) {
                  NavigationServices.navigate("Invoice", {
                    appointmentFromWeb: appointment,
                    request: "history",
                  });
                }
                break;

              case "goToInvoice":
                if (appointment?.checkOutId > 0) {
                  NavigationServices.navigate("Invoice", {
                    appointmentFromWeb: appointment,
                    request: "detail",
                  });
                }
                break;

              case "updateAppointmentPaid":
                if (appointment?.checkOutId > 0) {
                  setEditCreditCard({
                    isEditTipCreditCard: true,
                    body: data?.body,
                  });
                  dispatch(
                    actions.invoice.getInvoiceDetail(appointment?.checkOutId)
                  );
                }
                break;

              default:
                console.log("Not implement action " + action);
                break;
            }
          }
        }
      } catch (error) {
        console.log("Calling from web is error " + error);
      }
    },
    pushNotiDataToWebView: _pushNotiDataToWebView,
    reloadWebview: () => {
      reloadWebviewFromParent();
    },
    doPrintClover: (imageUri) => {
      const port = _.get(cloverMachineInfo, "port")
        ? _.get(cloverMachineInfo, "port")
        : 80;
      const url = `wss://${_.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

      const printInfo = {
        imageUri,
        url,
        remoteAppId: REMOTE_APP_ID,
        appName: APP_NAME,
        posSerial: POS_SERIAL,
        token: _.get(cloverMachineInfo, "token")
          ? _.get(cloverMachineInfo, "token", "")
          : "",
      };
      clover.doPrintWithConnect(printInfo);
    },
    cancelInvoicePrint: () => {},
  };
};
