import React from "react";
import _ from "ramda";
const signalR = require("@microsoft/signalr");
import { NativeModules, Platform, NativeEventEmitter } from "react-native";
import env from "react-native-config";
import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import {
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  formatNumberFromCurrency,
  getStaffInfoById,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getArrayGiftCardsFromAppointment,
  requestAPI,
  localize,
  REMOTE_APP_ID,
  APP_NAME,
  POS_SERIAL,
  PaymentTerminalType,
  requestTransactionDejavoo,
  requestPreviousTransactionReportDejavoo,
  stringIsEmptyOrWhiteSpaces,
  handleResponseDejavoo,
} from "@utils";
import PrintManager from "@lib/PrintManager";
import Configs from "@configs";
import initState from "./widget/initState";
import * as l from "lodash";
import moment from "moment";
import { parseString } from "react-native-xml2js";

const PosLinkReport = NativeModules.report;
const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;
const { clover } = NativeModules;

class TabCheckout extends Layout {
  constructor(props) {
    super(props);
    this.state = initState;
    this.amountRef = React.createRef();
    this.scrollTabRef = React.createRef();
    this.modalBillRef = React.createRef();
    this.changeStylistRef = React.createRef();
    this.cashBackRef = React.createRef();
    this.popupDiscountRef = React.createRef();
    this.popupSendLinkInstallRef = React.createRef();
    this.popupDiscountLocalRef = React.createRef();
    this.customerNameRef = React.createRef();
    this.CustomerPhoneRef = React.createRef();
    this.activeGiftCardRef = React.createRef();
    this.invoicePrintRef = React.createRef();
    this.changePriceAmountProductRef = React.createRef();
    this.changeTipRef = React.createRef();
    this.blockAppointmentRef = [];
    this.popupCustomerInfoRef = React.createRef();
    this.popupAddItemIntoAppointmentsRef = React.createRef();
    this.popupCheckDiscountPermissionRef = React.createRef();
    this.popupEnterAmountGiftCardRef = React.createRef();

    this.addEditCustomerInfoRef = React.createRef();
    this.staffFlatListRef = React.createRef();
    this.invoiceRef = React.createRef();
    this.popupEnterAmountCustomServiceRef = React.createRef();

    this.isGetResponsePaymentPax = false;

    //ADD LISTENER FROM CLOVER MODULE
    this.eventEmitter = new NativeEventEmitter(clover);
    this.subscriptions = [];
    this.isProcessPaymentClover = false;
    this.isProcessPrintClover = false;
  }

  resetStateFromParent = async () => {
    await this.setState(initState);
  };

  getDataColProduct() {
    const {
      categorySelected,
      categoryTypeSelected,
      isBlockBookingFromCalendar,
      serviceStaff,
      productStaff,
    } = this.state;
    const {
      productsByMerchantId,
      servicesByMerchant,
      extrasByMerchant,
      isOfflineMode,
    } = this.props;
    if (categoryTypeSelected === "Extra") {
      const dataExtra = extrasByMerchant.filter((extra, index) => {
        return extra?.isDisabled === 0;
      });
      return dataExtra;
    } else {
      const data =
        categoryTypeSelected === "Service"
          ? servicesByMerchant
          : productsByMerchantId;
      if (data?.length > 0) {
        let temptData = data.filter((item) => {
          return (
            item?.categoryId === categorySelected?.categoryId &&
            item?.isDisabled === 0
          );
        });

        if (!isOfflineMode && !isBlockBookingFromCalendar) {
          if (categoryTypeSelected === "Service") {
            temptData = [...serviceStaff];
          } else if (categoryTypeSelected === "Product") {
            temptData = [...productStaff];
          }
        }

        return temptData;
      } else {
        return [];
      }
    }
  } // !

  setBasketOfflineModeFromParent = async (appointment) => {
    const { services, products, extras } = appointment;
    const arryaServices = getArrayServicesFromAppointment(services);
    const arrayProducts = getArrayProductsFromAppointment(products);
    const arrayExtras = getArrayExtrasFromAppointment(extras);
    const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
    await this.setState({
      basket: temptBasket,
      staffIdOfline: appointment?.staffId || 0,
      fromTime: appointment?.fromTime || "",
      subTotalLocal: appointment?.subTotal || 0,
      taxLocal: appointment?.tax || 0,
      tipLocal: appointment?.tipAmount || 0,
      discountTotalLocal: appointment?.discount || 0,
      infoUser: {
        firstName: appointment?.firstName || "",
        lastName: appointment?.lastName || "",
        phoneNumber: appointment?.phoneNumber || "",
      },
    });
  };

  addAmount = async () => {
    const {
      groupAppointment,
      isOfflineMode,
      blockAppointments,
      profileStaffLogin,
    } = this.props;

    const {
      categoryTypeSelected,
      productSeleted,
      arrSelectedExtra,
      selectedStaff,
      customServiceSelected,
    } = this.state;

    // ------------ Block Booking -------------
    if (blockAppointments.length > 0) {
      this.addBlockAppointment();
      return;
    }

    // -------------  Group Appointment  ------------
    if (!_.isEmpty(groupAppointment)) {
      const appointments = groupAppointment?.appointments || [];
      const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
      let body = {};
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        body = {
          services: [],
          extras: [],
          products: [
            {
              productId: productSeleted?.productId,
              quantity: this.amountRef.current?.state.quanlity,
            },
          ],
          giftCards: [],
        };
      } else {
        //  -------------Add Extra , Service ---------
        const mainAppointment = appointments.find(
          (appointment) => appointment.appointmentId === mainAppointmentId
        );
        const temptExtra = [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
        }

        body = {
          services: [
            {
              serviceId:
                productSeleted?.serviceId ?? customServiceSelected.serviceId,
              // staffId: mainAppointment?.staff?.staffId || profileStaffLogin.staffId,
              staffId: selectedStaff?.staffId,
              ...(customServiceSelected && {
                categoryId: customServiceSelected?.categoryId,
                price: customServiceSelected?.price,
              }),
            },
          ],
          extras: temptExtra,
          products: [],
          giftCards: [],
        };
      }

      if (appointments.length > 1) {
        this.popupAddItemIntoAppointmentsRef.current?.setStateFromParent(
          body,
          mainAppointmentId
        );
      } else {
        this.props.actions.appointment.addItemIntoAppointment(
          body,
          mainAppointmentId,
          true
        );
      }
    }
    // ------------- Create  Group Appointment  ------------
    else {
      // -------------  Add Product  ------------
      if (categoryTypeSelected === "Product") {
        const temptBasket = [];
        temptBasket.unshift({
          type: "Product",
          id: `${productSeleted?.productId}_pro`,
          data: {
            name: productSeleted?.name || "",
            productId: productSeleted?.productId || 0,
            price: productSeleted?.price || 0,
          },
          quanlitySet: this.amountRef?.current?.state.quanlity || 1,
        });
        this.setState(
          {
            basket: temptBasket,
            subTotalLocal: this.getPriceOfline(temptBasket),
            taxLocal: this.calculateTotalTaxLocal(temptBasket),
          },
          () => {
            if (isOfflineMode) {
              // -------------  Handle Offline Mode  ------------
            } else {
              this.createAnymousAppointment();
            }
          }
        );
      } else {
        //  -------------Add Extra , Service ---------
        const temptBasket = [];
        temptBasket.unshift({
          type: "Service",
          id: `${
            productSeleted?.serviceId ?? customServiceSelected?.serviceId
          }_ser`,
          data: {
            name: productSeleted?.name ?? "Custom Service",
            serviceId:
              productSeleted?.serviceId ?? customServiceSelected?.serviceId,
            price: productSeleted?.price ?? customServiceSelected?.price,
          },
          serviceName: productSeleted?.name ?? "Custom Service",
          staff: {
            staffId: profileStaffLogin.staffId,
            imageUrl: profileStaffLogin.imageUrl,
            displayName: profileStaffLogin.displayName,
            tip: 0.0,
          },
          ...(customServiceSelected && {
            categoryId: customServiceSelected?.categoryId,
            price: customServiceSelected?.price,
          }),
        });

        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptBasket.unshift({
            type: "Extra",
            id: `${arrSelectedExtra[i]?.extraId}_extra`,
            data: {
              name: arrSelectedExtra[i]?.name,
              extraId: arrSelectedExtra[i]?.extraId,
              price: arrSelectedExtra[i]?.price,
            },
            serviceName: productSeleted?.name,
          });
        }

        this.setState(
          {
            basket: temptBasket,
            subTotalLocal: this.getPriceOfline(temptBasket),
            taxLocal: this.calculateTotalTaxLocal(temptBasket),
          },
          () => {
            if (isOfflineMode) {
              // -------------  Handle Offline Mode  ------------
            } else {
              this.createAnymousAppointment();
            }
          }
        );
      }
    }

    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: "",
      },
      productSeleted: null,
      categoryTypeSelected: "",
      arrSelectedExtra: [],
      customServiceSelected: null,
    });
  }; // !

  createAnymousAppointment = async () => {
    const { profile, profileStaffLogin, customerInfoBuyAppointment } =
      this.props;
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      selectedStaff,
    } = this.state;

    const dataAnymousAppoitment = this.getBasketOffline();
    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      dataAnymousAppoitment;
    const moneyUserGiveForStaff = parseFloat(
      formatNumberFromCurrency(this.modalBillRef.current?.state.quality)
    );
    const method = this.getPaymentString(paymentSelected);

    this.props.actions.appointment.createAnymousAppointment(
      profile.merchantId,
      customerInfoBuyAppointment?.userId || 0,
      customerInfoBuyAppointment?.customerId || 0,
      // profileStaffLogin.staffId,
      selectedStaff?.staffId,
      arrayProductBuy,
      arryaServicesBuy,
      arrayExtrasBuy,
      method,
      true,
      customDiscountFixedLocal,
      customDiscountPercentLocal,
      customerInfoBuyAppointment?.firstName || "",
      customerInfoBuyAppointment?.lastName || "",
      customerInfoBuyAppointment?.phone || "",
      moneyUserGiveForStaff,
      false,
      false
    );

    await this.setState({
      basket: [],
      customDiscountPercentLocal: 0,
      customDiscountFixedLocal: 0,
    });
  }; // !

  getPriceOfline(basket) {
    let total = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        total =
          total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
      } else {
        total = total + formatNumberFromCurrency(basket[i].data.price);
      }
    }
    return total;
  } // !

  calculateTotalTaxLocal(basket) {
    const { profile } = this.props;
    const taxService = profile.taxService
      ? formatNumberFromCurrency(profile.taxService)
      : 0;
    const taxProduct = profile.taxProduct
      ? formatNumberFromCurrency(profile.taxProduct)
      : 0;
    let taxTotal = 0;
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        taxTotal =
          taxTotal +
          (parseFloat(basket[i].data.price) *
            basket[i].quanlitySet *
            taxProduct) /
            100;
      } else if (basket[i].type === "Service") {
        taxTotal =
          taxTotal +
          (formatNumberFromCurrency(basket[i].data.price) * taxService) / 100;
      }
    }
    return Number(taxTotal).toFixed(2);
  } // !

  removeItemBasket = (item, appointmentId = -1, isGroup = false) => {
    const { blockAppointments } = this.props;
    const { basket } = this.state;
    if (appointmentId !== -1) {
      // ----- Remove With Appointmnet
      let dataRemove = {};
      switch (item.type) {
        case "Product":
          dataRemove = {
            services: [],
            extras: [],
            products: [{ bookingProductId: item.data.bookingProductId }],
          };
          break;
        case "Service":
          dataRemove = {
            services: [{ bookingServiceId: item.data.bookingServiceId }],
            extras: [],
            products: [],
          };
          break;
        case "Extra":
          dataRemove = {
            services: [],
            extras: [{ bookingExtraId: item.data.bookingExtraId }],
            products: [],
          };
          break;
        case "GiftCards":
          dataRemove = {
            services: [],
            extras: [{ bookingExtraId: item.data.bookingExtraId }],
            products: [],
            giftCards: [{ bookingGiftCardId: item.data.bookingGiftCardId }],
          };
          break;
      }
      if (blockAppointments.length > 0) {
        this.removeItemInBlockAppointment(dataRemove);
      } else {
        this.props.actions.appointment.removeItemIntoAppointment(
          dataRemove,
          appointmentId,
          isGroup
        );
      }
    } else {
      // -------- Remove Offline --------
      const temptBasket = basket.filter(
        (itemBasket) => itemBasket.id !== item.id
      );
      this.setState({
        basket: temptBasket,
        subTotalLocal: this.getPriceOfline(temptBasket),
        taxLocal: this.calculateTotalTaxLocal(temptBasket),
      });
    }
  }; // !

  selectedPayment = async (payment) => {
    const { paymentSelected, changeButtonDone } = this.state;
    const { isDonePayment } = this.props;
    if (
      changeButtonDone &&
      !isDonePayment &&
      paymentSelected === "HarmonyPay"
    ) {
    } else {
      this.setState(
        (prevState) => ({
          paymentSelected: payment === prevState.paymentSelected ? "" : payment,
        }),
        () => {
          if (this.state.paymentSelected === "Gift Card") {
            this.activeGiftCardRef.current?.setStateFromParent();
            this.props.actions.appointment.handleVisibleActiveGiftCard();
          }
        }
      );
    }
  };

  showColAmount = (item) => {
    const { categorySelected, productSeleted } = this.state;
    const categoryType = categorySelected?.categoryType;
    let isExist = false;
    if (
      categoryType === "Service" &&
      productSeleted?.serviceId === item?.serviceId
    ) {
      isExist = true;
    } else if (
      categoryType === "Product" &&
      productSeleted?.productId === item?.productId
    ) {
      isExist = true;
    }

    if (!isExist) {
      this.setState({
        productSeleted: item,
        isShowColAmount: true,
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
    } else {
      this.setState({
        productSeleted: null,
        isShowColAmount: false,
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
    }
  }; // !

  onPressSelectExtra = (extra) => {
    const { arrSelectedExtra } = this.state;
    let tempArrSelectedExtra;
    let isExist = false;
    for (let i = 0; i < arrSelectedExtra?.length; i++) {
      if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
        isExist = true;
        break;
      }
    }
    if (isExist) {
      tempArrSelectedExtra = arrSelectedExtra.filter(
        (selectedExtra) => selectedExtra?.extraId !== extra?.extraId
      );
    } else {
      tempArrSelectedExtra = [...arrSelectedExtra];
      tempArrSelectedExtra.push(extra);
    }
    this.setState({
      arrSelectedExtra: tempArrSelectedExtra,
    });
  }; // !

  selectPayment = () => {
    this.scrollTabRef.current?.goToPage(1);
  }; // !

  closeModalDiscount = () => {
    this.setState({
      visibleDiscount: false,
    });
  };

  clearDataCofrim = async () => {
    const {
      connectionSignalR,
      groupAppointment,
      profile,
      isCancelAppointment,
      blockAppointments,
      payAppointmentId,
      customerInfoBuyAppointment,
      appointmentIdBookingFromCalendar,
      isBookingFromCalendar,
      isOpenBlockAppointmentId,
    } = this.props;

    const { isDrawer } = this.state;
    const temptBlockAppointments = blockAppointments
      ? [...blockAppointments]
      : [];

    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }

    if (payAppointmentId) {
      this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
    }
    this.props.gotoPageCurentParent(isDrawer);
    await this.setState({ ...initState, isInitBasket: true });
    this.scrollTabRef.current?.goToPage(0);
    await this.props.actions.appointment.resetBasketEmpty();
    this.props.actions.appointment.resetPayment();
    this.props.actions.appointment.changeFlagSigninAppointment(false);
    this.props.actions.appointment.resetGroupAppointment();

    if (isCancelAppointment) {
      const app =
        groupAppointment?.appointments?.length > 0
          ? groupAppointment.appointments[0]
          : null;
      if (
        app &&
        groupAppointment?.appointments &&
        groupAppointment?.appointments.length === 1
      ) {
        if (
          app.services.length + app.products.length + app.giftCards.length ===
          0
        ) {
          const mainAppointmentId = groupAppointment?.mainAppointmentId
            ? groupAppointment.mainAppointmentId
            : 0;
          const customerId = customerInfoBuyAppointment.customerId
            ? customerInfoBuyAppointment.customerId
            : 0;
          this.props.actions.appointment.cancleAppointment(
            mainAppointmentId,
            profile.merchantId,
            customerId
          );
        }
      }
    }

    if (isBookingFromCalendar) {
      if (blockAppointments?.length > 0) {
        const app = blockAppointments?.length > 0 ? blockAppointments[0] : null;

        if (app && blockAppointments && blockAppointments?.length === 1) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const customerId = customerInfoBuyAppointment.customerId
              ? customerInfoBuyAppointment.customerId
              : 0;
            this.props.actions.appointment.cancleAppointment(
              isOpenBlockAppointmentId,
              profile.merchantId,
              customerId
            );
          }
        }
      }

      if (
        groupAppointment?.appointments?.length > 0 &&
        appointmentIdBookingFromCalendar
      ) {
        const app =
          groupAppointment?.appointments?.length > 0
            ? groupAppointment.appointments[0]
            : null;

        const mainAppointmentId = groupAppointment?.mainAppointmentId
          ? groupAppointment.mainAppointmentId
          : 0;
        if (
          app &&
          groupAppointment?.appointments &&
          groupAppointment?.appointments.length === 1
        ) {
          if (
            app.services.length + app.products.length + app.giftCards.length ===
            0
          ) {
            const customerId = customerInfoBuyAppointment.customerId
              ? customerInfoBuyAppointment.customerId
              : 0;

            this.props.actions.appointment.cancleAppointment(
              appointmentIdBookingFromCalendar,
              profile.merchantId,
              customerId
            );
          }
        }
      }
    }

    if (!isBookingFromCalendar && appointmentIdBookingFromCalendar == 0) {
      const app =
        groupAppointment?.appointments?.length > 0
          ? groupAppointment.appointments[0]
          : null;
      if (
        app &&
        groupAppointment?.appointments &&
        groupAppointment?.appointments.length === 1
      ) {
        if (
          app.services.length + app.products.length + app.giftCards.length ===
          0
        ) {
          const mainAppointmentId = groupAppointment?.mainAppointmentId
            ? groupAppointment.mainAppointmentId
            : 0;
          const customerId = customerInfoBuyAppointment.customerId
            ? customerInfoBuyAppointment.customerId
            : 0;
          this.props.actions.appointment.cancleAppointment(
            mainAppointmentId,
            profile.merchantId,
            customerId
          );
        }
      }
    }

    if (isOpenBlockAppointmentId) {
      const app = blockAppointments?.length > 0 ? blockAppointments[0] : null;

      if (app && blockAppointments && blockAppointments?.length === 1) {
        if (
          app.services.length + app.products.length + app.giftCards.length ===
          0
        ) {
          const customerId = customerInfoBuyAppointment.customerId
            ? customerInfoBuyAppointment.customerId
            : 0;
          this.props.actions.appointment.cancleAppointment(
            isOpenBlockAppointmentId,
            profile.merchantId,
            customerId
          );
        }
      }
    }

    this.blockAppointmentRef = [];
  }; // !

  setStateFromParent = () => {
    this.setState(initState);
  };

  getPaymentString(type) {
    let method = "";
    switch (type) {
      case "HarmonyPay":
        method = "harmony";
        break;
      case "Cash":
        method = "cash";
        break;
      case "Credit Card":
        method = "credit_card";
        break;
      case "Debit Card":
        method = "credit_card";
        break;
      case "Gift Card":
        method = "giftcard";
        break;
      case "Other":
        method = "other";
        break;
      default:
        method = "";
    }
    return method;
  } // !

  getBasketOffline = () => {
    const { basket, selectedStaff } = this.state;

    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket?.length; i++) {
      if (basket[i].type === "Product") {
        arrayProductBuy.push({
          ...basket[i],
          productId: basket[i].data.productId,
          quantity: basket[i].quanlitySet,
        });
      } else if (basket[i].type === "Service") {
        arryaServicesBuy.push({
          ...basket[i],
          serviceId: basket[i].data.serviceId,
          staffId: selectedStaff?.staffId,
          tipAmount: 0,
        });
      } else if (basket[i].type === "Extra") {
        arrayExtrasBuy.push({
          ...basket[i],
          extraId: basket[i].data.extraId,
        });
      }
    }
    return {
      arrayProductBuy,
      arryaServicesBuy,
      arrayExtrasBuy,
      staffId: selectedStaff?.staffId,
    };
  }; // !

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
      appointment?.services.forEach((service) => {
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
      appointment?.products.forEach((product) => {
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
      appointment?.extras.forEach((extra) => {
        arrayExtrasBuy.push({
          type: "Extra",
          data: {
            name: extra?.extraName || "",
            price: extra?.price || "",
          },
        });
      });

      // ------ Push Gift Card -------
      appointment?.giftCards.forEach((gift) => {
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
  }; // !

  pushAppointmentIdOfflineIntoWebview = () => {
    if (this.props.isOfflineMode) {
      this.props.pushAppointmentIdOfflineIntoWebview();
    }
  };

  donotPrintBill = async () => {
    this.props.pushAppointmentIdOfflineIntoWebview();
    const { connectionSignalR, paymentMachineType, profile } = this.props;
    const { paymentSelected } = this.state;
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
    if (paymentSelected === "Cash" || paymentSelected === "Other") {
      const { printerSelect, printerList } = this.props;
      const { portName } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect
      );

      if (portName) {
        if (
          (paymentSelected === "Other" && profile?.isOpenCashier) ||
          paymentSelected === "Cash"
        ) {
          this.openCashDrawer(portName);
        }
        this.scrollTabRef.current?.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
      } else {
        if (
          (paymentSelected === "Other" && profile?.isOpenCashier) ||
          paymentSelected === "Cash"
        ) {
          if (paymentMachineType == PaymentTerminalType.Clover) {
            this.openCashDrawerClover();
          } else {
            setTimeout(() => {
              alert("Please connect to your cash drawer.");
            }, 700);
          }
        }

        this.scrollTabRef.current?.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
      }
    } else {
      this.scrollTabRef.current?.goToPage(0);
      this.props.actions.appointment.closeModalPaymentCompleted();
      this.props.gotoAppoitmentScreen();
      this.props.actions.appointment.resetBasketEmpty();
      this.setState(initState);
      this.props.actions.appointment.resetPayment();
    }
  }; // !

  cancelInvoicePrint = async (isPrintTempt) => {
    await this.setState({ visiblePrintInvoice: false });
    if (!isPrintTempt) {
      this.scrollTabRef.current?.goToPage(0);
      this.props.gotoAppoitmentScreen();
      this.props.actions.appointment.resetBasketEmpty();
      this.setState(initState);
      this.props.actions.appointment.resetPayment();
    }
  }; // !

  printBill = async () => {
    this.pushAppointmentIdOfflineIntoWebview();

    const {
      printerSelect,
      printerList,
      connectionSignalR,
      paymentMachineType,
      paymentDetailInfo,
      groupAppointment,
      profile,
    } = this.props;

    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    const { paymentSelected } = this.state;
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }

    this.props.actions.appointment.closeModalPaymentCompleted();
  }; // !

  checkStatusCashier = async () => {
    const { printerSelect, printerList, paymentMachineType } = this.props;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );
    if (portName) {
      this.openCashDrawer(portName);
    } else {
      if (paymentMachineType == PaymentTerminalType.Clover) {
        this.openCashDrawerClover();
      } else {
        alert("Please connect to your cash drawer.");
      }
    }
  };

  openCashDrawerClover() {
    const { cloverMachineInfo } = this.props;
    const port = l.get(cloverMachineInfo, "port")
      ? l.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

    clover.openCashDrawer({
      url,
      remoteAppId: REMOTE_APP_ID,
      appName: APP_NAME,
      posSerial: POS_SERIAL,
      token: l.get(cloverMachineInfo, "token")
        ? l.get(cloverMachineInfo, "token", "")
        : "",
    });
  } // !

  openCashDrawer = async () => {
    const { printerSelect, printerList } = this.props;

    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect
    );

    if (portName) {
      await PrintManager.getInstance().openCashDrawer(portName);
    } else {
      setTimeout(() => {
        alert("Please connect to your cash drawer.");
      }, 700);
    }
  };

  handleHarmonyPayment = async (checkoutPaymentInfo) => {
    await this.setState({
      changeButtonDone: false,
      isCancelHarmonyPay: false,
      paymentSelected: "",
    });

    const dueAmount =
      checkoutPaymentInfo && checkoutPaymentInfo.dueAmount
        ? parseFloat(checkoutPaymentInfo.dueAmount).toFixed(2)
        : 0;
    this.props.actions.appointment.updatePaymentInfoByHarmonyPayment(
      checkoutPaymentInfo
    );
    if (dueAmount === 0) {
      // ----- Transaction Completed --------
      this.props.actions.appointment.completeTransaction();
    } else if (dueAmount < 0) {
      this.props.actions.appointment.showPopupChangeMoney(dueAmount);
    } else {
      this.props.actions.appointment.showPopupPaymentDetails();
    }
  };

  // ------------ Signal R -------
  setupSignalR(
    profile,
    token,
    checkoutGroupId,
    deviceId,
    method,
    moneyUserGiveForStaff
  ) {
    try {
      // ${apiConfigs.BASE_URL}
      // const tempEnv = env.IS_PRODUCTION;
      // const tempURI = tempEnv == "Staging" ? 'https://signalr-stage.harmonypayment.com/' : apiConfigs.BASE_URL;
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${Configs.SOCKET_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app&deviceId=${deviceId}&token=${token}`,
          {
            transport:
              signalR.HttpTransportType.LongPolling |
              signalR.HttpTransportType.WebSockets,
          }
        )
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on("ListWaNotification", (data) => {
        const temptData = JSON.parse(data);
        if (
          temptData.data &&
          !_.isEmpty(temptData.data) &&
          temptData.data.isPaymentHarmony &&
          temptData.data.checkoutGroupId == checkoutGroupId
        ) {
          this.handleHarmonyPayment(temptData.data.checkoutPayment);
          connection.stop();
        }
        // ---------- Handle reload Tip in Customer App ---------
        if (
          temptData.data &&
          !_.isEmpty(temptData.data) &&
          temptData.data.isTipAppointment
        ) {
          this.props.actions.appointment.getGroupAppointmentById(
            temptData.data.appointmentId,
            false,
            false,
            true,
          );
        }
      });

      connection.onclose(async (error) => {
        this.props.actions.appointment.resetConnectSignalR();
      });

      connection
        .start()
        .then(() => {
          this.props.actions.app.stopLoadingApp();
          this.props.actions.appointment.referenceConnectionSignalR(connection);
          this.setState({
            isCancelHarmonyPay: true,
            changeButtonDone: true,
          });
          this.props.actions.appointment.paymentAppointment(
            checkoutGroupId,
            method,
            moneyUserGiveForStaff
          );
        })
        .catch((error) => {
          this.props.actions.app.stopLoadingApp();
          setTimeout(() => {
            alert(error);
          }, 1000);
        });
    } catch (error) {
      this.props.actions.app.stopLoadingApp();
      setTimeout(() => {
        alert(error);
      }, 1000);
    }
  }

  doneAddBasketSignInAppointment = () => {
    this.scrollTabRef.current?.goToPage(0);
    const { connectionSignalR } = this.props;
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
    this.props.gotoTabAppointment();
    this.setState(initState);
    this.props.actions.appointment.resetBasketEmpty();
    this.props.actions.appointment.resetPayment();
    this.props.actions.appointment.changeFlagSigninAppointment(false);
  };

  extractBill = () => {
    const { groupAppointment, paymentDetailInfo, isOfflineMode } = this.props;
    const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.state;

    if (_.isEmpty(paymentDetailInfo)) {
      if (isOfflineMode) {
        const temptTotal = Number(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2);
        this.modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      } else {
        const temptTotal = _.isEmpty(groupAppointment)
          ? Number(
              formatNumberFromCurrency(subTotalLocal) +
                formatNumberFromCurrency(tipLocal) +
                formatNumberFromCurrency(taxLocal) -
                formatNumberFromCurrency(discountTotalLocal)
            ).toFixed(2)
          : groupAppointment?.total;
        this.modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      }
    } else {
      const totalExact = paymentDetailInfo.dueAmount
        ? paymentDetailInfo.dueAmount
        : 0;
      this.modalBillRef.current?.setStateFromParent(`${totalExact}`);
    }
  };

  addAppointmentOfflineMode(isHarmonyOffline = false) {
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      infoUser,
      tipLocal,
      subTotalLocal,
      taxLocal,
      discountTotalLocal,
      staffIdOfline,
      fromTime,
    } = this.state;
    const { profile, appointmentIdOffline, profileStaffLogin } = this.props;

    let method = this.getPaymentString(paymentSelected);
    const dataAnymousAppoitment = this.getBasketOffline();
    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } =
      dataAnymousAppoitment;
    const appointmentOfflineMode = {
      appointmentId: appointmentIdOffline,
      firstName: infoUser.firstName,
      lastName: infoUser.lastName,
      phoneNumber: infoUser.phoneNumber,
      subTotal: subTotalLocal ? parseFloat(subTotalLocal) : 0,
      tax: taxLocal ? parseFloat(taxLocal) : 0,
      tipAmount: tipLocal ? parseFloat(tipLocal) : 0,
      discount: discountTotalLocal ? parseFloat(discountTotalLocal) : 0,
      merchantId: profile.merchantId,
      services: arryaServicesBuy,
      extras: arrayExtrasBuy,
      products: arrayProductBuy,
      fromTime:
        fromTime !== ""
          ? fromTime
          : formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
      staffId: staffIdOfline !== 0 ? staffIdOfline : profileStaffLogin.staffId,
      customDiscountFixed: customDiscountPercentLocal,
      customDiscountPercent: customDiscountFixedLocal,
      paymentMethod: method,
      paymentTransactionId: 0,
    };
    if (isHarmonyOffline) {
      this.setState({
        appointmentOfflineMode: appointmentOfflineMode,
      });
    } else {
      this.props.actions.dataLocal.addAppointmentOfflineMode(
        appointmentOfflineMode
      );
    }
  }

  payBasket = async () => {
    const { paymentSelected } = this.state;
    const { groupAppointment, isOfflineMode, paymentDetailInfo } = this.props;
    const method = this.getPaymentString(paymentSelected);

    if (isOfflineMode && method === "harmony") {
      this.scrollTabRef.current?.goToPage(2);
      this.addAppointmentOfflineMode(true);
      return;
    }

    if (
      isOfflineMode &&
      (method === "credit_card" || method === "debit_card")
    ) {
      alert("Not Support Offline Mode");
      return;
    }

    if (method === "harmony" && _.isEmpty(groupAppointment)) {
      this.popupSendLinkInstallRef.current?.setStateFromParent("");
      this.setState({
        visibleSendLinkPopup: true,
      });
    } else {
      if (method === "harmony" || method === "credit_card") {
        const dueAmount = paymentDetailInfo?.dueAmount || 0;
        this.modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
      }

      await this.setState({
        visibleBillOfPayment: true,
      });
    }
  }; // !

  cancelHarmonyPayment = async () => {
    await this.setState({
      changeButtonDone: false,
      isCancelHarmonyPay: false,
      paymentSelected: "",
    });
    const { connectionSignalR, payAppointmentId } = this.props;

    if (payAppointmentId) {
      this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
    }
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
  }; // !

  backAddBasket = async () => {
    this.cancelHarmonyPayment();
    this.scrollTabRef.current?.goToPage(0);
  }; // !

  handlePaymentOffLineMode = async () => {
    const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.state;
    const moneyUserGiveForStaff = parseFloat(
      formatNumberFromCurrency(this.modalBillRef.current?.state.quality)
    );
    const totalLocal = Number(
      formatNumberFromCurrency(subTotalLocal) +
        formatNumberFromCurrency(tipLocal) +
        formatNumberFromCurrency(taxLocal) -
        formatNumberFromCurrency(discountTotalLocal)
    ).toFixed(2);

    if (moneyUserGiveForStaff == 0) {
      alert("Enter amount!");
    } else if (moneyUserGiveForStaff - totalLocal < 0) {
      alert("Payment amount must be greater : " + totalLocal);
    } else {
      this.addAppointmentOfflineMode();
      await this.setState({
        visibleBillOfPayment: false,
      });
      this.modalBillRef.current?.setStateFromParent(`0`);
      this.props.actions.appointment.showModalPrintReceipt();
    }
  };

  doneBill = async (amountPayment = false) => {
    const {
      groupAppointment,
      profile,
      paxMachineInfo,
      token,
      isOfflineMode,
      deviceId,
      profileStaffLogin,
      customerInfoBuyAppointment,
      paymentDetailInfo,
      cloverMachineInfo,
      dejavooMachineInfo,
      paymentMachineType,
    } = this.props;
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      customerInfoByPhone,
    } = this.state;
    const moneyUserGiveForStaff =
      amountPayment !== false
        ? amountPayment
        : parseFloat(
            formatNumberFromCurrency(this.modalBillRef.current?.state.quality)
          );
    const method = this.getPaymentString(paymentSelected);
    const total = groupAppointment?.total
      ? parseFloat(formatNumberFromCurrency(groupAppointment.total))
      : 0;
    const dueAmount = paymentDetailInfo.dueAmount
      ? parseFloat(formatNumberFromCurrency(paymentDetailInfo.dueAmount))
      : 0;

    if (isOfflineMode) {
      this.handlePaymentOffLineMode();
      return;
    }

    if (moneyUserGiveForStaff == 0 && groupAppointment && total != 0) {
      alert("Enter amount!");
    } else if (
      (method === "harmony" ||
        method === "credit_card" ||
        method === "debit_card") &&
      moneyUserGiveForStaff > dueAmount
    ) {
      alert("The change not bigger than total money!");
    } else {
      await this.setState({
        visibleBillOfPayment: false,
      });

      this.modalBillRef.current?.setStateFromParent(`0`);
      if (!_.isEmpty(groupAppointment)) {
        if (method === "harmony") {
          this.props.actions.app.loadingApp();
          this.setupSignalR(
            profile,
            token,
            groupAppointment?.checkoutGroupId,
            deviceId,
            method,
            moneyUserGiveForStaff
          );
        } else if (method === "credit_card" || method === "debit_card") {
          let isSetup = false;
          if (paymentMachineType == PaymentTerminalType.Pax) {
            isSetup = l.get(paxMachineInfo, "isSetup");
          } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
            isSetup = l.get(dejavooMachineInfo, "isSetup");
          } else {
            isSetup = l.get(cloverMachineInfo, "isSetup");
          }
          if (isSetup) {
            if (moneyUserGiveForStaff == 0) {
              alert("Enter amount!");
            } else {
              this.hanleCreditCardProcess(true, moneyUserGiveForStaff);
            }
          } else {
            setTimeout(() => {
              alert("Please connect your Payment terminal to take payment.");
            }, 300);
          }
        } else if (method === "giftcard") {
          setTimeout(() => {
            alert("giftcard");
          }, 500);
        } else {
          this.props.actions.appointment.paymentAppointment(
            groupAppointment?.checkoutGroupId,
            method,
            moneyUserGiveForStaff
          );
        }
      } else {
        // ------ Handle Buy at store -------
        if (method === "credit_card" || method === "debit_card") {
          this.hanleCreditCardProcess(false, moneyUserGiveForStaff);
        } else if (method === "harmony") {
          this.popupSendLinkInstallRef.current?.setStateFromParent("");
          this.setState({
            visibleSendLinkPopup: true,
          });
        }
      }
    }
  }; // !

  async hanleCreditCardProcess(online = true, moneyUserGiveForStaff) {
    const { paxMachineInfo, isTipOnPaxMachine } = this.props;
    const { paymentSelected, isCancelAppointment } = this.state;
    const { ip, port, timeout } = paxMachineInfo;
    const moneyCreditCard = Number(
      formatNumberFromCurrency(moneyUserGiveForStaff) * 100
    ).toFixed(2);
    const tenderType = paymentSelected === "Credit Card" ? "CREDIT" : "DEBIT";

    if (Platform.OS === "android") {
      // 1. Show modal processing
      await this.setState({
        visibleProcessingCredit: true,
      });
      setTimeout(() => {
        PoslinkAndroid.sendTransaction(
          ip,
          port,
          "",
          tenderType,
          `${parseInt(moneyCreditCard)}`,
          "SALE",
          (err) => {
            const errorTrans = JSON.parse(err);
            this.setState({
              visibleProcessingCredit: false,
              changeButtonDone: false,
            });
            setTimeout(() => {
              alert(errorTrans.Code);
            }, 500);
          },
          (data) => {
            this.handleResponseCreditCard(data, online, moneyUserGiveForStaff);
          }
        );
      }, 100);
    } else {
      const { groupAppointment } = this.props;
      this.props.actions.appointment.checkCreditPaymentToServer(
        groupAppointment?.checkoutGroupId || 0,
        moneyUserGiveForStaff,
        moneyCreditCard
      );
    }
  } // !

  getPAXReport = async (paxMachineInfo, isLastTransaction) => {
    const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
      paxMachineInfo;

    if (isSetup) {
      let isError = false;

      try {
        const tempIpPax = commType == "TCP" ? ip : "";
        const tempPortPax = commType == "TCP" ? port : "";
        const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;

        let data = await PosLinkReport.reportTransaction({
          transType: "LOCALDETAILREPORT",
          edcType: "ALL",
          cardType: "",
          paymentType: "",
          commType: commType,
          destIp: tempIpPax,
          portDevice: tempPortPax,
          timeoutConnect: "90000",
          bluetoothAddr: idBluetooth,
          refNum: "",
          isLastTransaction,
        });
        let result = JSON.parse(data);
        const ExtData = result?.ExtData || "";
        const xmlExtData =
          "<xml>" + ExtData.replace("\\n", "").replace("\\/", "/") + "</xml>";

        if (result?.ResultCode && result?.ResultCode == "000000") {
          return result;
        } else {
          return {};
        }
      } catch (error) {
        return {};
      }
    }
  };

  handleMissingTransaction = async () => {
    const {
      paxMachineInfo,
      amountCredtitForSubmitToServer,
      groupAppointment,
      profileStaffLogin,
      versionApp,
    } = this.props;

    let result = await this.getPAXReport(paxMachineInfo, "1");

    if (!l.isEmpty(result)) {
      if (
        l.get(result, "InvNum") ==
        l.get(groupAppointment, "checkoutGroupId", -1).toString()
      ) {
        //Call server to check auth number
        const mainAppointmentId = l.get(
          groupAppointment,
          "mainAppointmentId",
          "0"
        );
        const resultGroupAppointment = await requestAPI({
          type: "GET_GROUP_APPOINTMENT_BY_ID",
          method: "GET",
          api: `${Configs.API_URL}appointment/getGroupById/${mainAppointmentId}`,
          token: profileStaffLogin.token,
          versionApp: versionApp,
        });

        if (l.get(resultGroupAppointment, "codeNumber", 0) != 200) {
          this.cancelPayment();
          return;
        }

        if (
          l.get(resultGroupAppointment, "data.lastAuthCode") ==
          l.get(result, "AuthCode")
        ) {
          //have not pay yet || multi pay
          this.sendTransaction();
        } else {
          //missing transaction
          //call to server previous response
          this.isGetResponsePaymentPax = true;
          this.handleResponseCreditCard(
            JSON.stringify(result),
            true,
            amountCredtitForSubmitToServer
          );
        }
      } else {
        this.sendTransaction();
      }
    } else {
      //can not get report
      // batch close or pax inprocess
      this.sendTransaction();
    }
  };

  async sendTransactionToPaymentMachine() {
    const {
      cloverMachineInfo,
      dejavooMachineInfo,
      paymentMachineType,
      isTipOnPaxMachine,
      paxAmount,
      groupAppointment,
      payAppointmentId,
      isCreditPaymentToServer,
      lastTransactionAppointmentId,
    } = this.props;
    if (paymentMachineType == PaymentTerminalType.Clover) {
      const port = l.get(cloverMachineInfo, "port")
        ? l.get(cloverMachineInfo, "port")
        : 80;
      const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;
      this.isProcessPaymentClover = true;
      this.setState({
        visibleProcessingCredit: true,
      });
      clover.sendTransaction({
        url,
        remoteAppId: REMOTE_APP_ID,
        appName: APP_NAME,
        posSerial: POS_SERIAL,
        token: l.get(cloverMachineInfo, "token")
          ? l.get(cloverMachineInfo, "token", "")
          : "",
        tipMode: isTipOnPaxMachine ? "ON_SCREEN_BEFORE_PAYMENT" : "NO_TIP",
        amount: `${parseFloat(paxAmount)}`,
        externalId: `${payAppointmentId}`, //`${groupAppointment?.checkoutGroupId || 0}`,
      });
    } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
      setTimeout(() => {
        this.setState({
          visibleProcessingCredit: true,
          visibleErrorMessageFromPax: false,
        });
      }, 200);

      const {
        isTipOnPaxMachine,
        paxAmount,
        groupAppointment,
        amountCredtitForSubmitToServer,
        payAppointmentId,
      } = this.props;
      const { paymentSelected } = this.state;
      const tenderType = paymentSelected === "Credit Card" ? "Credit" : "Debit";

      const parameter = {
        tenderType: tenderType,
        transType: "Sale",
        amount: parseFloat(paxAmount / 100).toFixed(2),
        RefId: isCreditPaymentToServer
          ? lastTransactionAppointmentId
          : payAppointmentId,
        invNum: `${groupAppointment?.checkoutGroupId || 0}`,
      };

      const responses = await requestTransactionDejavoo(parameter);
      this.handleResponseCreditCardDejavoo(
        responses,
        true,
        amountCredtitForSubmitToServer,
        parameter
      );
    } else {
      //Pax
      this.sendTransToPaxMachine();
    }
  }

  sendTransToPaxMachine = async () => {
    // console.log("=======> sendTransToPaxMachine");
    const { paxMachineInfo, isCancelPayment } = this.props;

    this.isGetResponsePaymentPax = false;

    // 1. Show modal processing
    await this.setState({
      visibleProcessingCredit: true,
    });

    //2. Check if isCancelPayment = true
    if (isCancelPayment) {
      this.handleMissingTransaction();
    } else {
      this.sendTransaction();
    }
  };

  cancelPayment() {
    const { payAppointmentId } = this.props;
    if (payAppointmentId) {
      this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
    }
    this.isGetResponsePaymentPax = true;
    setTimeout(() => {
      this.setState({
        visibleProcessingCredit: false,
        visibleErrorMessageFromPax: true,
        errorMessageFromPax: "Transaction fail",
      });
    }, 300);
  }

  sendTransaction() {
    //send to Pax terminal
    const {
      paxMachineInfo,
      isTipOnPaxMachine,
      paxAmount,
      amountCredtitForSubmitToServer,
      bluetoothPaxInfo,
      groupAppointment,
      isCancelPayment,
    } = this.props;
    const { paymentSelected } = this.state;
    const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
      paxMachineInfo;
    const tenderType = paymentSelected === "Credit Card" ? "CREDIT" : "DEBIT";
    const tempIpPax = commType == "TCP" ? ip : "";
    const tempPortPax = commType == "TCP" ? port : "";
    const idBluetooth = commType === "TCP" ? "" : bluetoothAddr;
    const extData = isTipOnPaxMachine
      ? "<TipRequest>1</TipRequest><Force>T</Force>"
      : "<Force>T</Force>";

    // console.log("=======> sendTransaction");

    const parameter = {
      tenderType: tenderType,
      transType: "SALE",
      amount: `${parseFloat(paxAmount)}`,
      transactionId: "1",
      extData: extData,
      commType: commType,
      destIp: tempIpPax,
      portDevice: tempPortPax,
      timeoutConnect: "90000",
      bluetoothAddr: idBluetooth,
      invNum: `${groupAppointment?.checkoutGroupId || 0}`,
    };
    // Send Trans to pax
    PosLink.sendTransaction(parameter, (message) => {
      this.isGetResponsePaymentPax = true;
      // console.log("=======> sendTransaction " + message);

      this.handleResponseCreditCard(
        message,
        true,
        amountCredtitForSubmitToServer,
        parameter
      );
    });
  }

  async handleResponseCreditCardDejavoo(
    message,
    online,
    moneyUserGiveForStaff,
    parameter
  ) {
    const {
      profile,
      payAppointmentId,
      groupAppointment,
      isCreditPaymentToServer,
      lastTransactionAppointmentId,
      lastGroupAppointmentPay,
    } = this.props;

    try {
      parseString(message, (err, result) => {
        let errorCode = l.get(result, "xmp.response.0.ResultCode.0");

        if (
          err ||
          errorCode != 0 ||
          l.get(result, "xmp.response.0.Message.0") != "Approved"
        ) {
          if (
            errorCode == "999" &&
            groupAppointment?.checkoutGroupId ==
              lastGroupAppointmentPay?.checkoutGroupId
          ) {
            //time out
            const param = {
              RefId: payAppointmentId,
            };
            requestPreviousTransactionReportDejavoo(param).then((response) => {
              this.handleResponseCreditCardDejavoo(
                response,
                online,
                moneyUserGiveForStaff,
                parameter
              );
            });
          } else {
            let detailMessage = l
              .get(result, "xmp.response.0.RespMSG.0", "")
              .replace(/%20/g, " ");
            detailMessage = !stringIsEmptyOrWhiteSpaces(detailMessage)
              ? `: ${detailMessage}`
              : detailMessage;

            const resultTxt =
              `${l.get(result, "xmp.response.0.Message.0")}${detailMessage}` ||
              "Transaction failed";

            if (payAppointmentId) {
              this.props.actions.appointment.cancelHarmonyPayment(
                payAppointmentId,
                "transaction fail",
                resultTxt
              );
            }

            setTimeout(() => {
              this.setState({
                visibleProcessingCredit: false,
                visibleErrorMessageFromPax: true,
                errorMessageFromPax: resultTxt,
              });
            }, 400);
          }
        } else {
          this.setState({ visibleProcessingCredit: false });
          const SN = l.get(result, "xmp.response.0.SN.0");
          if (!stringIsEmptyOrWhiteSpaces(SN)) {
            this.props.actions.hardware.setDejavooMachineSN(SN);
          }
          const payAppointmentIdTemp = isCreditPaymentToServer
            ? lastTransactionAppointmentId
            : payAppointmentId;
          this.props.actions.appointment.submitPaymentWithCreditCard(
            profile?.merchantId || 0,
            message,
            payAppointmentIdTemp,
            moneyUserGiveForStaff,
            "dejavoo",
            parameter
          );
        }
      });
    } catch (error) {}
  }

  async handleResponseCreditCard(
    message,
    online,
    moneyUserGiveForStaff,
    parameter
  ) {
    const { profile, payAppointmentId, groupAppointment } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });
    try {
      const result = JSON.parse(message);
      const tempEnv = env.IS_PRODUCTION;
      if (l.get(result, "status", 0) == 0) {
        // setTimeout(()=>{ PosLink.cancelTransaction()}, 100)
        if (payAppointmentId) {
          this.props.actions.appointment.cancelHarmonyPayment(
            payAppointmentId,
            "transaction fail",
            result?.message
          );
        }
        if (result?.message === "ABORTED") {
          return;
        }
        setTimeout(() => {
          // alert(result.message);
          this.setState({
            visibleErrorMessageFromPax: true,
            errorMessageFromPax: `${result.message}`,
          });
        }, 300);
      } else if (result.ResultCode && result.ResultCode == "000000") {
        if (tempEnv == "Production" && result.Message === "DEMO APPROVED") {
          if (payAppointmentId) {
            this.props.actions.appointment.cancelHarmonyPayment(
              payAppointmentId
            );
          }
          await this.setState({
            visibleProcessingCredit: false,
          });
          setTimeout(() => {
            alert("You're running your Pax on DEMO MODE!");
          }, 1000);
        } else {
          this.props.actions.appointment.submitPaymentWithCreditCard(
            profile?.merchantId || 0,
            message,
            payAppointmentId,
            moneyUserGiveForStaff,
            "pax",
            parameter
          );
        }
      } else {
        const resultTxt = result?.ResultTxt || "Transaction failed:";
        if (payAppointmentId) {
          this.props.actions.appointment.cancelHarmonyPayment(
            payAppointmentId,
            "transaction fail",
            resultTxt
          );
        }
        setTimeout(() => {
          // alert(resultTxt);
          this.setState({
            visibleErrorMessageFromPax: true,
            errorMessageFromPax: `${resultTxt}`,
          });
        }, 300);
      }
    } catch (error) {}
  } // !

  cancelTransaction = async () => {
    const { payAppointmentId, language, paymentMachineType } = this.props;
    if (Platform.OS === "android") {
      PoslinkAndroid.cancelTransaction((data) => {});
    } else {
      if (paymentMachineType == "Clover") {
        if (this.isProcessPaymentClover) {
          alert(localize("PleaseWait", language));
          return;
        }
      } else if (paymentMachineType == PaymentTerminalType.Dejavoo) {
        //Dejavoo can not cancel transaction by api
        alert(localize("PleaseWait", language));
        return;
      } else {
        if (!this.isGetResponsePaymentPax) {
          alert(localize("PleaseWait", language));
          return;
        }
        PosLink.cancelTransaction();
      }

      if (payAppointmentId) {
        this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
      }
      await this.setState({
        visibleProcessingCredit: false,
        changeButtonDone: false,
      });
    }
  };

  doneBillByCash = async () => {
    await this.setState({
      visibleChangeMoney: false,
    });
    // ------- Handle Offline mode ------
    const { isOfflineMode } = this.props;
    if (isOfflineMode) {
      this.props.actions.appointment.showModalPrintReceipt();
    } else {
      const { appointmentDetail, appointmentIdOffline } = this.props;
      const temptAppointmentId = _.isEmpty(appointmentDetail)
        ? appointmentIdOffline
        : appointmentDetail.appointmentId;
      this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
      this.props.actions.appointment.showModalPrintReceipt();
    }
  };

  setStateVisibleFromParent = async (visibleConfirm, isDrawer = false) => {
    await this.setState({
      visibleConfirm,
      isDrawer,
    });
  };

  changeStylist = async (service, appointmentId) => {
    const { isOfflineMode, groupAppointment } = this.props;

    const { fromTime = new Date() } =
      groupAppointment?.appointments?.find(
        (appointment) => appointment.appointmentId === appointmentId
      ) || {};

    this.changeStylistRef.current?.setStateFromParent(service, appointmentId);
    if (!isOfflineMode) {
      this.props.actions.staff.getStaffService(
        service?.data?.serviceId,
        formatWithMoment(fromTime, "MM/DD/YYYY"), // Fix for case custom service not contains by staff, so get staff no data here!
        this.callBackGetStaffService
      );
    } else {
      this.setState({ visibleChangeStylist: true });
    }
  }; // !

  callBackGetStaffService = (data = []) => {
    this.setState({
      visibleChangeStylist: true,
      staffOfService: data,
    });
  }; // !

  changeProduct = async (product, appointmentId) => {
    this.changePriceAmountProductRef.current?.setStateFromParent(
      product,
      appointmentId
    );
    this.setState({
      visibleChangePriceAmountProduct: true,
    });
  }; // !

  closePopupActiveGiftCard = async () => {
    this.props.actions.appointment.handleVisibleActiveGiftCard(false);
    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: "",
      },
      productSeleted: null,
      categoryTypeSelected: "",
      arrSelectedExtra: [],
      paymentSelected: "",
      customServiceSelected: null,
    });
  }; // !

  onSelectGiftCard = async (category) => {
    const { categorySelected } = this.state;
    if (categorySelected?.categoryId !== category?.categoryId) {
      await this.setState({
        categorySelected: category,
        categoryTypeSelected: category?.categoryType,
        productSeleted: null,
        isShowColProduct: false,
        isShowColAmount: false,
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
      this.activeGiftCardRef.current?.setStateFromParent();
      this.props.actions.appointment.handleVisibleActiveGiftCard();
    } else {
      await this.setState({
        isShowColProduct: false,
        isShowColAmount: false,
        categorySelected: {
          categoryId: -1,
          categoryType: "",
        },
        productSeleted: null,
        categoryTypeSelected: "",
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
    }
  }; // !

  onPressSelectCategory = async (category) => {
    const { categorySelected, isBlockBookingFromCalendar, selectedStaff } =
      this.state;
    const { isOfflineMode } = this.props;
    if (categorySelected?.categoryId !== category?.categoryId) {
      if (!isOfflineMode && !isBlockBookingFromCalendar) {
        if (category?.categoryType?.toString().toLowerCase() === "service") {
          this.getService(category?.categoryId, selectedStaff?.staffId);
        } else if (
          category?.categoryType?.toString().toLowerCase() === "product"
        ) {
          this.getProduct(category?.categoryId);
        }
      }

      await this.setState({
        categorySelected: category,
        categoryTypeSelected: category?.categoryType,
        isShowColProduct: true,
        isShowColAmount: false,
        productSeleted: null,
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
    } else {
      await this.setState({
        isShowColProduct: false,
        isShowColAmount: false,
        categorySelected: {
          categoryId: -1,
          categoryType: "",
        },
        productSeleted: null,
        categoryTypeSelected: "",
        arrSelectedExtra: [],
        customServiceSelected: null,
      });
    }
  }; // !

  changeProductBasketLocal = async (productIdLocal, price, quantity) => {};

  changeStylistBasketLocal = async (serviceId, staffId, tip, price) => {
    const { basket } = this.state;
    const { listStaffByMerchant } = this.props;
    if (staffId) {
      const temptStaff = getStaffInfoById(listStaffByMerchant, staffId);
      const temptBasket = basket.map((item, index) => {
        if (item.type === "Service" && item.data.serviceId === serviceId) {
          return {
            ...item,
            data: {
              ...item.data,
              price: price,
            },
            staff: {
              staffId: staffId,
              imageUrl: temptStaff?.imageUrl || "",
              displayName: temptStaff?.displayName || "",
              tip: tip,
            },
          };
        }
        return item;
      });
      let temptTip = 0;
      for (let i = 0; i < temptBasket.length; i++) {
        if (temptBasket[i].type === "Service") {
          if (temptBasket[i].staff && temptBasket[i].staff.tip) {
            temptTip =
              temptTip + formatNumberFromCurrency(temptBasket[i].staff.tip);
          }
        }
      }
      await this.setState({
        basket: temptBasket,
        tipLocal: temptTip,
      });
    }
  }; // !

  showModalDiscount = async (appointmentId) => {
    const { connectionSignalR } = this.props;
    if (_.isEmpty(connectionSignalR)) {
      const {
        subTotalLocal,
        discountTotalLocal,
        customDiscountPercentLocal,
        customDiscountFixedLocal,
      } = this.state;

      if (appointmentId !== -1) {
        const { groupAppointment } = this.props;
        const appointment = groupAppointment?.appointments?.find(
          (appointment) => appointment.appointmentId === appointmentId
        );
        const { services, products, extras, giftCards } = appointment;
        const arrayProducts = getArrayProductsFromAppointment(products);
        const arryaServices = getArrayServicesFromAppointment(services);
        const arrayExtras = getArrayExtrasFromAppointment(extras);
        const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);
        const temptBasket = arrayProducts.concat(
          arryaServices,
          arrayExtras,
          arrayGiftCards
        );
        if (temptBasket.length > 0) {
          this.props.actions.marketing.getPromotionByAppointment(appointmentId);
        }
      } else {
        // ----------- Offline ------------
        this.popupDiscountLocalRef.current?.setStateFromParent(
          subTotalLocal,
          discountTotalLocal,
          customDiscountPercentLocal,
          customDiscountFixedLocal
        );
        await this.setState({
          visiblePopupDiscountLocal: true,
        });
      }
    } else {
      alert("You are paying by Harmony Payment!");
    }
  }; // !

  showModalTipAppointment = async (
    appointmentId,
    tip,
    subTotal,
    tipPercent
  ) => {
    const { connectionSignalR } = this.props;
    if (_.isEmpty(connectionSignalR)) {
      this.changeTipRef.current?.setStateFromParent(
        appointmentId,
        tip,
        subTotal,
        tipPercent
      );
      await this.setState({
        visibleChangeTip: true,
      });
    } else {
      alert("You are paying by Harmony Payment!");
    }
  }; // !

  async callbackDiscountToParent(
    customDiscountPercentLocal,
    customDiscountFixedLocal,
    discountTotalLocal
  ) {
    await this.setState({
      customDiscountPercentLocal,
      customDiscountFixedLocal,
      discountTotalLocal,
    });
  }

  sendLinkInstallApp = async () => {
    const phone = this.popupSendLinkInstallRef.current?.state.value;
    const codeAreaPhone =
      this.popupSendLinkInstallRef.current?.state.codeAreaPhone;

    if (phone.length > 6) {
      await this.setState({
        visibleSendLinkPopup: false,
      });
      this.props.actions.app.sendLinkInstallApp(`${codeAreaPhone}${phone}`);
    } else {
      alert("Phone is invalid !");
    }
  }; // !

  onRequestClosePopupDiscountLocal = async () => {
    await this.setState({
      visiblePopupDiscountLocal: false,
    });
  }; // !

  onRequestCloseBillModal = async () => {
    await this.setState({
      changeButtonDone: false,
      paymentSelected: "",
      visibleBillOfPayment: false,
    });
    this.props.actions.appointment.resetPayment();
  }; // !

  // ----------- Change Flow Checkout ------------
  getTypesOfMoneyAppointmenr = (appointmentDetail) => {
    const tipAmount = appointmentDetail.tipAmount
      ? appointmentDetail.tipAmount
      : 0;
    const subTotal =
      !_.isEmpty(appointmentDetail) &&
      appointmentDetail &&
      appointmentDetail.subTotal
        ? appointmentDetail.subTotal
        : 0;
    const discount = appointmentDetail?.discount || 0;
    const tax = appointmentDetail?.tax || 0;
    const total = appointmentDetail?.total || 0;

    const temptSubTotal = _.isEmpty(appointmentDetail)
      ? subTotalLocal
      : subTotal;
    const temptTotal = _.isEmpty(appointmentDetail)
      ? Number(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal)
        ).toFixed(2)
      : total;
    const temptDiscount = _.isEmpty(appointmentDetail)
      ? discountTotalLocal
      : discount;
    const temptTip = _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
    const temptTax = _.isEmpty(appointmentDetail) ? taxLocal : tax;

    return {
      temptSubTotal,
      temptTotal,
      temptDiscount,
      temptTip,
      temptTax,
    };
  };

  addAppointmentCheckout = () => {
    const { blockAppointments } = this.props;

    if (blockAppointments.length > 0) {
      this.createABlockAppointment();
      return;
    }
    this.props.gotoAppointmentTabToGroup();
  };

  closePopupProductPaymentDetails = () => {
    this.setState({
      visiblePopupPaymentDetails: false,
    });
  }; // !

  nextPayment = async () => {
    await this.setState({
      visiblePopupPaymentDetails: false,
    });
  }; // !

  submitSerialCode = async (code) => {
    const {
      groupAppointment,
      profile,
      profileStaffLogin,
      blockAppointments,
      customerInfoBuyAppointment,
    } = this.props;
    const {
      paymentSelected,
      customDiscountPercentLocal,
      customDiscountFixedLocal,
    } = this.state;

    if (blockAppointments.length > 0) {
      this.addGiftCardIntoBlockAppointment(code);
      return;
    }

    if (!_.isEmpty(groupAppointment)) {
      if (paymentSelected === "Gift Card") {
        this.props.actions.appointment.checkSerialNumber(
          code,
          false,
          false,
          true
        );
      } else {
        this.props.actions.appointment.checkSerialNumber(code);
      }
    } else {
      const moneyUserGiveForStaff = parseFloat(
        formatNumberFromCurrency(this.modalBillRef.current?.state.quality)
      );

      const method = this.getPaymentString(paymentSelected);

      const bodyAction = {
        merchantId: profile.merchantId,
        userId: customerInfoBuyAppointment?.userId || 0,
        status: "checkin",
        services: [],
        extras: [],
        products: [],
        fromTime: formatWithMoment(new Date(), "MM/DD/YYYY hh:mm A"),
        staffId: profileStaffLogin?.staffId || 0,
        customDiscountFixed: customDiscountFixedLocal,
        customDiscountPercent: customDiscountPercentLocal,
        firstName: customerInfoBuyAppointment?.firstName || "",
        lastName: customerInfoBuyAppointment?.lastName || "",
        phoneNumber: customerInfoBuyAppointment?.phone || "",
        customerId: customerInfoBuyAppointment?.customerId || 0,
      };
      const optionAction = {
        method: "POST",
        token: true,
        api: `${Configs.API_URL}appointment`,
        paymentMethod: method,
        isLoading: true,
        paidAmount: moneyUserGiveForStaff,
        creditCardInfo: false,
        merchantId: profile.merchantId,
        isPayment: false,
      };

      this.props.actions.appointment.checkSerialNumber(
        code,
        bodyAction,
        optionAction
      );
    }

    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: "",
      },
      productSeleted: null,
      categoryTypeSelected: "",
      arrSelectedExtra: [],
      customServiceSelected: null,
    });
  }; // !

  confimPayOfflinemode = () => {
    this.setState({
      visibleScanCode: true,
    });
  }; // !

  onRequestCloseScanCode = () => {
    this.setState({
      visibleScanCode: false,
    });
  }; // !

  resultScanCode = async (e) => {
    await this.setState({
      visibleScanCode: false,
    });
    const { appointmentOfflineMode } = this.state;
    const tempDate = {
      ...appointmentOfflineMode,
      paymentTransactionId: e.data,
    };
    this.props.actions.dataLocal.addAppointmentOfflineMode(tempDate);
    this.props.actions.appointment.showModalPrintReceipt();
  }; // !

  getExtrasFromRedux = (productSeleted) => {
    const { extrasByMerchant } = this.props;
    const extrasBySort = [];

    for (let i = 0; i < extrasByMerchant.length; i++) {
      for (let j = 0; j < productSeleted?.extras.length; j++) {
        const extraLocal = productSeleted?.extras[j];
        const extralGlobal = extrasByMerchant[i];
        if (
          extralGlobal.extraId === extraLocal.extraId &&
          extralGlobal.isDisabled === 0
        ) {
          extrasBySort.push(extralGlobal);
          break;
        }
      }
    }

    return extrasBySort;
  }; // !

  createABlockAppointment = () => {
    const {
      profile,
      fromTimeBlockAppointment,
      customerInfoBuyAppointment,
      bookingGroupId,
      blockAppointments,
    } = this.props;

    const { selectedStaff } = this.state;

    let fromTime = fromTimeBlockAppointment;
    if (blockAppointments && blockAppointments.length > 0) {
      fromTime = l.get(blockAppointments, "0.fromTime")
        ? moment(l.get(blockAppointments, "0.fromTime")).local().format()
        : new Date();
    }

    const firstAppointment = blockAppointments[0];
    if (
      firstAppointment &&
      firstAppointment.status &&
      firstAppointment.status === "waiting"
    ) {
      this.props.actions.appointment.createAppointmentWaiting(
        profile.merchantId,
        fromTime,
        customerInfoBuyAppointment?.userId || 0,
        customerInfoBuyAppointment?.customerId || 0,
        customerInfoBuyAppointment?.firstName || "",
        customerInfoBuyAppointment?.lastName || "",
        customerInfoBuyAppointment?.phone || "",
        bookingGroupId,
        selectedStaff?.staffId ?? 0
      );
    } else {
      this.props.actions.appointment.createBlockAppointment(
        profile.merchantId,
        fromTime,
        customerInfoBuyAppointment?.userId || 0,
        customerInfoBuyAppointment?.customerId || 0,
        customerInfoBuyAppointment?.firstName || "",
        customerInfoBuyAppointment?.lastName || "",
        customerInfoBuyAppointment?.phone || "",
        bookingGroupId,
        selectedStaff?.staffId ?? 0
      );
    }
  }; // !

  addBlockAppointment = async () => {
    const { isOpenBlockAppointmentId } = this.props;
    const {
      categoryTypeSelected,
      productSeleted,
      arrSelectedExtra,
      customServiceSelected,
      selectedStaff,
    } = this.state;

    let isAppointmentIdOpen = "";

    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      if (!this.blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          this.blockAppointmentRef[i]?.props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : isOpenBlockAppointmentId;

    if (categoryTypeSelected === "Product") {
      this.props.actions.appointment.addItemIntoAppointment(
        {
          services: [],
          extras: [],
          products: [
            {
              productId: productSeleted?.productId,
              quantity: this.amountRef.current?.state.quanlity,
            },
          ],
          giftCards: [],
        },
        appointmentId,
        false,
        true
      );
    } else {
      // ------------- Buy online Extra , Service ---------

      const temptExtra = [];
      for (let i = 0; i < arrSelectedExtra.length; i++) {
        temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
      }
      this.props.actions.appointment.addItemIntoAppointment(
        {
          services: [
            {
              serviceId:
                productSeleted?.serviceId ?? customServiceSelected?.serviceId,
              ...(selectedStaff?.staffId && {
                staffId: selectedStaff?.staffId,
              }),
              ...(customServiceSelected && {
                categoryId: customServiceSelected?.categoryId,
                price: customServiceSelected?.price,
              }),
            },
          ],
          extras: temptExtra,
          products: [],
          giftCards: [],
        },
        appointmentId,
        false,
        true
      );
    }

    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: "",
      },
      productSeleted: null,
      categoryTypeSelected: "",
      arrSelectedExtra: [],
      customServiceSelected: null,
    });
  }; // !

  removeBlockAppointment = (appointmentId) => {
    const { customerInfoBuyAppointment, profile } = this.props;

    const customerId = customerInfoBuyAppointment.customerId
      ? customerInfoBuyAppointment.customerId
      : 0;

    this.props.actions.appointment.cancleAppointment(
      appointmentId,
      profile.merchantId,
      customerId,
      true,
      false
    );
  }; // !

  addGiftCardIntoBlockAppointment = (code) => {
    const { isOpenBlockAppointmentId } = this.props;
    let isAppointmentIdOpen = "";
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      if (!this.blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          this.blockAppointmentRef[i]?.props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : isOpenBlockAppointmentId;

    this.props.actions.appointment.addGiftCardIntoBlockAppointment(
      code,
      appointmentId
    );
  }; // !

  removeItemInBlockAppointment = (dataRemove) => {
    const { blockAppointments } = this.props;
    let isAppointmentIdOpen = "";
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      if (!this.blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          this.blockAppointmentRef[i]?.props.appointmentDetail.appointmentId;
        break;
      }
    }
    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : blockAppointments[0].appointmentId;
    this.props.actions.appointment.removeItemIntoAppointment(
      dataRemove,
      appointmentId,
      false,
      true
    );
  }; // !

  bookBlockAppointment = () => {
    this.props.gotoTabAppointment();
    this.props.actions.appointment.bookBlockAppointment();
    this.setState(initState);
    this.blockAppointmentRef = [];
    this.props.actions.appointment.resetGroupAppointment();
  }; // !

  toggleCollaps = (appointmentIdSelection) => {
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      const appointmentDetail =
        this.blockAppointmentRef[i]?.props.appointmentDetail;
      if (
        appointmentDetail &&
        appointmentDetail.appointmentId === appointmentIdSelection
      ) {
        this.props.actions.appointment.updateIdBlockAppointmentOpen(
          appointmentDetail.appointmentId
        );
        this.blockAppointmentRef[i].setStateFromParent(false);
      } else {
        this.blockAppointmentRef[i].setStateFromParent(true);
      }
    }
  }; // !

  addBlockAppointmentRef = (ref) => {
    if (ref) {
      this.blockAppointmentRef.push(ref);
    }
  };

  // ------------------ Change Customer Info buy appointment ----------
  displayPopupCustomerInfo = async () => {
    const { customerInfoBuyAppointment } = this.props;
    const firstName = customerInfoBuyAppointment?.firstName || "";
    const lastName = customerInfoBuyAppointment?.lastName || "";
    const phone = customerInfoBuyAppointment?.phone || "";
    this.popupCustomerInfoRef.current?.setStateFromParent(
      firstName,
      lastName,
      phone
    );
    this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(true);
  };

  updateBlockAppointmentRef = () => {
    const { isOpenBlockAppointmentId, idNextToAppointmentRemove } = this.props;
    const temptBlockAppointmentRef = this.blockAppointmentRef.filter(
      (block) => block._isMounted
    );

    if (temptBlockAppointmentRef.length > 0) {
      this.blockAppointmentRef = temptBlockAppointmentRef;
      let isAppointmentOpenExist = false;
      for (let i = 0; i < this.blockAppointmentRef.length; i++) {
        const appointmentDetail =
          this.blockAppointmentRef[i]?.props.appointmentDetail;
        if (appointmentDetail.appointmentId === isOpenBlockAppointmentId) {
          isAppointmentOpenExist = true;
          this.blockAppointmentRef[i].setStateFromParent(false);
        } else {
          this.blockAppointmentRef[i].setStateFromParent(true);
        }
      }
      if (!isAppointmentOpenExist) {
        const id = idNextToAppointmentRemove - 1;
        if (id >= 0) {
          this.blockAppointmentRef[id].setStateFromParent(false);
        }
      }
    } else {
      this.blockAppointmentRef = [];
    }
  };

  setBlockToggleCollaps = () => {
    const { isOpenBlockAppointmentId } = this.props;
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      const appointmentDetail =
        this.blockAppointmentRef[i]?.props.appointmentDetail;
      if (appointmentDetail.appointmentId === isOpenBlockAppointmentId) {
        this.blockAppointmentRef[i].setStateFromParent(false);
      } else {
        this.blockAppointmentRef[i].setStateFromParent(true);
      }
    }
  };

  checkBlockAppointment = (blockAppointments) => {
    let isBooking = false;
    for (let i = 0; i < blockAppointments.length; i++) {
      const subTotal = formatNumberFromCurrency(blockAppointments[i].subTotal);
      if (parseFloat(subTotal) > 0) {
        isBooking = true;
        break;
      }
    }

    return isBooking;
  };

  cancelGiftCardPayment = () => {
    this.props.actions.appointment.togglePopupGiftCardPaymentDetail(false);
    this.setState({
      paymentSelected: "",
    });
  }; // !

  showModalCheckPermission = (appointmentId, isBlock = false) => {
    this.popupCheckDiscountPermissionRef?.current?.setStateFromParent(
      "",
      appointmentId,
      isBlock
    );
    this.props.actions.marketing.switchPopupCheckDiscountPermission(true);
  }; // !

  closePopupCheckDiscountPermission = () => {
    this.props.actions.marketing.switchPopupCheckDiscountPermission(false);
  }; // !

  // ------------ New Code ----------

  scrollFlatListToStaffIndex = (staffId, isFirstPressCheckout) => {
    let index = -1;
    for (let i = 0; i < this.props.staffListCurrentDate.length; i++) {
      if (this.props.staffListCurrentDate[i]?.staffId === staffId) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      if (this.staffFlatListRef?.current) {
        if (isFirstPressCheckout) {
          setTimeout(() => {
            this.staffFlatListRef?.current?.scrollToIndex({
              index,
            });
          }, 300);
        } else {
          this.staffFlatListRef?.current?.scrollToIndex({
            index,
          });
        }
      } else {
        setTimeout(() => {
          this.staffFlatListRef?.current?.scrollToIndex({
            index,
          });
        }, 200);
      }
    }
  }; // !

  displayCategoriesColumn = (staff) => async () => {
    const { isOfflineMode } = this.props;
    if (!isOfflineMode) {
      this.getCategory(staff.staffId);
    }

    const { selectedStaff } = this.state;
    const isExist = selectedStaff?.staffId === staff?.staffId ? true : false;
    await this.setState({
      selectedStaff: isExist ? {} : staff,
      isShowCategoriesColumn: !isExist,
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: "",
      },
      productSeleted: null,
      categoryTypeSelected: "",
      arrSelectedExtra: [],
      customServiceSelected: null,
    });
    // this.scrollFlatListToStaffIndex(staff?.staffId);
  }; // !

  getCategory = (staffId) => {
    this.setState({ isLoadingCategory: true });
    this.props.actions.category.getCategoriesByStaff(
      staffId,
      this.callBackGetCategory
    );
  }; // !

  callBackGetCategory = (data = []) => {
    this.setState({
      isLoadingCategory: false,
      categoryStaff: data,
    });
  }; // !

  getProduct = (categoryId) => {
    this.setState({ isLoadingService: true });
    this.props.actions.product.getProductByStaff(
      categoryId,
      this.callBackGetProduct
    );
  }; // !

  getService = (categoryId, staffId) => {
    this.setState({ isLoadingService: true });
    this.props.actions.service.getServiceByStaff(
      categoryId,
      staffId,
      this.callBackGetService
    );
  }; // !

  callBackGetService = (data = []) => {
    this.setState({
      isLoadingService: false,
      serviceStaff: data,
    });
  }; // !

  callBackGetProduct = (data = []) => {
    this.setState({
      isLoadingService: false,
      productStaff: data,
    });
  }; // !

  displayEnterUserPhonePopup = () => {
    const { customerInfoBuyAppointment } = this.props;
    const firstName = customerInfoBuyAppointment?.firstName || "";
    const lastName = customerInfoBuyAppointment?.lastName || "";
    const phone = customerInfoBuyAppointment?.phone || "";
    this.popupCustomerInfoRef.current?.setStateFromParent(
      firstName,
      lastName,
      phone
    );
    this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(true);
  }; // !

  displayCustomerInfoPopup = async () => {
    const customerId = this.props?.customerInfoBuyAppointment?.customerId || 0;
    this.props.actions.customer.getCustomerInfoById(customerId, true);
  }; // !

  editCustomerInfo = (customerId, customer) => {
    this.props.actions.customer.editCustomer(customerId, customer, true);
  }; // !

  addCustomerInfo = (customer) => {
    this.props.actions.customer.addCustomer(customer, true);
  }; // !

  bookAppointmentFromCalendar = () => {
    this.props.gotoTabAppointment();
    this.setState(
      Object.assign(initState, {
        isBookingFromAppointmentTab: true, // book appointment from calendar
      })
    );
    this.props.actions.appointment.resetGroupAppointment();
  }; // !

  setSelectStaffFromCalendar = async (staffId, isFirstPressCheckout = null) => {
    await this.setState({
      selectedStaff: { staffId },
      isShowCategoriesColumn: true,
      isBookingFromAppointmentTab: true, // book appointment from calendar
    });

    this.scrollFlatListToStaffIndex(staffId, isFirstPressCheckout);
  }; // !

  setBlockStateFromCalendar = async (staffId) => {
    await this.setState({
      isShowCategoriesColumn: true,
      isBlockBookingFromCalendar: staffId && staffId > 0 ? false : true,
      isBookingFromAppointmentTab: true, // book appointment from calendar
    });
  }; // !

  setStatusIsCheckout = (status) => {
    this.setState({
      isGotoCheckout: status,
      isBookingFromAppointmentTab: !status, // book appointment from calendar
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    const {
      isLoadingGetBlockAppointment,
      blockAppointments,
      isLoadingRemoveBlockAppointment,
      startProcessingPax,
      isCreditPaymentToServer,
    } = this.props;


    if (
      blockAppointments.length > 0 &&
      prevProps.isLoadingRemoveBlockAppointment !=
        isLoadingRemoveBlockAppointment &&
      !isLoadingRemoveBlockAppointment
    ) {
      this.updateBlockAppointmentRef();
    }

    if (
      blockAppointments.length > 0 &&
      prevProps.isLoadingGetBlockAppointment != isLoadingGetBlockAppointment &&
      !isLoadingGetBlockAppointment
    ) {
      this.setBlockToggleCollaps();
    }

    if (
      startProcessingPax &&
      prevProps.startProcessingPax !== startProcessingPax
    ) {
      this.props.actions.appointment.resetStateCheckCreditPaymentToServer(
        false
      );
      this.sendTransactionToPaymentMachine();
    }

    if (
      isCreditPaymentToServer &&
      prevProps.isCreditPaymentToServer !== isCreditPaymentToServer
    ) {
      //get fail check credit card payment to server
      this.handleCheckCreditCardFail();
    }
  }

  handleCheckCreditCardFail() {
    const {
      lastTransactionAppointmentId,
      groupAppointment,
      amountCredtitForSubmitToServer,
      errorMessage,
      paymentMachineType,
      lastGroupAppointmentPay,
    } = this.props;
    if (
      lastTransactionAppointmentId &&
      paymentMachineType == PaymentTerminalType.Dejavoo
    ) {
      this.setState({
        visibleProcessingCredit: true,
      });
      const param = {
        RefId: lastTransactionAppointmentId,
      };
      requestPreviousTransactionReportDejavoo(param).then((response) => {
        parseString(response, (err, result) => {
          if (l.get(result, "xmp.response.0.Message.0") == "Approved") {
            const invNum = l.get(result, "xmp.response.0.InvNum.0");
            //check if current groupAppointment is failed groupAppointment before.
            if (invNum == groupAppointment.checkoutGroupId) {
              this.handleResponseCreditCardDejavoo(
                response,
                true,
                amountCredtitForSubmitToServer,
                null
              );
            } else {
              this.setState({
                visibleProcessingCredit: false,
                visibleErrorMessageFromPax: true,
                errorMessageFromPax: errorMessage,
              });
            }
          } else {
            //if not found transaction on dejavoo
            //check previous group appointment is current group appointment
            //call payment on dejavoo again
            if (
              groupAppointment?.checkoutGroupId ==
              lastGroupAppointmentPay?.checkoutGroupId
            ) {
              this.props.actions.appointment.resetStateCheckCreditPaymentToServer(
                false
              );
              this.sendTransactionToPaymentMachine();
            } else {
              //If it's not previous group appointment that create
              // transaction payAppointmentId, show error
              this.setState({
                visibleProcessingCredit: false,
                visibleErrorMessageFromPax: true,
                errorMessageFromPax: errorMessage,
              });
            }
          }
        });
      });
    } else {
      this.setState({
        visibleProcessingCredit: false,
        visibleErrorMessageFromPax: true,
        errorMessageFromPax: errorMessage,
      });
    }
  }

  componentDidMount() {
    const { categoryStaffId, staffIdSelected } = this.props;
    if (staffIdSelected) {
      this.setSelectStaffFromCalendar(staffIdSelected, true);
    }
    if (categoryStaffId) {
      this.getCategory(categoryStaffId);
    }

    this.registerEvents();
  }

  componentWillUnmount() {
    // console.log("tab check out componentWillUnmount");
    this.unregisterEvents();
  }

  // FUNCTIONS FOR CLOVER
  doPrintClover(imageUri) {
    this.isProcessPrintClover = true;
    const { cloverMachineInfo } = this.props;
    const port = l.get(cloverMachineInfo, "port")
      ? l.get(cloverMachineInfo, "port")
      : 80;
    const url = `wss://${l.get(cloverMachineInfo, "ip")}:${port}/remote_pay`;

    const printInfo = {
      imageUri,
      url,
      remoteAppId: REMOTE_APP_ID,
      appName: APP_NAME,
      posSerial: POS_SERIAL,
      token: l.get(cloverMachineInfo, "token")
        ? l.get(cloverMachineInfo, "token", "")
        : "",
    };
    clover.doPrintWithConnect(printInfo);
    this.isProcessPrintClover = false;
  }

  async handleResponseCreditCardForCloverSuccess(message) {
    const {
      profile,
      payAppointmentId,
      amountCredtitForSubmitToServer,
      cloverMachineInfo,
    } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });
    let messageUpdate = {
      ...message,
      sn: l.get(cloverMachineInfo, "serialNumber"),
    };
    try {
      this.props.actions.appointment.submitPaymentWithCreditCard(
        profile?.merchantId || 0,
        JSON.stringify(messageUpdate),
        payAppointmentId,
        amountCredtitForSubmitToServer,
        "clover"
      );
    } catch (error) {}
  } // !

  async handleResponseCreditCardForCloverFailed(errorMessage) {
    const { profile, payAppointmentId } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });
    try {
      if (payAppointmentId) {
        this.props.actions.appointment.cancelHarmonyPayment(
          payAppointmentId,
          "transaction fail",
          errorMessage
        );
      }

      setTimeout(() => {
        this.setState({
          visibleErrorMessageFromPax: true,
          errorMessageFromPax: errorMessage,
        });
      }, 300);
    } catch (error) {}
  } // !

  confirmPaymentClover = () => {
    clover.confirmPayment();
    this.setState({
      visibleProcessingCredit: true,
      visibleConfirmPayment: false,
    });
  };

  rejectPaymentClover = () => {
    clover.rejectPayment();
    this.setState({
      visibleConfirmPayment: false,
    });
  };

  registerEvents() {
    const { language } = this.props;
    clover.changeListenerStatus(true);
    this.subscriptions = [
      this.eventEmitter.addListener("paymentSuccess", (data) => {
        // console.log("paymentSuccess");
        this.isProcessPaymentClover = false;
        this.handleResponseCreditCardForCloverSuccess(data);
      }),
      this.eventEmitter.addListener("paymentFail", (data) => {
        this.isProcessPaymentClover = false;
        this.handleResponseCreditCardForCloverFailed(
          l.get(data, "errorMessage")
        );
      }),
      this.eventEmitter.addListener("pairingCode", (data) => {
        if (data) {
          const text = `Pairing code: ${l.get(data, "pairingCode")}`;
          if (this.isProcessPaymentClover) {
            this.setState({
              visibleProcessingCredit: false,
            });
          }
          if (this.isProcessPrintClover) {
            this.setState({
              visiblePrintInvoice: false,
            });
          }
        }
      }),
      this.eventEmitter.addListener("pairingSuccess", (data) => {
        if (this.isProcessPaymentClover) {
          this.setState({
            visibleProcessingCredit: true,
          });
        }
      }),
      this.eventEmitter.addListener("confirmPayment", () => {
        this.setState({
          visibleProcessingCredit: false,
          visibleConfirmPayment: true,
        });
      }),
      this.eventEmitter.addListener("printInProcess", () => {}),

      this.eventEmitter.addListener("deviceDisconnected", () => {
        if (this.isProcessPaymentClover) {
          this.isProcessPaymentClover = false;
          this.handleResponseCreditCardForCloverFailed(
            localize("No connected device", language)
          );
          clover.cancelTransaction();
        }
        if (this.isProcessPrintClover) {
          this.isProcessPrintClover = false;
          this.setState({
            visiblePrintInvoice: false,
          });
        }
      }),
    ];
  } // !

  unregisterEvents() {
    // clover.changeListenerStatus(false);
    this.subscriptions.forEach((e) => e.remove());
    this.subscriptions = [];
  } // !

  printTemptInvoice = async () => {
    await this.invoiceRef.current?.show({
      isPrintTempt: true,
      isAppointmentTab: false,
    });
  };

  shareTemptInvoice = async () => {
    await this.invoiceRef.current?.share({
      isPrintTempt: true,
      isAppointmentTab: false,
    });
  };

  cancelInvoice = async () => {
    await this.setState({
      visibleInvoice: false,
    });
  };

  showCustomServiceAmount = (itemService) => {
    const { selectedStaff } = this.state;
    this.setState({
      productSeleted: null,
      isShowColAmount: false,
      arrSelectedExtra: [],
      customServiceSelected: null,
    });
    this.popupEnterAmountCustomServiceRef.current?.showPopup(
      selectedStaff,
      itemService
    );
  }; // !

  submitAddCustomService = (params) => {
    this.setState(
      {
        customServiceSelected: params,
      },
      () => {
        this.addAmount();
      }
    );
  };

  onCodePayPaidAppointment = () => {};
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  token: state.dataLocal.token,
  categoriesByMerchant: state.category.categoriesByMerchant,
  productsByMerchantId: state.product.productsByMerchantId,
  servicesByMerchant: state.service.servicesByMerchant,
  appointmentDetail: state.appointment.appointmentDetail,
  loading: state.app.loading,
  isGetAppointmentSucces: state.appointment.isGetAppointmentSucces,
  profile: state.dataLocal.profile,
  isDonePayment: state.appointment.isDonePayment,
  connectionSignalR: state.appointment.connectionSignalR,
  flagSignInAppointment: state.appointment.flagSignInAppointment,
  paxMachineInfo: state.hardware.paxMachineInfo,
  extrasByMerchant: state.extra.extrasByMerchant,
  listStaffByMerchant: state.staff.listStaffByMerchant,
  profileStaffLogin: state.dataLocal.profileStaffLogin,
  isOfflineMode: state.network.isOfflineMode,
  groupAppointment: state.appointment.groupAppointment,
  visiblePopupPaymentDetails: state.appointment.visiblePopupPaymentDetails,
  paymentDetailInfo: state.appointment.paymentDetailInfo,
  visibleChangeMoney: state.appointment.visibleChangeMoney,
  payAppointmentId: state.appointment.payAppointmentId,
  isCancelAppointment: state.appointment.isCancelAppointment,
  webviewRef: state.appointment.webviewRef,
  appointmentIdOffline: state.appointment.appointmentIdOffline,
  deviceId: state.dataLocal.deviceId,
  blockAppointments: state.appointment.blockAppointments,
  isLoadingGetBlockAppointment: state.appointment.isLoadingGetBlockAppointment,
  isOpenBlockAppointmentId: state.appointment.isOpenBlockAppointmentId,
  isLoadingRemoveBlockAppointment:
    state.appointment.isLoadingRemoveBlockAppointment,
  idNextToAppointmentRemove: state.appointment.idNextToAppointmentRemove,
  fromTimeBlockAppointment: state.appointment.fromTimeBlockAppointment,
  versionApp: state.dataLocal.versionApp,
  customerInfoBuyAppointment: state.appointment.customerInfoBuyAppointment,
  bookingGroupId: state.appointment.bookingGroupId,
  printerSelect: state.dataLocal.printerSelect,
  printerList: state.dataLocal.printerList,
  visiblePopupCheckDiscountPermission:
    state.marketing.visiblePopupCheckDiscountPermission,
  isTipOnPaxMachine: state.dataLocal.isTipOnPaxMachine,
  startProcessingPax: state.appointment.startProcessingPax,
  paxAmount: state.appointment.paxAmount,
  amountCredtitForSubmitToServer:
    state.appointment.amountCredtitForSubmitToServer,
  bluetoothPaxInfo: state.dataLocal.bluetoothPaxInfo,
  staffListCurrentDate: state.appointment.staffListCurrentDate,
  visibleAddEditCustomerPopup: state.appointment.visibleAddEditCustomerPopup,
  appointmentIdBookingFromCalendar:
    state.appointment.appointmentIdBookingFromCalendar,
  isBookingFromCalendar: state.appointment.isBookingFromCalendar,
  isCancelPayment: state.appointment.isCancelPayment,
  cloverMachineInfo: state.hardware.cloverMachineInfo,
  dejavooMachineInfo: state.hardware.dejavooMachineInfo,
  paymentMachineType: state.hardware.paymentMachineType,
  customService: state.service.customService,
  isCreditPaymentToServer: state.appointment.isCreditPaymentToServer,
  lastTransactionAppointmentId: state.appointment.lastTransactionAppointmentId,
  lastGroupAppointmentPay: state.appointment.lastGroupAppointmentPay,
  errorMessage: state.appointment.errorMessage,
  visibleDisconnect: state.app.visibleDisconnect,
});

export default connectRedux(mapStateToProps, TabCheckout);
