import React from 'react';
import _ from 'ramda';
const signalR = require('@microsoft/signalr');
import { NativeModules, Platform } from 'react-native';
import env from 'react-native-config';
import BleManager from 'react-native-ble-manager';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
  getArrayProductsFromAppointment,
  getArrayServicesFromAppointment,
  getArrayExtrasFromAppointment,
  formatNumberFromCurrency,
  getStaffInfoById,
  formatWithMoment,
  getInfoFromModelNameOfPrinter,
  getArrayGiftCardsFromAppointment,
} from '@utils';
import PrintManager from '@lib/PrintManager';
import Configs from '@configs';
import initState from './widget/initState';

const PosLink = NativeModules.payment;
const PoslinkAndroid = NativeModules.PoslinkModule;

class OrderCheckout extends Layout {
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
    this.productDetailModalRef = React.createRef();
  }

  resetStateFromParent = async () => {
    await this.setState(initState);
  };

  getDataColProduct() {
    const { categorySelected, categoryTypeSelected } = this.state;
    const { productsByMerchantId, servicesByMerchant, extrasByMerchant } =
      this.props;
    if (categoryTypeSelected === 'Extra') {
      const dataExtra = extrasByMerchant.filter((extra, index) => {
        return extra?.isDisabled === 0;
      });
      return dataExtra;
    } else {
      const data =
        categoryTypeSelected === 'Service'
          ? servicesByMerchant
          : productsByMerchantId;
      if (data?.length > 0) {
        const temptData = data.filter((item) => {
          return (
            item?.categoryId === categorySelected?.categoryId &&
            item?.isDisabled === 0
          );
        });
        return temptData;
      } else {
        return [];
      }
    }
  }

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
    } = this.state;

    // -------------  Group Appointment  ------------
    if (!_.isEmpty(groupAppointment)) {
      const appointments = groupAppointment?.appointments || [];
      const mainAppointmentId = groupAppointment?.mainAppointmentId || 0;
      let body = {};
      // -------------  Add Product  ------------
      if (categoryTypeSelected === 'Product') {
        body = {
          services: [],
          extras: [],
          products: [
            {
              productId: productSeleted.productId,
              quantity: this.amountRef.current?.state.quanlity,
            },
          ],
          giftCards: [],
        };
      } else {
        //  -------------Add Extra , Service ---------
        const mainAppointment = appointments.find(
          (appointment) => appointment.appointmentId === mainAppointmentId,
        );
        const temptExtra = [];
        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
        }

        body = {
          services: [
            {
              serviceId: productSeleted.serviceId,
              // staffId: mainAppointment?.staff?.staffId || profileStaffLogin.staffId,
              staffId: selectedStaff?.staffId,
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
          mainAppointmentId,
        );
      } else {
        this.props.actions.appointment.addItemIntoAppointment(
          body,
          mainAppointmentId,
          true,
        );
      }
    }
    // ------------- Create  Group Appointment  ------------
    else {
      // -------------  Add Product  ------------
      if (categoryTypeSelected === 'Product') {
        const temptBasket = [];
        temptBasket.unshift({
          type: 'Product',
          id: `${productSeleted.productId}_pro`,
          data: {
            name: productSeleted?.name || '',
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
          },
        );
      } else {
        //  -------------Add Extra , Service ---------
        const temptBasket = [];
        temptBasket.unshift({
          type: 'Service',
          id: `${productSeleted.serviceId}_ser`,
          data: {
            name: productSeleted.name,
            serviceId: productSeleted.serviceId,
            price: productSeleted.price,
          },
          serviceName: productSeleted.name,
          staff: {
            staffId: profileStaffLogin.staffId,
            imageUrl: profileStaffLogin.imageUrl,
            displayName: profileStaffLogin.displayName,
            tip: 0.0,
          },
        });

        for (let i = 0; i < arrSelectedExtra.length; i++) {
          temptBasket.unshift({
            type: 'Extra',
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
          },
        );
      }
    }

    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: '',
      },
      productSeleted: {
        name: '',
      },
      categoryTypeSelected: '',
      arrSelectedExtra: [],
    });
  };

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
      formatNumberFromCurrency(this.modalBillRef.current?.state.quality),
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
      customerInfoBuyAppointment?.firstName || '',
      customerInfoBuyAppointment?.lastName || '',
      customerInfoBuyAppointment?.phone || '',
      moneyUserGiveForStaff,
      false,
      false,
    );

    await this.setState({
      basket: [],
      customDiscountPercentLocal: 0,
      customDiscountFixedLocal: 0,
    });
  };

  getPriceOfline(basket) {
    let total = 0;
    for (let i = 0; i < basket.length; i++) {
      if (basket[i].type === 'Product') {
        total =
          total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
      } else {
        total = total + formatNumberFromCurrency(basket[i].data.price);
      }
    }
    return total;
  }

  calculateTotalTaxLocal(basket) {
    const { profile } = this.props;
    const taxService = profile.taxService
      ? formatNumberFromCurrency(profile.taxService)
      : 0;
    const taxProduct = profile.taxProduct
      ? formatNumberFromCurrency(profile.taxProduct)
      : 0;
    let taxTotal = 0;
    for (let i = 0; i < basket.length; i++) {
      if (basket[i].type === 'Product') {
        taxTotal =
          taxTotal +
          (parseFloat(basket[i].data.price) *
            basket[i].quanlitySet *
            taxProduct) /
            100;
      } else if (basket[i].type === 'Service') {
        taxTotal =
          taxTotal +
          (formatNumberFromCurrency(basket[i].data.price) * taxService) / 100;
      }
    }
    return Number(taxTotal).toFixed(2);
  }

  removeItemBasket = (item) => {
    const { blockAppointments } = this.props;
    const { basket } = this.state;

    alert(JSON.stringify(item));
  };

  selectedPayment = async (payment) => {
    const { paymentSelected, changeButtonDone } = this.state;
    const { isDonePayment } = this.props;
    if (
      changeButtonDone &&
      !isDonePayment &&
      paymentSelected === 'HarmonyPay'
    ) {
    } else {
      this.setState(
        (prevState) => ({
          paymentSelected: payment === prevState.paymentSelected ? '' : payment,
        }),
        () => {
          if (this.state.paymentSelected === 'Gift Card') {
            this.activeGiftCardRef.current?.setStateFromParent();
            this.props.actions.appointment.handleVisibleActiveGiftCard();
          }
        },
      );
    }
  };

  showColAmount = (item) => {
    const { selectedSubCategory } = this.state;
    let isExist =
      selectedSubCategory?.categoryId === item?.categoryId ? true : false;
    this.setState({
      selectedSubCategory: isExist ? {} : item,
      isShowColAmount: !isExist,
      arrSelectedExtra: [],
    });
  };

  getProductsBySubCategoryId = () => {
    const { productsByMerchantId } = this.props;
    const { selectedSubCategory } = this.state;
    const productsBySubCategoryId = productsByMerchantId.filter(
      (product) => product?.categoryId === selectedSubCategory?.categoryId,
    );

    return productsBySubCategoryId;
  };

  onPressSelectExtra = async (extra) => {
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
        (selectedExtra) => selectedExtra?.extraId !== extra?.extraId,
      );
    } else {
      tempArrSelectedExtra = [...arrSelectedExtra];
      tempArrSelectedExtra.push(extra);
    }

    this.productDetailModalRef?.current?.setStateFromParent(extra);
    this.props.actions.orderRetail.switchProductDetailPopupRetail(true);
    await this.setState({
      arrSelectedExtra: tempArrSelectedExtra,
      // visibleProductDetailModal: true
    });
  };

  closeProductDetailModal = () => {
    this.props.actions.orderRetail.switchProductDetailPopupRetail(false);
    this.setState({
      // visibleProductDetailModal: false,
      arrSelectedExtra: [],
    });
  };

  addProductInfoToBasket = (
    productInfo,
    selectedColor,
    selectedSize,
    amount,
  ) => {
    const { productDetailRetail } = this.props;
    const productDetailRetailId = productDetailRetail?.id || 0;
    const body = {
      products: [
        {
          productId: productInfo?.productId,
          quantity: amount,
          options: [
            {
              itemAttributeId: 0,
              value: { selectedColor, selectedSize },
            },
          ],
        },
      ],
      customerId: 0,
      purchasePoint: '',
    };
    if (productDetailRetailId) {
      this.props.actions.orderRetail.addItemIntoTempAppointmentRetail(
        {
          productId: productInfo?.productId,
          quantity: amount,
          options: [
            {
              itemAttributeId: 0,
              value: { selectedColor, selectedSize },
            },
          ],
        },
        productDetailRetailId,
      );
    } else {
      this.props.actions.orderRetail.createTempAppointmentRetail(body);
    }
  };

  selectPayment = () => {
    this.scrollTabRef.current?.goToPage(1);
  };

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
    this.props.actions.appointment.resetBasketEmpty();
    this.props.actions.appointment.resetPayment();
    this.props.actions.appointment.changeFlagSigninAppointment(false);
    this.props.actions.appointment.resetGroupAppointment();

    if (isCancelAppointment) {
      const mainAppointmentId = groupAppointment.mainAppointmentId
        ? groupAppointment.mainAppointmentId
        : 0;
      const customerId = customerInfoBuyAppointment.customerId
        ? customerInfoBuyAppointment.customerId
        : 0;
      this.props.actions.appointment.cancleAppointment(
        mainAppointmentId,
        profile.merchantId,
        customerId,
      );
    }

    if (appointmentIdBookingFromCalendar) {
      const customerId = customerInfoBuyAppointment.customerId
        ? customerInfoBuyAppointment.customerId
        : 0;
      this.props.actions.appointment.cancleAppointment(
        appointmentIdBookingFromCalendar,
        profile.merchantId,
        customerId,
      );
    }

    if (temptBlockAppointments && temptBlockAppointments.length > 0) {
      for (let i = 0; i < temptBlockAppointments.length; i++) {
        this.props.actions.appointment.cancleAppointment(
          temptBlockAppointments[i].appointmentId,
          profile.merchantId,
          0,
          true,
          true,
        );
      }
    }

    this.blockAppointmentRef = [];
  };

  setStateFromParent = () => {
    this.setState(initState);
  };

  getPaymentString(type) {
    let method = '';
    switch (type) {
      case 'HarmonyPay':
        method = 'harmony';
        break;
      case 'Cash':
        method = 'cash';
        break;
      case 'Credit Card':
        method = 'credit_card';
        break;
      case 'Debit Card':
        method = 'credit_card';
        break;
      case 'Gift Card':
        method = 'giftcard';
        break;
      case 'Other':
        method = 'other';
        break;
      default:
        method = '';
    }
    return method;
  }

  getBasketOffline = () => {
    const { basket, selectedStaff } = this.state;

    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    for (let i = 0; i < basket.length; i++) {
      if (basket[i].type === 'Product') {
        arrayProductBuy.push({
          ...basket[i],
          productId: basket[i].data.productId,
          quantity: basket[i].quanlitySet,
        });
      } else if (basket[i].type === 'Service') {
        arryaServicesBuy.push({
          ...basket[i],
          serviceId: basket[i].data.serviceId,
          staffId: selectedStaff?.staffId,
          tipAmount: 0,
        });
      } else if (basket[i].type === 'Extra') {
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
  };

  getBasketOnline = (appointments) => {
    const arrayProductBuy = [];
    const arryaServicesBuy = [];
    const arrayExtrasBuy = [];
    const arrayGiftCards = [];
    const promotionNotes = [];
    appointments.forEach((appointment) => {
      const note = appointment?.promotionNotes?.note || '';
      if (note) {
        promotionNotes.push(note);
      }
      // ------ Push Service -------
      appointment.services.forEach((service) => {
        arryaServicesBuy.push({
          type: 'Service',
          data: {
            name: service?.serviceName || '',
            price: service?.price || '',
          },
          staff: service?.staff || false,
          note: service?.note || '',
        });
      });

      // ------ Push Product -------
      appointment.products.forEach((product) => {
        arrayProductBuy.push({
          type: 'Product',
          data: {
            name: product?.productName || '',
            price: product?.price || '',
          },
          quanlitySet: product?.quantity || '',
        });
      });

      // ------ Push Product -------
      appointment.extras.forEach((extra) => {
        arrayExtrasBuy.push({
          type: 'Extra',
          data: {
            name: extra?.extraName || '',
            price: extra?.price || '',
          },
        });
      });

      // ------ Push Gift Card -------
      appointment.giftCards.forEach((gift) => {
        arrayGiftCards.push({
          type: 'GiftCards',
          data: {
            name: gift?.name || 'Gift Card',
            price: gift?.price || '',
          },
          quanlitySet: gift?.quantity || '',
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

  pushAppointmentIdOfflineIntoWebview = () => {
    if (this.props.isOfflineMode) {
      this.props.pushAppointmentIdOfflineIntoWebview();
    }
  };

  donotPrintBill = async () => {
    this.props.pushAppointmentIdOfflineIntoWebview();
    const { connectionSignalR } = this.props;
    const { paymentSelected } = this.state;
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
    if (paymentSelected === 'Cash' || paymentSelected === 'Other') {
      const { printerSelect, printerList } = this.props;
      const { portName } = getInfoFromModelNameOfPrinter(
        printerList,
        printerSelect,
      );

      if (portName) {
        this.openCashDrawer(portName);
        this.scrollTabRef.current?.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
      } else {
        this.scrollTabRef.current?.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();

        setTimeout(() => {
          alert('Please connect to your cash drawer.');
        }, 700);
      }
    } else {
      this.scrollTabRef.current?.goToPage(0);
      this.props.actions.appointment.closeModalPaymentCompleted();
      this.props.gotoAppoitmentScreen();
      this.props.actions.appointment.resetBasketEmpty();
      this.setState(initState);
      this.props.actions.appointment.resetPayment();
    }
  };

  showInvoicePrint = async (printMachine, isTemptPrint = true) => {
    // -------- Pass data to Invoice --------
    this.props.actions.appointment.closeModalPaymentCompleted();
    const { groupAppointment, isOfflineMode } = this.props;
    const {
      subTotalLocal,
      tipLocal,
      discountTotalLocal,
      taxLocal,
      paymentSelected,
    } = this.state;
    const appointments = groupAppointment?.appointments || [];
    const {
      arryaServicesBuy,
      arrayProductBuy,
      arrayExtrasBuy,
      arrayGiftCards,
      promotionNotes,
    } = this.getBasketOnline(appointments);
    const basket = isOfflineMode
      ? this.state.basket
      : arryaServicesBuy.concat(
          arrayExtrasBuy,
          arrayProductBuy,
          arrayGiftCards,
        );
    const tipAmount = groupAppointment?.tipAmount || 0;
    const subTotal = groupAppointment?.subTotal || 0;
    const discount = groupAppointment?.discount || 0;
    const tax = groupAppointment?.tax || 0;
    const total = groupAppointment?.total || 0;

    const temptSubTotal = _.isEmpty(groupAppointment)
      ? subTotalLocal
      : subTotal;
    const temptTotal = _.isEmpty(groupAppointment)
      ? Number(
          formatNumberFromCurrency(subTotalLocal) +
            formatNumberFromCurrency(tipLocal) +
            formatNumberFromCurrency(taxLocal) -
            formatNumberFromCurrency(discountTotalLocal),
        ).toFixed(2)
      : total;
    const temptDiscount = _.isEmpty(groupAppointment)
      ? discountTotalLocal
      : discount;
    const temptTip = _.isEmpty(groupAppointment) ? tipLocal : tipAmount;
    const temptTax = _.isEmpty(groupAppointment) ? taxLocal : tax;

    this.invoicePrintRef.current?.setStateFromParent(
      basket,
      temptSubTotal,
      temptTax,
      temptDiscount,
      temptTip,
      temptTotal,
      paymentSelected,
      isTemptPrint,
      printMachine,
      promotionNotes.join(','),
    );
    await this.setState({
      visiblePrintInvoice: true,
    });
  };

  cancelInvoicePrint = async (isPrintTempt) => {
    await this.setState({ visiblePrintInvoice: false });
    if (!isPrintTempt) {
      this.scrollTabRef.current?.goToPage(0);
      this.props.gotoAppoitmentScreen();
      this.props.actions.appointment.resetBasketEmpty();
      this.setState(initState);
      this.props.actions.appointment.resetPayment();
    }
  };

  printBill = async () => {
    this.pushAppointmentIdOfflineIntoWebview();
    const { printerSelect, printerList } = this.props;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect,
    );
    if (portName) {
      const { paymentSelected } = this.state;
      const { connectionSignalR } = this.props;
      if (!_.isEmpty(connectionSignalR)) {
        connectionSignalR.stop();
      }
      if (paymentSelected === 'Cash' || paymentSelected === 'Other') {
        this.openCashDrawer(portName);
      }
      this.showInvoicePrint(portName, false);
    } else {
      alert('Please connect to your printer!');
    }
  };

  printTemptInvoice = async () => {
    const { printerSelect, printerList } = this.props;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect,
    );
    if (portName !== '') {
      this.showInvoicePrint(portName);
    } else {
      alert('Please connect to your printer! ');
    }
  };

  checkStatusCashier = async () => {
    const { printerSelect, printerList } = this.props;
    const { portName } = getInfoFromModelNameOfPrinter(
      printerList,
      printerSelect,
    );
    if (portName) {
      this.openCashDrawer(portName);
    } else {
      alert('Please connect to your cash drawer.');
    }
  };

  openCashDrawer = async (portName) => {
    await PrintManager.getInstance().openCashDrawer(portName);
  };

  handleHarmonyPayment = async (checkoutPaymentInfo) => {
    await this.setState({
      changeButtonDone: false,
      isCancelHarmonyPay: false,
      paymentSelected: '',
    });

    const dueAmount =
      checkoutPaymentInfo && checkoutPaymentInfo.dueAmount
        ? parseFloat(checkoutPaymentInfo.dueAmount).toFixed(2)
        : 0;
    this.props.actions.appointment.updatePaymentInfoByHarmonyPayment(
      checkoutPaymentInfo,
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
    moneyUserGiveForStaff,
  ) {
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${Configs.SOCKET_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app&deviceId=${deviceId}&token=${token}`,
          {
            transport:
              signalR.HttpTransportType.LongPolling |
              signalR.HttpTransportType.WebSockets,
          },
        )
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.on('ListWaNotification', (data) => {
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
            moneyUserGiveForStaff,
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
            formatNumberFromCurrency(discountTotalLocal),
        ).toFixed(2);
        this.modalBillRef.current?.setStateFromParent(`${temptTotal}`);
      } else {
        const temptTotal = _.isEmpty(groupAppointment)
          ? Number(
              formatNumberFromCurrency(subTotalLocal) +
                formatNumberFromCurrency(tipLocal) +
                formatNumberFromCurrency(taxLocal) -
                formatNumberFromCurrency(discountTotalLocal),
            ).toFixed(2)
          : groupAppointment.total;
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
        fromTime !== ''
          ? fromTime
          : formatWithMoment(new Date(), 'MM/DD/YYYY hh:mm A'),
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
        appointmentOfflineMode,
      );
    }
  }

  payBasket = async () => {
    const { paymentSelected } = this.state;
    const { groupAppointment, isOfflineMode, paymentDetailInfo } = this.props;
    const method = this.getPaymentString(paymentSelected);

    if (isOfflineMode && method === 'harmony') {
      this.scrollTabRef.current?.goToPage(2);
      this.addAppointmentOfflineMode(true);
      return;
    }

    if (
      isOfflineMode &&
      (method === 'credit_card' || method === 'debit_card')
    ) {
      alert('Not Support Offline Mode');
      return;
    }

    if (method === 'harmony' && _.isEmpty(groupAppointment)) {
      this.popupSendLinkInstallRef.current?.setStateFromParent('');
      this.setState({
        visibleSendLinkPopup: true,
      });
    } else {
      if (method === 'harmony' || method === 'credit_card') {
        const dueAmount = paymentDetailInfo?.dueAmount || 0;
        this.modalBillRef?.current?.setStateFromParent(`${dueAmount}`);
      }

      await this.setState({
        visibleBillOfPayment: true,
      });
      // if (method === 'harmony' || method === 'credit_card') {
      //     const dueAmount = parseFloat(formatNumberFromCurrency(paymentDetailInfo?.dueAmount || 0));
      //     this.doneBill(dueAmount);
      // } else {
      //     await this.setState({
      //         visibleBillOfPayment: true
      //     });
      // }
    }
  };

  cancelHarmonyPayment = async () => {
    await this.setState({
      changeButtonDone: false,
      isCancelHarmonyPay: false,
      paymentSelected: '',
    });
    const { connectionSignalR, payAppointmentId } = this.props;

    if (payAppointmentId) {
      this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
    }
    if (!_.isEmpty(connectionSignalR)) {
      connectionSignalR.stop();
    }
  };

  backAddBasket = async () => {
    this.cancelHarmonyPayment();
    this.scrollTabRef.current?.goToPage(0);
  };

  handlePaymentOffLineMode = async () => {
    const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } =
      this.state;
    const moneyUserGiveForStaff = parseFloat(
      formatNumberFromCurrency(this.modalBillRef.current?.state.quality),
    );
    const totalLocal = Number(
      formatNumberFromCurrency(subTotalLocal) +
        formatNumberFromCurrency(tipLocal) +
        formatNumberFromCurrency(taxLocal) -
        formatNumberFromCurrency(discountTotalLocal),
    ).toFixed(2);

    if (moneyUserGiveForStaff == 0) {
      alert('Enter amount!');
    } else if (moneyUserGiveForStaff - totalLocal < 0) {
      alert('Payment amount must be greater : ' + totalLocal);
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
            formatNumberFromCurrency(this.modalBillRef.current?.state.quality),
          );
    const method = this.getPaymentString(paymentSelected);
    const total = groupAppointment.total
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
      alert('Enter amount!');
    } else if (
      (method === 'harmony' ||
        method === 'credit_card' ||
        method === 'debit_card') &&
      moneyUserGiveForStaff > dueAmount
    ) {
      alert('The change not bigger than total money!');
    } else {
      await this.setState({
        visibleBillOfPayment: false,
      });

      this.modalBillRef.current?.setStateFromParent(`0`);
      if (!_.isEmpty(groupAppointment)) {
        if (method === 'harmony') {
          this.props.actions.app.loadingApp();
          this.setupSignalR(
            profile,
            token,
            groupAppointment.checkoutGroupId,
            deviceId,
            method,
            moneyUserGiveForStaff,
          );
        } else if (method === 'credit_card' || method === 'debit_card') {
          if (paxMachineInfo.isSetup) {
            if (moneyUserGiveForStaff == 0) {
              alert('Enter amount!');
            } else {
              this.hanleCreditCardProcess(true, moneyUserGiveForStaff);
            }
          } else {
            setTimeout(() => {
              alert('Please connect your Pax to take payment.');
            }, 300);
          }
        } else if (method === 'giftcard') {
          setTimeout(() => {
            alert('giftcard');
          }, 500);
        } else {
          this.props.actions.appointment.paymentAppointment(
            groupAppointment.checkoutGroupId,
            method,
            moneyUserGiveForStaff,
          );
        }
      } else {
        // ------ Handle Buy at store -------
        if (method === 'credit_card' || method === 'debit_card') {
          this.hanleCreditCardProcess(false, moneyUserGiveForStaff);
        } else if (method === 'harmony') {
          this.popupSendLinkInstallRef.current?.setStateFromParent('');
          this.setState({
            visibleSendLinkPopup: true,
          });
        } else {
          // const dataAnymousAppoitment = this.getBasketOffline();
          // const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy } = dataAnymousAppoitment;
          // this.props.actions.appointment.createAnymousAppointment(
          //     profile.merchantId,
          //     customerInfoBuyAppointment?.userId || 0,
          //     customerInfoBuyAppointment?.customerId || 0,
          //     // profileStaffLogin.staffId,
          //     this.state.selectedStaff?.staffId,
          //     arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
          //     customDiscountFixedLocal, customDiscountPercentLocal,
          //     customerInfoBuyAppointment?.firstName || "",
          //     customerInfoBuyAppointment?.lastName || "",
          //     customerInfoBuyAppointment?.phone || "",
          //     moneyUserGiveForStaff
          // );
        }
      }
    }
  };

  async hanleCreditCardProcess(online = true, moneyUserGiveForStaff) {
    const { paxMachineInfo, isTipOnPaxMachine } = this.props;
    const { paymentSelected } = this.state;
    const { ip, port, timeout } = paxMachineInfo;
    const moneyCreditCard = Number(
      formatNumberFromCurrency(moneyUserGiveForStaff) * 100,
    ).toFixed(2);
    const tenderType = paymentSelected === 'Credit Card' ? 'CREDIT' : 'DEBIT';

    if (Platform.OS === 'android') {
      // 1. Show modal processing
      await this.setState({
        visibleProcessingCredit: true,
      });
      setTimeout(() => {
        PoslinkAndroid.sendTransaction(
          ip,
          port,
          '',
          tenderType,
          `${parseInt(moneyCreditCard)}`,
          'SALE',
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
          },
        );
      }, 100);
    } else {
      const { groupAppointment } = this.props;
      this.props.actions.appointment.checkCreditPaymentToServer(
        groupAppointment?.checkoutGroupId || 0,
        moneyUserGiveForStaff,
        moneyCreditCard,
      );
    }
  }

  sendTransToPaxMachine = async () => {
    const {
      paxMachineInfo,
      isTipOnPaxMachine,
      paxAmount,
      amountCredtitForSubmitToServer,
      bluetoothPaxInfo,
    } = this.props;
    const { paymentSelected } = this.state;
    const { name, ip, port, timeout, commType, bluetoothAddr, isSetup } =
      paxMachineInfo;
    const tenderType = paymentSelected === 'Credit Card' ? 'CREDIT' : 'DEBIT';

    // 1. Show modal processing
    await this.setState({
      visibleProcessingCredit: true,
    });

    const tempIpPax = commType == 'TCP' ? ip : '';
    const tempPortPax = commType == 'TCP' ? port : '';
    const idBluetooth = commType === 'TCP' ? '' : bluetoothAddr;
    const extData = isTipOnPaxMachine ? '<TipRequest>1</TipRequest>' : '';

    // 2. Send Trans to pax
    PosLink.sendTransaction(
      {
        tenderType: tenderType,
        transType: 'SALE',
        amount: `${parseFloat(paxAmount)}`,
        transactionId: '1',
        extData: extData,
        commType: commType,
        destIp: tempIpPax,
        portDevice: tempPortPax,
        timeoutConnect: '90000',
        bluetoothAddr: idBluetooth,
      },
      (message) =>
        this.handleResponseCreditCard(
          message,
          true,
          amountCredtitForSubmitToServer,
        ),
    );
  };

  async handleResponseCreditCard(message, online, moneyUserGiveForStaff) {
    // console.log("---- handleResponseCreditCard: ", message);
    const {
      profile,
      groupAppointment,
      profileStaffLogin,
      customerInfoBuyAppointment,
      payAppointmentId,
    } = this.props;
    await this.setState({
      visibleProcessingCredit: false,
    });
    try {
      const result = JSON.parse(message);
      const tempEnv = env.ENV;
      if (result.status == 0) {
        PosLink.cancelTransaction();
        if (payAppointmentId) {
          this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
        }
        if (result.message === 'ABORTED') {
          return;
        }
        setTimeout(() => {
          alert(result.message);
        }, 300);
      } else if (result.ResultCode && result.ResultCode == '000000') {
        if (tempEnv == 'Production' && result.Message === 'DEMO APPROVED') {
          if (payAppointmentId) {
            this.props.actions.appointment.cancelHarmonyPayment(
              payAppointmentId,
            );
          }
          await this.setState({
            visibleProcessingCredit: false,
          });
          setTimeout(() => {
            alert("You're running your Pax on DEMO MODE!");
          }, 1000);
        } else {
          const {
            paymentSelected,
            customDiscountPercentLocal,
            customDiscountFixedLocal,
          } = this.state;
          let method = this.getPaymentString(paymentSelected);

          if (online) {
            // ------ Payment with credit online card success ----
            // this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff, message, profile.merchantId);
            this.props.actions.appointment.submitPaymentWithCreditCard(
              profile?.merchantId || 0,
              message,
              payAppointmentId,
              moneyUserGiveForStaff,
            );
          } else {
            // ------ Payment with credit offline card success ----
          }
        }
      } else {
        if (payAppointmentId) {
          this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
        }
        setTimeout(() => {
          alert(result?.ResultTxt || 'Transaction failed:');
        }, 300);
      }
    } catch (error) {}
  }

  cancelTransaction = async () => {
    const { payAppointmentId } = this.props;
    if (Platform.OS === 'android') {
      PoslinkAndroid.cancelTransaction((data) => {});
    } else {
      PosLink.cancelTransaction();
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
    this.changeStylistRef.current?.setStateFromParent(service, appointmentId);
    await this.setState({
      visibleChangeStylist: true,
    });
  };

  changeProduct = async (product, appointmentId) => {
    this.changePriceAmountProductRef.current?.setStateFromParent(
      product,
      appointmentId,
    );
    this.setState({
      visibleChangePriceAmountProduct: true,
    });
  };

  closePopupActiveGiftCard = async () => {
    this.props.actions.appointment.handleVisibleActiveGiftCard(false);
    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: '',
      },
      productSeleted: {
        name: '',
      },
      categoryTypeSelected: '',
      arrSelectedExtra: [],
      paymentSelected: '',
    });
  };

  onSelectGiftCard = async (category) => {
    const { categorySelected } = this.state;
    if (categorySelected?.categoryId !== category?.categoryId) {
      await this.setState({
        categorySelected: category,
        categoryTypeSelected: category?.categoryType,
        productSeleted: {
          name: '',
        },
        isShowColProduct: false,
        isShowColAmount: false,
        arrSelectedExtra: [],
      });
      this.activeGiftCardRef.current?.setStateFromParent();
      this.props.actions.appointment.handleVisibleActiveGiftCard();
    } else {
      await this.setState({
        isShowColProduct: false,
        isShowColAmount: false,
        categorySelected: {
          categoryId: -1,
          categoryType: '',
        },
        productSeleted: {
          name: '',
        },
        categoryTypeSelected: '',
        arrSelectedExtra: [],
      });
    }
  };

  onPressSelectCategory = async (category) => {
    const { categorySelected } = this.state;
    if (categorySelected?.categoryId !== category?.categoryId) {
      await this.setState({
        categorySelected: category,
        categoryTypeSelected: category?.categoryType,
        isShowColProduct: true,
        isShowColAmount: false,
        productSeleted: {
          name: '',
        },
        arrSelectedExtra: [],
      });
    } else {
      await this.setState({
        isShowColProduct: false,
        isShowColAmount: false,
        categorySelected: {
          categoryId: -1,
          categoryType: '',
        },
        productSeleted: {
          name: '',
        },
        categoryTypeSelected: '',
        arrSelectedExtra: [],
      });
    }
  };

  changeProductBasketLocal = async (productIdLocal, price, quantity) => {};

  changeStylistBasketLocal = async (serviceId, staffId, tip, price) => {
    const { basket } = this.state;
    const { listStaffByMerchant } = this.props;
    if (staffId) {
      const temptStaff = getStaffInfoById(listStaffByMerchant, staffId);
      const temptBasket = basket.map((item, index) => {
        if (item.type === 'Service' && item.data.serviceId === serviceId) {
          return {
            ...item,
            data: {
              ...item.data,
              price: price,
            },
            staff: {
              staffId: staffId,
              imageUrl: temptStaff?.imageUrl || '',
              displayName: temptStaff?.displayName || '',
              tip: tip,
            },
          };
        }
        return item;
      });
      let temptTip = 0;
      for (let i = 0; i < temptBasket.length; i++) {
        if (temptBasket[i].type === 'Service') {
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
  };

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
        const appointment = groupAppointment.appointments.find(
          (appointment) => appointment.appointmentId === appointmentId,
        );
        const { services, products, extras, giftCards } = appointment;
        const arrayProducts = getArrayProductsFromAppointment(products);
        const arryaServices = getArrayServicesFromAppointment(services);
        const arrayExtras = getArrayExtrasFromAppointment(extras);
        const arrayGiftCards = getArrayGiftCardsFromAppointment(giftCards);
        const temptBasket = arrayProducts.concat(
          arryaServices,
          arrayExtras,
          arrayGiftCards,
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
          customDiscountFixedLocal,
        );
        await this.setState({
          visiblePopupDiscountLocal: true,
        });
      }
    } else {
      alert('You are paying by Harmony Payment!');
    }
  };

  showModalTipAppointment = async (
    appointmentId,
    tip,
    subTotal,
    tipPercent,
  ) => {
    const { connectionSignalR } = this.props;
    if (_.isEmpty(connectionSignalR)) {
      this.changeTipRef.current?.setStateFromParent(
        appointmentId,
        tip,
        subTotal,
        tipPercent,
      );
      await this.setState({
        visibleChangeTip: true,
      });
    } else {
      alert('You are paying by Harmony Payment!');
    }
  };

  async callbackDiscountToParent(
    customDiscountPercentLocal,
    customDiscountFixedLocal,
    discountTotalLocal,
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
      alert('Phone is invalid !');
    }
  };

  onRequestClosePopupDiscountLocal = async () => {
    await this.setState({
      visiblePopupDiscountLocal: false,
    });
  };

  onRequestCloseBillModal = async () => {
    await this.setState({
      changeButtonDone: false,
      paymentSelected: '',
      visibleBillOfPayment: false,
    });
    this.props.actions.appointment.resetPayment();
  };

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
            formatNumberFromCurrency(discountTotalLocal),
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
  };

  nextPayment = async () => {
    await this.setState({
      visiblePopupPaymentDetails: false,
    });
  };

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
      if (paymentSelected === 'Gift Card') {
        this.props.actions.appointment.checkSerialNumber(
          code,
          false,
          false,
          true,
        );
      } else {
        this.props.actions.appointment.checkSerialNumber(code);
      }
    } else {
      const moneyUserGiveForStaff = parseFloat(
        formatNumberFromCurrency(this.modalBillRef.current?.state.quality),
      );
      const method = this.getPaymentString(paymentSelected);

      const bodyAction = {
        merchantId: profile.merchantId,
        userId: customerInfoBuyAppointment?.userId || 0,
        status: 'checkin',
        services: [],
        extras: [],
        products: [],
        fromTime: formatWithMoment(new Date(), 'MM/DD/YYYY hh:mm A'),
        staffId: profileStaffLogin?.staffId || 0,
        customDiscountFixed: customDiscountFixedLocal,
        customDiscountPercent: customDiscountPercentLocal,
        firstName: customerInfoBuyAppointment?.firstName || '',
        lastName: customerInfoBuyAppointment?.lastName || '',
        phoneNumber: customerInfoBuyAppointment?.phone || '',
        customerId: customerInfoBuyAppointment?.customerId || 0,
      };
      const optionAction = {
        method: 'POST',
        token: true,
        api: `appointment`,
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
        optionAction,
      );
    }

    await this.setState({
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: '',
      },
      productSeleted: {
        name: '',
      },
      categoryTypeSelected: '',
      arrSelectedExtra: [],
    });
  };

  confimPayOfflinemode = () => {
    this.setState({
      visibleScanCode: true,
    });
  };

  onRequestCloseScanCode = () => {
    this.setState({
      visibleScanCode: false,
    });
  };

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
  };

  getExtrasFromRedux = (productSeleted) => {
    const { extrasByMerchant } = this.props;
    const extrasBySort = [];

    for (let i = 0; i < extrasByMerchant.length; i++) {
      for (let j = 0; j < productSeleted.extras.length; j++) {
        const extraLocal = productSeleted.extras[j];
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
  };

  createABlockAppointment = () => {
    const {
      profile,
      fromTimeBlockAppointment,
      customerInfoBuyAppointment,
      bookingGroupId,
    } = this.props;
    this.props.actions.appointment.createBlockAppointment(
      profile.merchantId,
      fromTimeBlockAppointment,
      customerInfoBuyAppointment?.userId || 0,
      customerInfoBuyAppointment?.customerId || 0,
      customerInfoBuyAppointment?.firstName || '',
      customerInfoBuyAppointment?.lastName || '',
      customerInfoBuyAppointment?.phone || '',
      bookingGroupId,
    );
  };

  addGiftCardIntoBlockAppointment = (code) => {
    const { isOpenBlockAppointmentId } = this.props;
    let isAppointmentIdOpen = '';
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      if (!this.blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          this.blockAppointmentRef[i].props.appointmentDetail.appointmentId;
        break;
      }
    }

    const appointmentId = isAppointmentIdOpen
      ? isAppointmentIdOpen
      : isOpenBlockAppointmentId;
    this.props.actions.appointment.addGiftCardIntoBlockAppointment(
      code,
      appointmentId,
    );
  };

  removeItemInBlockAppointment = (dataRemove) => {
    const { blockAppointments } = this.props;
    let isAppointmentIdOpen = '';
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      if (!this.blockAppointmentRef[i].state.isCollapsed) {
        isAppointmentIdOpen =
          this.blockAppointmentRef[i].props.appointmentDetail.appointmentId;
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
      true,
    );
  };

  removeBlockAppointment = (appointmentId) => {
    const { profile } = this.props;
    this.props.actions.appointment.cancleAppointment(
      appointmentId,
      profile.merchantId,
      0,
      true,
    );
  };

  bookBlockAppointment = () => {
    this.props.gotoTabAppointment();
    this.props.actions.appointment.bookBlockAppointment();
    this.setState(initState);
    this.blockAppointmentRef = [];
    this.props.actions.appointment.resetGroupAppointment();
  };

  toggleCollaps = (appointmentIdSelection) => {
    for (let i = 0; i < this.blockAppointmentRef.length; i++) {
      const appointmentDetail =
        this.blockAppointmentRef[i].props.appointmentDetail;
      if (
        appointmentDetail &&
        appointmentDetail.appointmentId === appointmentIdSelection
      ) {
        this.props.actions.appointment.updateIdBlockAppointmentOpen(
          appointmentDetail.appointmentId,
        );
        this.blockAppointmentRef[i].setStateFromParent(false);
      } else {
        this.blockAppointmentRef[i].setStateFromParent(true);
      }
    }
  };

  addBlockAppointmentRef = (ref) => {
    if (ref) {
      this.blockAppointmentRef.push(ref);
    }
  };

  // ------------------ Change Customer Info buy appointment ----------
  displayPopupCustomerInfo = async () => {
    const { customerInfoBuyAppointment } = this.props;
    const firstName = customerInfoBuyAppointment?.firstName || '';
    const lastName = customerInfoBuyAppointment?.lastName || '';
    const phone = customerInfoBuyAppointment?.phone || '';
    this.popupCustomerInfoRef.current?.setStateFromParent(
      firstName,
      lastName,
      phone,
    );
    this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(true);
  };

  updateBlockAppointmentRef = () => {
    const { isOpenBlockAppointmentId, idNextToAppointmentRemove } = this.props;
    const temptBlockAppointmentRef = this.blockAppointmentRef.filter(
      (block) => block._isMounted,
    );

    if (temptBlockAppointmentRef.length > 0) {
      this.blockAppointmentRef = temptBlockAppointmentRef;
      let isAppointmentOpenExist = false;
      for (let i = 0; i < this.blockAppointmentRef.length; i++) {
        const appointmentDetail =
          this.blockAppointmentRef[i].props.appointmentDetail;
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
        this.blockAppointmentRef[i].props.appointmentDetail;
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
      paymentSelected: '',
    });
  };

  showModalCheckPermission = (appointmentId, isBlock = false) => {
    this.popupCheckDiscountPermissionRef?.current?.setStateFromParent(
      '',
      appointmentId,
      isBlock,
    );
    this.props.actions.marketing.switchPopupCheckDiscountPermission(true);
  };

  closePopupCheckDiscountPermission = () => {
    this.props.actions.marketing.switchPopupCheckDiscountPermission(false);
  };

  // ------------ New Code ----------

  scrollFlatListToStaffIndex = (staffId) => {
    let index = -1;
    for (let i = 0; i < this.props.staffListCurrentDate.length; i++) {
      if (this.props.staffListCurrentDate[i]?.staffId === staffId) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      if (this.staffFlatListRef?.current) {
        this.staffFlatListRef?.current?.scrollToIndex({
          index,
        });
      } else {
        setTimeout(() => {
          this.staffFlatListRef?.current?.scrollToIndex({
            index,
          });
        }, 200);
      }
    }
  };

  displayCategoriesColumn = (staff) => async () => {
    const { selectedStaff } = this.state;
    const isExist = selectedStaff?.staffId === staff?.staffId ? true : false;
    await this.setState({
      selectedStaff: isExist ? {} : staff,
      isShowCategoriesColumn: !isExist,
      isShowColProduct: false,
      isShowColAmount: false,
      categorySelected: {
        categoryId: -1,
        categoryType: '',
      },
      productSeleted: {
        name: '',
      },
      categoryTypeSelected: '',
      arrSelectedExtra: [],
    });
    // this.scrollFlatListToStaffIndex(staff?.staffId);
  };

  displayEnterUserPhonePopup = () => {
    const { customerInfoBuyAppointment } = this.props;
    const firstName = customerInfoBuyAppointment?.firstName || '';
    const lastName = customerInfoBuyAppointment?.lastName || '';
    const phone = customerInfoBuyAppointment?.phone || '';
    this.popupCustomerInfoRef.current?.setStateFromParent(
      firstName,
      lastName,
      phone,
    );
    this.props.actions.appointment.switchVisibleEnterCustomerPhonePopup(true);
  };

  displayCustomerInfoPopup = async () => {
    const customerId = this.props?.customerInfoBuyAppointment?.customerId || 0;
    this.props.actions.customer.getCustomerInfoById(customerId, true);
  };

  editCustomerInfo = (customerId, customer) => {
    this.props.actions.customer.editCustomer(customerId, customer, true);
  };

  addCustomerInfo = (customer) => {
    this.props.actions.customer.addCustomer(customer, true);
  };

  bookAppointmentFromCalendar = () => {
    this.props.gotoTabAppointment();
    this.setState(initState);
    this.props.actions.appointment.resetGroupAppointment();
  };

  setSelectStaffFromCalendar = async (staffId) => {
    await this.setState({
      selectedStaff: { staffId },
      isShowCategoriesColumn: true,
    });

    this.scrollFlatListToStaffIndex(staffId);
  };

  setBlockStateFromCalendar = async () => {
    await this.setState({
      isShowCategoriesColumn: true,
      isBlockBookingFromCalendar: true,
    });
  };

  async componentDidUpdate(prevProps, prevState) {
    const {
      isLoadingGetBlockAppointment,
      blockAppointments,
      isLoadingRemoveBlockAppointment,
      startProcessingPax,
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
        false,
      );
      this.sendTransToPaxMachine();
    }
  }
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

  visibleProductDetailModalRetail:
    state.orderRetail.visibleProductDetailModalRetail,
  productDetailRetail: state.orderRetail.productDetailRetail,
});

export default connectRedux(mapStateToProps, OrderCheckout);