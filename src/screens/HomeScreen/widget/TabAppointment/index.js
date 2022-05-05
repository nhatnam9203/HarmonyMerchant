import Configs from "@configs";
import connectRedux from "@redux/ConnectRedux";
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
  handleResponseDejavoo
} from "@utils";
import { isEmpty } from "lodash";
import React from "react";
import { AppState, NativeModules } from "react-native";
import Layout from "./layout";
import _ from "lodash";
import NavigationServices from "@navigators/NavigatorServices";
import { parseString } from "react-native-xml2js";

const { clover } = NativeModules;

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
      visiblePrintInvoice: false,
      appointment: null,
      loadMessage: null,
      isEditTipCreditCard: false,
    };
    this.webviewRef = React.createRef();
    this.amountRef = React.createRef();
    this.changeStylistRef = React.createRef();
    this.changePriceAmountProductRef = React.createRef();
    this.popupCheckDiscountPermissionRef = React.createRef();
    this.invoicePrintRef = React.createRef();
    this.invoiceRef = React.createRef();
    this.tipSum = 0.0
    this.editTipParams = {}
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
          // console.log(data);
          switch (action) {
            case "checkout":
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
              break;

            case "signinAppointment":
              if (data?.staffId === 0) {
                this.props.createABlockAppointment(appointmentId, new Date());
              } else {
                // this.props.bookAppointment(appointmentId, data?.staffId || 0);
                this.props.createABlockAppointment(
                  appointmentId,
                  new Date(),
                  data?.staffId || 0
                );

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
              break;

            case "addGroupAnyStaff":
              this.props.createABlockAppointment(
                appointmentId,
                data.dataAnyStaff && data.dataAnyStaff.fromTime
                  ? data.dataAnyStaff.fromTime
                  : new Date()
              );
              break;

            case "push_notification":
            case "update_notification":
              // ---------- Handle Push Notification from weview --------------
              if (this.props?.profileStaffLogin?.token) {
                this.props.actions.app.getCountUnReadOfNotification();
              }
              break;

            case "addMore":
              // this.props.addMoreAppointmentFromCalendar(
              //   data?.appointmentId,
              //   data?.staffId || 0
              // );

              this.props.createABlockAppointment(
                appointmentId,
                new Date(),
                data?.staffId || 0
              );

              if (!isOfflineMode && isEmpty(groupAppointment)) {
                this.props.getCategoryStaff(
                  data?.appointment?.staffId || data?.staffId
                );
              }
              break;
            case "addMoreAnyStaff":
              this.props.addMoreAppointmentFromCalendar(
                data?.appointmentId,
                data?.staffId || 0
              );
              break;
            case "printFromCalendar":
              const appointment = data?.appointment;
              // const isTemp = appointment?.status !== "paid";
              //
              // this.invoiceRef.current?.showAppointmentReceipt({
              //   appointmentId: appointment?.id,
              //   checkoutId: appointment?.checkoutId,
              //   isPrintTempt: true,
              //   isSalon: true,
              //   machineType: this.props.paymentMachineType,
              //   isAppointmentTab: true,
              // });
              // TODO: print with checkoutId

              // console.log(appointment);

              this.setState({ appointment });

              break;

            case "jumpToCustomerHistory":
              if (data?.appointment?.checkoutId > 0) {
                NavigationServices.navigate("Invoice", {
                  appointmentFromWeb: data?.appointment,
                  request: "history",
                });
              }

              break;
            case "goToInvoice":
              if (data?.appointment?.checkoutId > 0) {
                NavigationServices.navigate("Invoice", {
                  appointmentFromWeb: data?.appointment,
                  request: "detail",
                });
              }
              break;
            case "updateAppointmentPaid":
              console.log('updateAppointmentPaid', data)
              if (data?.appointment?.checkoutId > 0) {
                this.setState({...this.state, isEditTipCreditCard: true})
                this.props.actions.invoice.getInvoiceDetail(data?.appointment?.checkoutId);

                const services = data?.body?.services
                let tipSum = 0;
                if (services) {
                  tipSum = _.sumBy(services, item =>{
                    return parseFloat(item.tipAmount)
                  });
                  this.tipSum = tipSum;
                  this.editTipParams = data?.body
                }
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
  };

  handleEditTipCreditCard(checkoutId, params) {
    this.props.actions.invoice.getInvoiceDetail(checkoutId);
  }

  doPrintClover(imageUri) {
    const { cloverMachineInfo } = this.props;
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
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const { isReloadWebview, invoiceDetail } = this.props;
    const { appointment } = this.state;

    if (isReloadWebview && isReloadWebview != prevProps.isReloadWebview) {
      this.reloadWebviewFromParent();
      this.props.actions.app.resetStateReloadWebView();
    }

    if (appointment && appointment != prevState?.appointment) {
      this.invoiceRef.current?.show({
        isPrintTempt: true,
        isAppointmentTab: true,
      });
      // setTimeout(() => {
      //   this.setState({ appointment: null });
      // }, 1000);
    }

    if (invoiceDetail && invoiceDetail != prevProps.invoiceDetail 
      && this.state.isEditTipCreditCard) {
      this.handleEditTipCreditPayment(invoiceDetail);
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  async handleEditTipCreditPayment(invoiceDetail) {
    this.setState({...this.state, isEditTipCreditCard: false})
    if(_.get(invoiceDetail, 'paymentInformation', []).length > 0) {
      const paymentInformation = _.get(invoiceDetail, 'paymentInformation.0');
      const paymentData = paymentInformation?.paymentData;
      parseString(paymentInformation?.responseData, (err, result) => {
        if (err) {
          setTimeout(() => {
            alert(err)
          }, 300)
        } else {
          const refId = _.get(result, "xmp.response.0.RefId.0");
          const invNum = _.get(result, "xmp.response.0.InvNum.0");
          const last4 = _.get(paymentData, 'card_number');
          const extraData = _.get(result, "xmp.response.0.ExtData.0").split(",");
          let amount = 0
          if (extraData) {
            const findIndex = _.findIndex(extraData, item => {
              return item.includes("Amount")
            })
            amount = findIndex > -1 ? extraData[findIndex].replace("Amount=", "") : 0;
          }
          if(this.tipSum.toFixed(2) != invoiceDetail?.tipAmount) {
            const params = {
              amount,
              refId,
              invNum,
              tip: this.tipSum.toFixed(2),
              last4,
            }
            requestEditTipDejavoo(params).then(async (responses) => {
               handleResponseDejavoo(responses).then(result => {
                  this.props.actions.invoice.editPaidAppointment({...this.editTipParams, responses}, invoiceDetail?.appointmentId);
               },
               error => {
                setTimeout(() => {
                  alert(error || "Error")
                }, 300)
               })
            });
          } else {
            this.props.actions.invoice.editPaidAppointment({...this.editTipParams, responses: null}, invoiceDetail?.appointmentId);
          }
        }
      });
      
    }
  }

  reloadWebview = () => {
    this.reloadWebviewFromParent();
    this.props.actions.app.resetStateReloadWebView();
  };
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
  groupAppointment: state.appointment.groupAppointment,
  isOfflineMode: state.network.isOfflineMode,
  paymentMachineType: state.hardware.paymentMachineType,
  cloverMachineInfo: state.hardware.cloverMachineInfo,
  invoiceDetail: state.invoice.invoiceDetail,
});

export default connectRedux(mapStateToProps, TabAppointment);
