import Configs from "@configs";
import connectRedux from "@redux/ConnectRedux";
import {
  getArrayExtrasFromAppointment,
  getArrayGiftCardsFromAppointment,
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getInfoFromModelNameOfPrinter,
  validateIsNumber,
} from "@utils";
import { isEmpty } from "lodash";
import React from "react";
import { AppState } from "react-native";
import Layout from "./layout";

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
    };
    this.webviewRef = React.createRef();
    this.amountRef = React.createRef();
    this.changeStylistRef = React.createRef();
    this.changePriceAmountProductRef = React.createRef();
    this.popupCheckDiscountPermissionRef = React.createRef();
    this.invoicePrintRef = React.createRef();
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

  cancelInvoicePrint = async () => {
    await this.setState({ visiblePrintInvoice: false });
  };

  getBasketOnline = (appointments) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];
    const promotionNotes = [];

    appointments.forEach((appointment) => {
      const note = appointment?.promotionNotes?.note || "";
      if (note) {
        promotionNotes.push(note);
      }
      // ------ Push Service -------
      appointment.services?.forEach((service) => {
        arryaServicesBuy.push({
          type: "Service",
          data: {
            name: service?.serviceName || "",
            price: service?.price || "",
          },
          staff: service?.staff || false,
          note: service?.note || "",
        });
      });

      // ------ Push Product -------
      appointment.products?.forEach((product) => {
        arrayProductBuy.push({
          type: "Product",
          data: {
            name: product?.productName || "",
            price: product?.price || "",
          },
          quanlitySet: product?.quantity || "",
        });
      });

      // ------ Push Product -------
      appointment.extras?.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment.giftCards?.forEach((gift) => {
        arrayGiftCards.push({
          type: "GiftCards",
          data: {
            name: gift?.name || "Gift Card",
            price: gift?.price || "",
          },
          quanlitySet: gift?.quantity || "",
        });
      });
    });

    return {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    };
  };

  showInvoicePrint = async (printMachine, isTemptPrint = true, appointment) => {
    const appointments = [appointment];
    const {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    } = this.getBasketOnline(appointments);

    const baskets = arryaServicesBuy.concat(
      arrayExtrasBuy,
      arrayProductBuy,
      arrayGiftCards
    );
    const tipAmount = appointment?.tipAmount || 0;
    const subTotal = appointment?.subTotal || 0;
    const discount = appointment?.discount || 0;
    const tax = appointment?.tax || 0;
    const total = appointment?.total || 0;
    const invoiceNo = appointment?.invoice?.checkoutId ?? "";

    const temptSubTotal = subTotal;

    const temptTotal = total;
    const temptDiscount = discount;
    const temptTip = tipAmount;
    const temptTax = tax;

    let payment = "";
    const payments = appointment.payment;
    if (payments?.length > 0) {
      const firstPayment = payments[0];
      payment = firstPayment.paymentMethod;
    }

    this.invoicePrintRef.current?.setStateFromParent(
      baskets,
      temptSubTotal,
      temptTax,
      temptDiscount,
      temptTip,
      temptTotal,
      payment,
      isTemptPrint,
      printMachine,
      promotionNotes.join(","),
      "SALE",
      invoiceNo
    );

    await this.setState({ visiblePrintInvoice: true });
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
              this.props.createABlockAppointment(appointmentId, new Date());
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
          } else if (action == "printFromCalendar") {
            const appointment = data?.appointment;

            const { printerSelect, printerList } = this.props;
            const { portName } = getInfoFromModelNameOfPrinter(
              printerList,
              printerSelect
            );

            const isTemp = appointment?.status !== "paid";

            console.log(appointment);
            if (portName !== "") {
              this.showInvoicePrint(portName, isTemp, appointment);
            } else {
              alert("Please connect to your printer! ");
            }
          }
        }
      }
    } catch (error) {}
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
  invoiceDetail: state.invoice.invoiceDetail,
  printerSelect: state.dataLocal.printerSelect,
  printerList: state.dataLocal.printerList,
});

export default connectRedux(mapStateToProps, TabAppointment);
