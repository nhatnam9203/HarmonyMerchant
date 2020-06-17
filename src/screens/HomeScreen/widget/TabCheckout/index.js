import React from 'react';
import _, { ap } from 'ramda';
import { StarPRNT } from 'react-native-star-prnt';
const signalR = require('@microsoft/signalr');
import { Alert, NativeModules, TouchableHighlightBase } from 'react-native';
import moment from 'moment';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment, requestAPI,
    getArrayExtrasFromAppointment, formatNumberFromCurrency, formatMoney, getStaffInfoById, splitPlusInPhoneNumber,
    PRINTER_MACHINE, getShortNameToPrintInvoice
} from '@utils';
import PrintManager from '@lib/PrintManager';
import apiConfigs from '@configs/api';

const PosLink = NativeModules.MyApp;

const initState = {
    isShowColProduct: false,
    isShowColAmount: false,
    categorySelected: {
        categoryId: -1,
        categoryType: ''
    },
    productSeleted: {
        name: ''
    },
    categoryTypeSelected: '',
    extraSelected: {
        extraId: -1,
        name: ''
    },
    basket: [],
    visibleDiscount: false,
    paymentSelected: '',
    tabCurrent: 0,
    subTotalLocal: 0,
    tipLocal: 0,
    discountTotalLocal: 0,
    taxLocal: 0,
    totalLocal: 0,
    total: 0,
    isInitBasket: false,
    appointmentId: -1,
    infoUser: {
        firstName: '',
        lastName: '',
        phoneNumber: ''
    },
    visiblePaymentCompleted: false,
    changeButtonDone: false,
    methodPayment: '',
    visibleProcessingCredit: false,
    visibleBillOfPayment: false,
    visibleConfirm: false,
    visibleChangeStylist: false,
    visibleChangeMoney: false,

    customDiscountPercentLocal: 0,
    customDiscountFixedLocal: 0,
    visibleSendLinkPopup: false,
    visiblePopupDiscountLocal: false,
    visibleCustomerName: false,
    visibleCustomerPhone: false,
    appointmentIdChangeStylist: -1,
    visiblePopupPaymentDetails: false,

    isCancelHarmonyPay: false,

    customerInfoByPhone: {
        userId: 0
    },
    visibleScanCode: false,
    appointmentOfflineMode: {},
    staffIdOfline: 0,
    fromTime: "",
    visiblePrintInvoice: false,

    visibleChangePriceAmountProduct: false,
    visibleChangeTip: false
}

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
    }

    resetStateFromParent = async () => {
        await this.setState(initState);
    }

    getDataColProduct() {
        const { categorySelected, categoryTypeSelected } = this.state;
        const { productsByMerchantId, servicesByMerchant, extrasByMerchant } = this.props;
        if (categoryTypeSelected === 'Extra') {
            const dataExtra = extrasByMerchant.filter((extra, index) => {
                return extra.isDisabled === 0;
            });
            return dataExtra;
        } else {
            const data = categoryTypeSelected === 'Service' ? servicesByMerchant : productsByMerchantId;
            const temptData = data.filter(item => {
                return item.categoryId === categorySelected.categoryId && item.isDisabled === 0;
            });
            return temptData;
        }

    }

    setBasketOfflineModeFromParent = async (appointment) => {
        const { services, products, extras } = appointment;
        const arryaServices = getArrayServicesFromAppointment(services);
        const arrayProducts = getArrayProductsFromAppointment(products);
        const arrayExtras = getArrayExtrasFromAppointment(extras);
        const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
        await this.setState({
            basket: temptBasket,
            staffIdOfline: appointment.staffId ? appointment.staffId : 0,
            fromTime: appointment.fromTime ? appointment.fromTime : "",
            subTotalLocal: appointment.subTotal ? appointment.subTotal : 0,
            taxLocal: appointment.tax ? appointment.tax : 0,
            tipLocal: appointment.tipAmount ? appointment.tipAmount : 0,
            discountTotalLocal: appointment.discount ? appointment.discount : 0,
            infoUser: {
                firstName: appointment.firstName ? appointment.firstName : "",
                lastName: appointment.lastName ? appointment.lastName : "",
                phoneNumber: appointment.phoneNumber
            },
        })
    }

    addAmount = async () => {
        const { groupAppointment, isOfflineMode, blockAppointments } = this.props;
        const { categoryTypeSelected, basket, productSeleted, extraSelected } = this.state;

        // ------------ New code -------------
        if (blockAppointments.length > 0) {
            this.addBlockAppointment();
            return;
        }
        // ------------------------------------

        if (!_.isEmpty(groupAppointment)) {  // ------------- Buy online ---------
            const appointmentId = groupAppointment.mainAppointmentId ? groupAppointment.mainAppointmentId : 0;
            if (categoryTypeSelected === 'Product') {
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [],
                        extras: [],
                        products: [{
                            productId: productSeleted.productId,
                            quantity: this.amountRef.current.state.quanlity
                        }],
                        giftCards: []
                    }, appointmentId, true);
            } else { // ------------- Buy online Extra , Service ---------
                const temptExtra = extraSelected.extraId !== -1 ? [{ extraId: extraSelected.extraId }] : [];
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [{
                            serviceId: productSeleted.serviceId
                        }],
                        extras: temptExtra,
                        products: [],
                        giftCards: []
                    }, appointmentId, true);
            }
        } else {  // ------------- Buy at store ---------
            if (categoryTypeSelected === 'Product') { // ------------- Buy Product at store ---------
                const temptBasket = basket.filter((item) => item.id !== `${productSeleted.productId}_pro`);
                temptBasket.unshift({
                    type: 'Product',
                    id: `${productSeleted.productId}_pro`,
                    data: {
                        name: productSeleted.name,
                        productId: productSeleted.productId,
                        price: productSeleted.price
                    },
                    quanlitySet: this.amountRef.current.state.quanlity
                });
                this.setState({
                    basket: temptBasket,
                    subTotalLocal: this.getPriceOfline(temptBasket),
                    taxLocal: this.calculateTotalTaxLocal(temptBasket)
                }, () => {
                    if (isOfflineMode) {
                        // alert("Product!")
                    } else {
                        this.createAnymousAppointment();
                    }
                });
            } else { // ------------- Buy Service, Extra at store ---------
                const { profileStaffLogin } = this.props;
                const temptBasket = basket.filter((item) => item.id !== `${productSeleted.serviceId}_ser`);
                temptBasket.unshift({
                    type: 'Service',
                    id: `${productSeleted.serviceId}_ser`,
                    data: {
                        name: productSeleted.name,
                        serviceId: productSeleted.serviceId,
                        price: productSeleted.price
                    },
                    serviceName: productSeleted.name,
                    staff: {
                        staffId: profileStaffLogin.staffId,
                        imageUrl: profileStaffLogin.imageUrl,
                        displayName: profileStaffLogin.displayName,
                        tip: 0.00
                    }
                });

                const temptBasketExtra = temptBasket.filter((item) => item.id !== `${extraSelected.extraId}_extra`);
                if (extraSelected.extraId !== -1) {
                    temptBasketExtra.unshift({
                        type: 'Extra',
                        id: `${extraSelected.extraId}_extra`,
                        data: {
                            name: extraSelected.name,
                            extraId: extraSelected.extraId,
                            price: extraSelected.price
                        },
                        serviceName: productSeleted.name
                    });
                }

                this.setState({
                    basket: temptBasketExtra,
                    subTotalLocal: this.getPriceOfline(temptBasketExtra),
                    taxLocal: this.calculateTotalTaxLocal(temptBasketExtra)
                }, () => {
                    if (isOfflineMode) {
                        // alert("Service_Extra!")
                    } else {
                        this.createAnymousAppointment();
                    }

                });
            }
        }


        await this.setState({
            isShowColProduct: false,
            isShowColAmount: false,
            categorySelected: {
                categoryId: -1,
                categoryType: ''
            },
            productSeleted: {
                name: ''
            },
            categoryTypeSelected: '',
            extraSelected: {
                extraId: -1,
                name: ''
            },
        })

    }


    createAnymousAppointment = async () => {
        const { profile } = this.props;
        const { customerInfoByPhone, infoUser,
            paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal,
        } = this.state;

        const dataAnymousAppoitment = this.getBasketOffline();
        const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
        const moneyUserGiveForStaff = parseFloat(formatNumberFromCurrency(this.modalBillRef.current.state.quality));
        const method = this.getPaymentString(paymentSelected);
        const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;

        this.props.actions.appointment.createAnymousAppointment(profile.merchantId, userId, arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
            customDiscountFixedLocal, customDiscountPercentLocal, staffId,
            infoUser.firstName,
            infoUser.lastName,
            infoUser.phoneNumber,
            moneyUserGiveForStaff,
            false,
            false
        );

        await this.setState({
            basket: [],
            customDiscountPercentLocal: 0,
            customDiscountFixedLocal: 0,
        });
    }


    getPriceOfline(basket) {
        //console.log('basket : ' + JSON.stringify(basket));
        let total = 0;
        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === "Product") {
                total = total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
                //console.log('total : ', total);
            } else {
                total = total + formatNumberFromCurrency(basket[i].data.price);
            }
        }
        return total;
    }

    calculateTotalTaxLocal(basket) {
        const { profile } = this.props;
        const taxService = profile.taxService ? formatNumberFromCurrency(profile.taxService) : 0;
        const taxProduct = profile.taxProduct ? formatNumberFromCurrency(profile.taxProduct) : 0;
        let taxTotal = 0;
        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === "Product") {
                taxTotal = taxTotal + (parseFloat(basket[i].data.price) * basket[i].quanlitySet * taxProduct) / 100;

            } else if (basket[i].type === "Service") {
                taxTotal = taxTotal + (formatNumberFromCurrency(basket[i].data.price) * taxService) / 100;
            }
        }
        return Number(taxTotal).toFixed(2);

    }

    removeItemBasket = (item, appointmentId = -1, isGroup = false) => {
        ////console.log('appointmentId : ', appointmentId);
        const { blockAppointments } = this.props
        const { basket } = this.state;
        if (appointmentId !== -1) {
            // ----- Remove With Appointmnet 
            let dataRemove = {};
            switch (item.type) {
                case 'Product':
                    dataRemove = {
                        services: [],
                        extras: [],
                        products: [{ bookingProductId: item.data.bookingProductId }]
                    }
                    break;
                case 'Service':
                    dataRemove = {
                        services: [{ bookingServiceId: item.data.bookingServiceId }],
                        extras: [],
                        products: []
                    }
                    break;
                case 'Extra':
                    dataRemove = {
                        services: [],
                        extras: [{ bookingExtraId: item.data.bookingExtraId }],
                        products: []
                    }
                    break;
                case 'GiftCards':
                    dataRemove = {
                        services: [],
                        extras: [{ bookingExtraId: item.data.bookingExtraId }],
                        products: [],
                        giftCards: [{ bookingGiftCardId: item.data.bookingGiftCardId }]
                    }
                    break;
            }
            if (blockAppointments.length > 0) {
                this.removeItemInBlockAppointment(dataRemove);
            } else {
                this.props.actions.appointment.removeItemIntoAppointment(dataRemove, appointmentId, isGroup);
            }

        } else {
            // -------- Remove Offline --------
            const temptBasket = basket.filter((itemBasket) => itemBasket.id !== item.id);
            this.setState({
                basket: temptBasket,
                subTotalLocal: this.getPriceOfline(temptBasket),
                taxLocal: this.calculateTotalTaxLocal(temptBasket)
            })
        }

    }

    selectedPayment = (payment) => {
        const { paymentSelected, changeButtonDone } = this.state;
        const { isDonePayment } = this.props;
        if (changeButtonDone && !isDonePayment && paymentSelected === 'HarmonyPay') {
        } else {
            this.setState(prevState => ({
                paymentSelected: payment === prevState.paymentSelected ? '' : payment
            }))
        }


    }

    showColAmount = (item) => {
        this.setState({
            productSeleted: item,
            isShowColAmount: true,
            extraSelected: {
                extraId: -1,
                name: ''
            },
        })
    }

    onPressSelectExtra = (extra) => {
        this.setState({
            extraSelected: extra
        })
    }

    selectPayment = () => {
        this.scrollTabRef.current.goToPage(1);
    }

    backAddBasket = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    closeModalDiscount = () => {
        this.setState({
            visibleDiscount: false
        })
    }

    clearDataCofrim = async () => {
        const { connectionSignalR, groupAppointment, profile, isCancelAppointment, blockAppointments } = this.props;
        const { customerInfoByPhone } = this.state;

        const temptBlockAppointments = blockAppointments ? [...blockAppointments] : [];

        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        this.props.gotoPageCurentParent();
        await this.setState({ ...initState, isInitBasket: true });
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.resetBasketEmpty();
        this.props.actions.appointment.resetPayment();
        this.props.actions.appointment.changeFlagSigninAppointment(false);
        this.props.actions.appointment.resetGroupAppointment();

        if (isCancelAppointment) {
            const mainAppointmentId = groupAppointment.mainAppointmentId ? groupAppointment.mainAppointmentId : 0;
            const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;
            this.props.actions.appointment.cancleAppointment(mainAppointmentId, profile.merchantId, userId);
        }

        if (temptBlockAppointments && temptBlockAppointments.length > 0) {
            for (let i = 0; i < temptBlockAppointments.length; i++) {
                this.props.actions.appointment.cancleAppointment(temptBlockAppointments[i].appointmentId, profile.merchantId, 0, true, true);
            }
        }

        this.blockAppointmentRef = [];

    }

    setStateFromParent = () => {
        this.setState(initState);
    }

    getPaymentString(type) {
        let method = '';
        switch (type) {
            case 'HarmonyPay':
                method = 'harmony';
                break;
            case 'Cash':
                method = 'cash';
                break;
            case 'Credit Cards':
                method = 'credit_card';
                break;
            case 'Others - Check':
                method = 'other';
                break;
            default:
                method = ''
        }
        return method
    }

    getBasketOffline = () => {
        const { basket } = this.state;
        const arrayProductBuy = [];
        const arryaServicesBuy = [];
        const arrayExtrasBuy = [];
        let staffId = 0;
        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === 'Product') {
                arrayProductBuy.push({
                    ...basket[i],
                    productId: basket[i].data.productId,
                    quantity: basket[i].quanlitySet,

                });
            } else if (basket[i].type === 'Service') {
                staffId = basket[i].staff && basket[i].staff.staffId ? basket[i].staff.staffId : 0;
                arryaServicesBuy.push({
                    ...basket[i],
                    serviceId: basket[i].data.serviceId,
                    staffId: basket[i].staff && basket[i].staff.staffId ? basket[i].staff.staffId : 0,
                    tipAmount: basket[i].staff && basket[i].staff.tip ? basket[i].staff.tip : 0,
                });
            } else if (basket[i].type === 'Extra') {
                arrayExtrasBuy.push({
                    ...basket[i],
                    extraId: basket[i].data.extraId,
                })
            }
        }
        return {
            arrayProductBuy,
            arryaServicesBuy,
            arrayExtrasBuy,
            staffId
        }
    }

    getBasketOnline = (appointments) => {
        //console.log("getBasketOnline : " + JSON.stringify(appointments));
        const arrayProductBuy = [];
        const arryaServicesBuy = [];
        const arrayExtrasBuy = [];
        const arrayGiftCards = [];
        appointments.forEach((appointment) => {
            // ------ Push Service -------
            appointment.services.forEach((service) => {
                // console.log("service : ", JSON.stringify(service));
                arryaServicesBuy.push({
                    type: "Service",
                    data: {
                        name: service.serviceName ? service.serviceName : "",
                        price: service.price ? service.price : ""
                    },
                    staff: service.staff ? service.staff : false
                })
            });

            // ------ Push Product -------
            appointment.products.forEach((product) => {
                arrayProductBuy.push({
                    type: "Product",
                    data: {
                        name: product.productName ? product.productName : "",
                        price: product.price ? product.price : ""
                    },
                    quanlitySet: product.quantity ? product.quantity : ""
                })
            });

            // ------ Push Product -------
            appointment.extras.forEach((extra) => {
                arrayExtrasBuy.push({
                    type: 'Extra',
                    data: {
                        name: extra.extraName ? extra.extraName : "",
                        price: extra.price ? extra.price : ""
                    }
                })
            });

            // ------ Push Gift Card -------
            appointment.giftCards.forEach((gift) => {
                arrayGiftCards.push({
                    type: 'GiftCards',
                    data: {
                        name: gift.name ? gift.name : "Gift Card",
                        price: gift.price ? gift.price : ""
                    },
                    quanlitySet: gift.quantity ? gift.quantity : ""
                })
            })
        });

        return {
            arryaServicesBuy,
            arrayProductBuy,
            arrayExtrasBuy,
            arrayGiftCards
        }
    }

    getHour() {
        const hours = parseInt(new Date().getHours()) - 12 > 0 ? `0${parseInt(new Date().getHours()) - 12}` : parseInt(new Date().getHours());
        const surfix = parseInt(new Date().getHours()) - 12 > 0 ? 'PM' : 'AM'
        const temptDate = `${hours}:${(new Date().getMinutes()) > 10 ? (new Date().getMinutes()) : `0${(new Date().getMinutes())}`} ${surfix}`;

        return temptDate;
    }

    getDate() {
        return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    }


    pushAppointmentIdOfflineIntoWebview = () => {
        if (this.props.isOfflineMode) {
            this.props.pushAppointmentIdOfflineIntoWebview();
        }

    }

    donotPrintBill = async () => {

        this.props.pushAppointmentIdOfflineIntoWebview();
        const { connectionSignalR } = this.props;
        const { paymentSelected } = this.state;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        if (paymentSelected === 'Cash' || paymentSelected === 'Others - Check') {
            const printMachine = await this.checkStatusPrint();
            if (printMachine) {
                this.openCashDrawer(printMachine);
                this.scrollTabRef.current.goToPage(0);
                this.props.actions.appointment.closeModalPaymentCompleted();
                this.props.gotoAppoitmentScreen();
                this.props.actions.appointment.resetBasketEmpty();
                this.setState(initState);
                this.props.actions.appointment.resetPayment();
            } else {
                this.scrollTabRef.current.goToPage(0);
                this.props.actions.appointment.closeModalPaymentCompleted();
                this.props.gotoAppoitmentScreen();
                this.props.actions.appointment.resetBasketEmpty();
                this.setState(initState);
                this.props.actions.appointment.resetPayment();

                setTimeout(() => {
                    alert('Please connect to your cash drawer.');
                }, 700)
            }


        } else {
            this.scrollTabRef.current.goToPage(0);
            this.props.actions.appointment.closeModalPaymentCompleted();
            this.props.gotoAppoitmentScreen();
            this.props.actions.appointment.resetBasketEmpty();
            this.setState(initState);
            this.props.actions.appointment.resetPayment();
        }

    }

    showInvoicePrint = async (printMachine, isTemptPrint = true) => {
        // -------- Pass data to Invoice --------
        this.props.actions.appointment.closeModalPaymentCompleted();
        const { groupAppointment, isOfflineMode } = this.props;
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal, paymentSelected } = this.state;

        const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];

        const { arryaServicesBuy, arrayProductBuy, arrayExtrasBuy, arrayGiftCards } = this.getBasketOnline(appointments);
        const basket = isOfflineMode ? this.state.basket : [...arryaServicesBuy, ...arrayProductBuy, ...arrayExtrasBuy, ...arrayGiftCards];

        const tipAmount = groupAppointment.tipAmount ? groupAppointment.tipAmount : 0;
        const subTotal = groupAppointment.subTotal ? groupAppointment.subTotal : 0;
        const discount = groupAppointment.discount ? groupAppointment.discount : 0;
        const tax = groupAppointment.tax ? groupAppointment.tax : 0;
        const total = groupAppointment.total ? groupAppointment.total : 0;

        const temptSubTotal = _.isEmpty(groupAppointment) ? subTotalLocal : subTotal;
        const temptTotal = _.isEmpty(groupAppointment) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : total;
        const temptDiscount = _.isEmpty(groupAppointment) ? discountTotalLocal : discount;
        const temptTip = _.isEmpty(groupAppointment) ? tipLocal : tipAmount;
        const temptTax = _.isEmpty(groupAppointment) ? taxLocal : tax;

        this.invoicePrintRef.current.setStateFromParent(
            basket,
            temptSubTotal,
            temptTax,
            temptDiscount,
            temptTip,
            temptTotal,
            paymentSelected,
            isTemptPrint,
            printMachine
        )

        await this.setState({
            visiblePrintInvoice: true
        })
    }

    cancelInvoicePrint = async (isPrintTempt) => {
        await this.setState({ visiblePrintInvoice: false });
        if (!isPrintTempt) {
            this.scrollTabRef.current.goToPage(0);
            this.props.gotoAppoitmentScreen();
            this.props.actions.appointment.resetBasketEmpty();
            this.setState(initState);
            this.props.actions.appointment.resetPayment();
        }
    }

    printBill = async () => {
        // this.showInvoicePrint("printMachine", false);

        this.pushAppointmentIdOfflineIntoWebview();
        const printMachine = await this.checkStatusPrint();
        if (printMachine) {
            const { paymentSelected } = this.state;
            const { connectionSignalR } = this.props;
            if (!_.isEmpty(connectionSignalR)) {
                connectionSignalR.stop();
            }
            if (paymentSelected === 'Cash' || paymentSelected === 'Others - Check') {
                this.openCashDrawer(printMachine);
            }
            this.showInvoicePrint(printMachine, false);
        } else {
            alert('Please connect to your printer! ');
        }
    }

    printTemptInvoice = async () => {
        this.showInvoicePrint("BT:mPOP");
        // const printMachine = await this.checkStatusPrint();
        // if (printMachine) {
        //     this.showInvoicePrint(printMachine);
        // } else {
        //     alert('Please connect to your printer! ');
        // }
    }

    checkStatusCashier = async () => {
        const printMachine = await this.checkStatusPrint(true);
        if (printMachine === "BT:mPOP") {
            this.openCashDrawer(printMachine);
        } else {
            alert('Please connect to your cash drawer.');
        }
    }

    checkStatusPrint = async () => {
        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            if (printer.length > 0) {
                let portName = false;
                for (let i = 0; i < printer.length; i++) {
                    let tempt_portName = printer[i].portName ? printer[i].portName : "";
                    if (tempt_portName === "BT:mPOP" || tempt_portName === "BT:TSP100") {
                        portName = tempt_portName;
                        break;
                    }
                };
                return portName ? portName : false;
            } else {
                return false
            }
        } catch (error) {
        }
    }

    openCashDrawer = async (portName) => {
        PrintManager.getInstance().openCashDrawer(portName);
    }

    handleHarmonyPayment = async (checkoutPaymentInfo) => {
        //console.log("checkoutPayment : ", JSON.stringify(checkoutPaymentInfo));
        await this.setState({
            changeButtonDone: false,
            isCancelHarmonyPay: false,
            paymentSelected: ""
        });

        const dueAmount = checkoutPaymentInfo && checkoutPaymentInfo.dueAmount ? parseFloat(checkoutPaymentInfo.dueAmount).toFixed(2) : 0;
        this.props.actions.appointment.updatePaymentInfoByHarmonyPayment(checkoutPaymentInfo);
        if (dueAmount === 0) {   // ----- Transaction Completed --------
            this.props.actions.appointment.completeTransaction();
        } else if (dueAmount < 0) {
            this.props.actions.appointment.showPopupChangeMoney(dueAmount);
        } else {
            this.props.actions.appointment.showPopupPaymentDetails();
        }
    }

    // ------------ Signal R -------

    setupSignalR(profile, token, checkoutGroupId, deviceId, method, moneyUserGiveForStaff) {
        try {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${apiConfigs.BASE_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app&deviceId=${deviceId}&token=${token}`,
                    {
                        transport: signalR.HttpTransportType.LongPolling | signalR.HttpTransportType.WebSockets
                    })
                .withAutomaticReconnect([0, 2000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            connection.on("ListWaNotification", (data) => {
                const temptData = JSON.parse(data);
                if (temptData.data && !_.isEmpty(temptData.data) && temptData.data.isPaymentHarmony
                    && temptData.data.checkoutGroupId == checkoutGroupId
                ) {
                    this.handleHarmonyPayment(temptData.data.checkoutPayment);
                    connection.stop();
                }
                // ---------- Handle reload Tip in Customer App ---------
                if (temptData.data && !_.isEmpty(temptData.data) && temptData.data.isTipAppointment) {
                    this.props.actions.appointment.getGroupAppointmentById(temptData.data.appointmentId);
                }
            });

            connection.onclose(async (error) => {
                // console.log("------ SignalR onclose ");
                this.props.actions.appointment.resetConnectSignalR();
            });


            connection.start()
                .then(() => {
                    // console.log("------ SignalR start ");
                    this.props.actions.app.stopLoadingApp();
                    this.props.actions.appointment.referenceConnectionSignalR(connection);
                    this.setState({
                        isCancelHarmonyPay: true,
                        changeButtonDone: true
                    });
                    this.props.actions.appointment.paymentAppointment(checkoutGroupId, method, moneyUserGiveForStaff);
                })
                .catch(error => {
                    this.props.actions.app.stopLoadingApp();
                    setTimeout(() => {
                        alert(error);
                    }, 1000)

                    // console.log("------ SignalR error :  ", error);
                });

        } catch (error) {
            // console.log('------ error : ', error);
            this.props.actions.app.stopLoadingApp();
            setTimeout(() => {
                alert(error);
            }, 1000)
        }
    }

    doneAddBasketSignInAppointment = () => {
        this.scrollTabRef.current.goToPage(0);
        const { connectionSignalR } = this.props;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        this.props.gotoTabAppointment();
        this.setState(initState);
        this.props.actions.appointment.resetBasketEmpty();
        this.props.actions.appointment.resetPayment();
        this.props.actions.appointment.changeFlagSigninAppointment(false);
    }


    extractBill = () => {
        const { groupAppointment, paymentDetailInfo, isOfflineMode } = this.props;
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        if (_.isEmpty(paymentDetailInfo)) {
            if (isOfflineMode) {
                const temptTotal = Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2);
                this.modalBillRef.current.setStateFromParent(`${temptTotal}`);
            } else {
                const temptTotal = _.isEmpty(groupAppointment) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : groupAppointment.total;
                this.modalBillRef.current.setStateFromParent(`${temptTotal}`);
            }

        } else {
            const totalExact = paymentDetailInfo.dueAmount ? paymentDetailInfo.dueAmount : 0;
            this.modalBillRef.current.setStateFromParent(`${totalExact}`);
        }


    }

    addAppointmentOfflineMode(isHarmonyOffline = false) {
        const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal,
            infoUser, tipLocal, subTotalLocal, taxLocal, discountTotalLocal, staffIdOfline, fromTime
        } = this.state;
        const { profile, appointmentIdOffline, profileStaffLogin } = this.props;
        let method = this.getPaymentString(paymentSelected);
        const dataAnymousAppoitment = this.getBasketOffline();
        const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
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
            fromTime: fromTime !== "" ? fromTime : moment.parseZone(new Date()).local().format('MM/DD/YYYY h:mm A'),
            staffId: staffIdOfline !== 0 ? staffIdOfline : profileStaffLogin.staffId,
            customDiscountFixed: customDiscountPercentLocal,
            customDiscountPercent: customDiscountFixedLocal,
            paymentMethod: method,
            paymentTransactionId: 0
        };
        if (isHarmonyOffline) {
            //console.log("appointmentOfflineMode : " + JSON.stringify(appointmentOfflineMode));
            this.setState({
                appointmentOfflineMode: appointmentOfflineMode
            })
        } else {
            this.props.actions.dataLocal.addAppointmentOfflineMode(appointmentOfflineMode);
        }


    }

    payBasket = async () => {
        const { paymentSelected } = this.state;
        const { groupAppointment, isOfflineMode } = this.props;
        const method = this.getPaymentString(paymentSelected);

        if (isOfflineMode && method === 'harmony') {
            this.scrollTabRef.current.goToPage(2);
            this.addAppointmentOfflineMode(true);
            return;
        }

        if (isOfflineMode && method === 'credit_card') {
            alert("Not Support Offline Mode")
            return;
        }

        if (method === 'harmony' && _.isEmpty(groupAppointment)) {
            this.popupSendLinkInstallRef.current.setStateFromParent('');
            this.setState({
                visibleSendLinkPopup: true
            });
        } else {
            await this.setState({
                visibleBillOfPayment: true
            })
        }

    }

    cancelHarmonyPayment = async () => {
        await this.setState({
            changeButtonDone: false,
            isCancelHarmonyPay: false,
            paymentSelected: '',
        });
        const { groupAppointment, payAppointmentId } = this.props;
        this.props.actions.appointment.cancelHarmonyPayment(payAppointmentId);
        // this.props.actions.appointment.resetPayment();
        const { connectionSignalR } = this.props;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
    }



    handlePaymentOffLineMode = async () => {
        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        const moneyUserGiveForStaff = parseFloat(formatNumberFromCurrency(this.modalBillRef.current.state.quality));
        const totalLocal = Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2);

        if (moneyUserGiveForStaff == 0) {
            alert('Enter amount!');
        } else if (moneyUserGiveForStaff - totalLocal < 0) {
            alert("Payment amount must be greater : " + totalLocal);
        } else {
            this.addAppointmentOfflineMode();
            await this.setState({
                visibleBillOfPayment: false,
            });
            this.modalBillRef.current.setStateFromParent(`0`);
            this.props.actions.appointment.showModalPrintReceipt();
        }
    }

    doneBill = async () => {
        const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal, infoUser, customerInfoByPhone } = this.state;
        const { groupAppointment, profile, paxMachineInfo, token, isOfflineMode, deviceId } = this.props;
        const moneyUserGiveForStaff = parseFloat(formatNumberFromCurrency(this.modalBillRef.current.state.quality));
        const method = this.getPaymentString(paymentSelected);

        if (isOfflineMode) {
            this.handlePaymentOffLineMode()
            return;
        }

        if (moneyUserGiveForStaff == 0 && groupAppointment && formatNumberFromCurrency(groupAppointment.total) != 0) {
            alert('Enter amount!');
        } else {
            await this.setState({
                visibleBillOfPayment: false,
            });

            this.modalBillRef.current.setStateFromParent(`0`);
            if (!_.isEmpty(groupAppointment)) {
                if (method === 'harmony') {
                    this.props.actions.app.loadingApp();
                    this.setupSignalR(profile, token, groupAppointment.checkoutGroupId, deviceId, method, moneyUserGiveForStaff);
                } else if (method === 'credit_card') {
                    if (paxMachineInfo.isSetup) {
                        if (moneyUserGiveForStaff == 0) {
                            alert('Enter amount!');
                        } else {
                            this.hanleCreditCardProcess(true, moneyUserGiveForStaff);
                        }

                    } else {
                        setTimeout(() => {
                            alert('Please connect your Pax to take payment.');
                        }, 300)
                    }
                } else {
                    this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff);
                }

            } else { // ------ Handle Buy at store -------
                if (method === 'credit_card') {
                    this.hanleCreditCardProcess(false, moneyUserGiveForStaff);
                } else if (method === 'harmony') {
                    this.popupSendLinkInstallRef.current.setStateFromParent('');
                    this.setState({
                        visibleSendLinkPopup: true
                    });
                } else {
                    const dataAnymousAppoitment = this.getBasketOffline();
                    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
                    const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;
                    this.props.actions.appointment.createAnymousAppointment(profile.merchantId, userId, arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
                        customDiscountFixedLocal, customDiscountPercentLocal, staffId,
                        infoUser.firstName,
                        infoUser.lastName,
                        infoUser.phoneNumber,
                        moneyUserGiveForStaff
                    );
                }


            }
        }
    }

    async hanleCreditCardProcess(online = true, moneyUserGiveForStaff) {
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout } = paxMachineInfo;

        // 1. Check setup pax 
        PosLink.setupPax(ip, port, timeout);

        // 2. Show modal processing 
        await this.setState({
            visibleProcessingCredit: true
        })

        const moneyCreditCard = Number(formatNumberFromCurrency(moneyUserGiveForStaff) * 100).toFixed(2);
        //console.log("moneyUserGiveForStaff : ", moneyCreditCard)
        // 3. Send Transaction 
        PosLink.sendTransaction(parseFloat(moneyCreditCard), (message) => this.handleResponseCreditCard(message, online, moneyUserGiveForStaff));
    }

    async handleResponseCreditCard(message, online, moneyUserGiveForStaff) {
        await this.setState({
            visibleProcessingCredit: false
        })
        try {
            const result = JSON.parse(message);
            // console.log("------ result : ", JSON.stringify(result));
            if (result.status == 0) {
                setTimeout(() => {
                    alert(result.message);
                }, 300)

            } else if (result.ResultTxt && result.ResultTxt == "OK") {
                const { profile, groupAppointment } = this.props;
                const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal, infoUser, customerInfoByPhone } = this.state;
                let method = this.getPaymentString(paymentSelected);

                if (online) {
                    // ------ Payment with credit online card success ----
                    this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff, message, profile.merchantId);
                } else {
                    // ------ Payment with credit offline card success ----
                    const dataAnymousAppoitment = this.getBasketOffline();
                    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
                    const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;
                    this.props.actions.appointment.createAnymousAppointment(profile.merchantId, userId, arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
                        customDiscountFixedLocal, customDiscountPercentLocal, staffId,
                        infoUser.firstName,
                        infoUser.lastName,
                        infoUser.phoneNumber,
                        moneyUserGiveForStaff,
                        message,
                    );
                }
            } else {
                setTimeout(() => {
                    alert(result.ResultTxt ? result.ResultTxt : "Transaction failed:");
                }, 300)
            }
        } catch (error) {
            //console.log('error : ', error)
        }
    }

    cancelTransaction = async () => {
        PosLink.cancelTransaction();
        await this.setState({
            visibleProcessingCredit: false,
            changeButtonDone: false,
        });

    }


    doneBillByCash = async () => {
        await this.setState({
            visibleChangeMoney: false
        });
        // ------- Handle Offline mode ------
        const { isOfflineMode } = this.props;
        if (isOfflineMode) {
            this.props.actions.appointment.showModalPrintReceipt();
        } else {
            const { appointmentDetail, appointmentIdOffline } = this.props;
            const temptAppointmentId = _.isEmpty(appointmentDetail) ? appointmentIdOffline : appointmentDetail.appointmentId;
            this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
            this.props.actions.appointment.showModalPrintReceipt();
        }



    }

    setStateVisibleFromParent = async (visibleConfirm) => {
        await this.setState({
            visibleConfirm
        })
    }

    changeStylist = async (service, appointmentId) => {
        this.changeStylistRef.current.setStateFromParent(service, appointmentId);
        await this.setState({
            visibleChangeStylist: true,
        })
    }

    changeProduct = async (product, appointmentId) => {
        this.changePriceAmountProductRef.current.setStateFromParent(product, appointmentId);
        this.setState({
            visibleChangePriceAmountProduct: true
        })
    }

    closePopupActiveGiftCard = async () => {
        this.props.actions.appointment.handleVisibleActiveGiftCard(false);
        await this.setState({
            isShowColProduct: false,
            isShowColAmount: false,
            categorySelected: {
                categoryId: -1,
                categoryType: ''
            },
            productSeleted: {
                name: ''
            },
            categoryTypeSelected: '',
            extraSelected: {
                extraId: -1,
                name: ''
            },
        })
    }

    onSelectGiftCard = async (category) => {
        const { categorySelected } = this.state;
        if (categorySelected.categoryId !== category.categoryId) {
            await this.setState({
                categorySelected: category,
                categoryTypeSelected: category.categoryType,
                productSeleted: {
                    name: ''
                },
                isShowColProduct: false,
                isShowColAmount: false,
                extraSelected: {
                    extraId: -1,
                    name: ''
                },
            });
            this.activeGiftCardRef.current.setStateFromParent();
            this.props.actions.appointment.handleVisibleActiveGiftCard();

        } else {
            await this.setState({
                isShowColProduct: false,
                isShowColAmount: false,
                categorySelected: {
                    categoryId: -1,
                    categoryType: ''
                },
                productSeleted: {
                    name: ''
                },
                categoryTypeSelected: '',
                extraSelected: {
                    extraId: -1,
                    name: ''
                },
            })
        }
    }

    onPressSelectCategory = async (category) => {
        const { categorySelected } = this.state;
        if (categorySelected.categoryId !== category.categoryId) {
            await this.setState({
                categorySelected: category,
                categoryTypeSelected: category.categoryType,
                isShowColProduct: true,
                isShowColAmount: false,
                productSeleted: {
                    name: ''
                },
                extraSelected: {
                    extraId: -1,
                    name: ''
                },
            })
        } else {
            await this.setState({
                isShowColProduct: false,
                isShowColAmount: false,
                categorySelected: {
                    categoryId: -1,
                    categoryType: ''
                },
                productSeleted: {
                    name: ''
                },
                categoryTypeSelected: '',
                extraSelected: {
                    extraId: -1,
                    name: ''
                },
            })
        }
    }

    changeProductBasketLocal = async (productIdLocal, price, quantity) => {

    }

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
                            price: price
                        },
                        staff: {
                            staffId: staffId,
                            imageUrl: temptStaff ? temptStaff.imageUrl : '',
                            displayName: temptStaff ? temptStaff.displayName : '',
                            tip: tip
                        }
                    }
                }
                return item
            });
            let temptTip = 0;
            for (let i = 0; i < temptBasket.length; i++) {
                if (temptBasket[i].type === 'Service') {
                    if (temptBasket[i].staff && temptBasket[i].staff.tip) {
                        temptTip = temptTip + formatNumberFromCurrency(temptBasket[i].staff.tip);
                    }
                }
            }
            await this.setState({
                basket: temptBasket,
                tipLocal: temptTip
            })
        }
    }

    showModalDiscount = async (appointmentId) => {
        //console.log('showModalDiscount : ', appointmentId);
        const { subTotalLocal, discountTotalLocal, customDiscountPercentLocal,
            customDiscountFixedLocal
        } = this.state;
        if (appointmentId !== -1) {
            const { groupAppointment } = this.props;
            const appointment = groupAppointment.appointments.find(appointment => appointment.appointmentId === appointmentId);
            const { services, products, extras } = appointment;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
            if (temptBasket.length > 0) {
                this.props.actions.marketing.getPromotionByAppointment(appointmentId);
            }
        } else { // ----------- Offline ------------
            this.popupDiscountLocalRef.current.setStateFromParent(subTotalLocal, discountTotalLocal, customDiscountPercentLocal, customDiscountFixedLocal);
            await this.setState({
                visiblePopupDiscountLocal: true
            })
        }
    }

    showModalTipAppointment = async (appointmentId, tip) => {
        this.changeTipRef.current.setStateFromParent(appointmentId, tip);
        await this.setState({
            visibleChangeTip: true
        })
    }

    async callbackDiscountToParent(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal) {
        await this.setState({
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
        })
    }


    sendLinkInstallApp = async () => {
        const phone = this.popupSendLinkInstallRef.current.state.value;
        const codeAreaPhone = this.popupSendLinkInstallRef.current.state.codeAreaPhone;

        if (phone.length > 6) {
            await this.setState({
                visibleSendLinkPopup: false
            });
            this.props.actions.app.sendLinkInstallApp(`${codeAreaPhone}${phone}`);
        } else {
            alert('Phone is invalid !')
        }
    }

    onRequestClosePopupDiscountLocal = async () => {
        await this.setState({
            visiblePopupDiscountLocal: false
        })
    }

    onRequestCloseBillModal = async () => {
        await this.setState({
            changeButtonDone: false,
            paymentSelected: '',
            visibleBillOfPayment: false

        });
        this.props.actions.appointment.resetPayment();
    }

    displayPopupCustomerName = async () => {
        const { groupAppointment } = this.props;
        const { infoUser } = this.state;
        let firstName = '';
        let lastName = '';

        if (!_.isEmpty(groupAppointment)) {
            const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
            const appointmentMain = appointments.find(appointment => appointment.isMain === 1);
            if (appointmentMain) {
                firstName = appointmentMain.firstName ? appointmentMain.firstName : '';
                lastName = appointmentMain.lastName ? appointmentMain.lastName : '';
            }


        }
        firstName = infoUser.firstName !== '' ? infoUser.firstName : firstName;
        lastName = infoUser.lastName !== '' ? infoUser.lastName : lastName;

        this.customerNameRef.current.setStateFromParent(firstName, lastName);
        await this.setState({ visibleCustomerName: true });

    }

    changeCustomerName = async () => {
        const { blockAppointments, profile } = this.props;
        const { infoUser, customerInfoByPhone } = this.state;

        const firstName = this.customerNameRef.current.state.firstName;
        const lastName = this.customerNameRef.current.state.lastName;

        await this.setState({
            infoUser: { ...infoUser, firstName, lastName },
            visibleCustomerName: false
        });

        if (blockAppointments && blockAppointments.length > 0) {
            const body = {
                customerId: customerInfoByPhone.userId ? customerInfoByPhone.userId : 0,
                firstName,
                lastName,
                phoneNumber: infoUser.phoneNumber,
            };
            for (let i = 0; i < blockAppointments.length; i++) {
                this.props.actions.appointment.updateCustomerInAppointment(blockAppointments[i].appointmentId, body);
            }
        }

    }

    // -------- handle Customer Phone 

    displayPopupCustomerPhone = () => {

        const { groupAppointment } = this.props;
        const { infoUser } = this.state;
        let phoneNumber = '';

        if (!_.isEmpty(groupAppointment)) {
            const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
            const appointmentMain = appointments.find(appointment => appointment.isMain === 1);
            if (appointmentMain) {
                phoneNumber = appointmentMain.phoneNumber ? appointmentMain.phoneNumber : '';
            }


        }
        phoneNumber = infoUser.phoneNumber !== '' ? infoUser.phoneNumber : phoneNumber;
        this.CustomerPhoneRef.current.setStateFromParent(phoneNumber);
        this.setState({
            visibleCustomerPhone: true
        })
    }

    changeCustomerPhone = async () => {
        const { groupAppointment, profileStaffLogin, blockAppointments } = this.props;
        const { infoUser } = this.state;
        const codeAreaPhone = this.CustomerPhoneRef.current.state.codeAreaPhone;
        const phone = this.CustomerPhoneRef.current.state.phone;
        const phoneNumber = `${codeAreaPhone}${phone}`;

        // ------- Get Customer Info by Phone ------
        this.props.actions.app.loadingApp();
        try {
            const responses = await requestAPI({
                method: 'GET',
                api: `${apiConfigs.BASE_API}customer/getbyphone/${splitPlusInPhoneNumber(phoneNumber)}`,
                token: profileStaffLogin.token
            });
            //console.log("changeCustomerPhone : " + JSON.stringify(responses));
            this.props.actions.app.stopLoadingApp();
            if (responses.codeNumber === 200) {
                await this.setState({
                    infoUser: {
                        ...infoUser, phoneNumber,
                        firstName: responses.data && responses.data.firstName ? responses.data.firstName : infoUser.firstName,
                        lastName: responses.data && responses.data.lastName ? responses.data.lastName : infoUser.lastName
                    },
                    visibleCustomerPhone: false,
                    customerInfoByPhone: responses.data
                });

                const body = {
                    customerId: responses.data && responses.data.customerId ? responses.data.customerId : 0,
                    firstName: responses.data && responses.data.firstName ? responses.data.firstName : '',
                    lastName: responses.data && responses.data.lastName ? responses.data.lastName : '',
                    phoneNumber: responses.data && responses.data.phone ? responses.data.phone : '',
                };

                if (!_.isEmpty(groupAppointment)) {
                    const mainAppointmentId = groupAppointment.mainAppointmentId ? groupAppointment.mainAppointmentId : 0;
                    this.props.actions.appointment.updateCustomerInAppointment(mainAppointmentId, body);
                }

                if (blockAppointments && blockAppointments.length > 0) {
                    for (let i = 0; i < blockAppointments.length; i++) {
                        this.props.actions.appointment.updateCustomerInAppointment(blockAppointments[i].appointmentId, body);
                    }
                }

            } else {
                await this.setState({
                    infoUser: { ...infoUser, phoneNumber },
                    visibleCustomerPhone: false,
                    customerInfoByPhone: {
                        userId: 0
                    }
                });
                if (blockAppointments && blockAppointments.length > 0) {
                    const body = {
                        customerId: 0,
                        firstName: infoUser.firstName,
                        lastName: infoUser.lastName,
                        phoneNumber: phoneNumber,
                    };
                    for (let i = 0; i < blockAppointments.length; i++) {
                        this.props.actions.appointment.updateCustomerInAppointment(blockAppointments[i].appointmentId, body);
                    }
                }
            }
        } catch (error) {
            //console.log('error : ', error);
        }

    }

    // ----------- Change Flow Checkout ------------

    getTypesOfMoneyAppointmenr = (appointmentDetail) => {
        const tipAmount = appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = !_.isEmpty(appointmentDetail) && appointmentDetail && appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
        const discount = appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail.tax ? appointmentDetail.tax : 0;
        const total = appointmentDetail.total ? appointmentDetail.total : 0;

        const temptSubTotal = _.isEmpty(appointmentDetail) ? subTotalLocal : subTotal;
        const temptTotal = _.isEmpty(appointmentDetail) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : total;
        const temptDiscount = _.isEmpty(appointmentDetail) ? discountTotalLocal : discount;
        const temptTip = _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
        const temptTax = _.isEmpty(appointmentDetail) ? taxLocal : tax;

        return {
            temptSubTotal,
            temptTotal,
            temptDiscount,
            temptTip,
            temptTax
        }

    }

    addAppointmentCheckout = () => {
        this.props.gotoAppointmentTabToGroup();
    }

    closePopupProductPaymentDetails = () => {
        this.setState({
            visiblePopupPaymentDetails: false
        })
    }

    nextPayment = async () => {
        await this.setState({
            visiblePopupPaymentDetails: false
        })
    }

   

    submitSerialCode = async (code) => {
        const { groupAppointment, profile, token, profileStaffLogin ,blockAppointments} = this.props;
        const { customerInfoByPhone, infoUser,
            paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal,
        } = this.state;

        if(blockAppointments.length > 0){
            this.addGiftCardIntoBlockAppointment(code);
            return;
        }

        if (!_.isEmpty(groupAppointment)) {
            this.props.actions.appointment.checkSerialNumber(code);
        } else {

            const moneyUserGiveForStaff = parseFloat(formatNumberFromCurrency(this.modalBillRef.current.state.quality));
            const method = this.getPaymentString(paymentSelected);
            const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;


            const bodyAction = {
                merchantId: profile.merchantId,
                userId: userId,
                status: 'checkin',
                services: [],
                extras: [],
                products: [],
                fromTime: moment.parseZone(new Date()).local().format('MM/DD/YYYY h:mm A'),
                staffId: profileStaffLogin.staffId ? profileStaffLogin.staffId : 0,
                customDiscountFixed: customDiscountFixedLocal,
                customDiscountPercent: customDiscountPercentLocal,
                firstName: infoUser.firstName ? infoUser.firstName : "",
                lastName: infoUser.lastName ? infoUser.lastName : "",
                phoneNumber: infoUser.phoneNumber ? infoUser.phoneNumber : ""
            };
            const optionAction = {
                method: 'POST',
                token: true,
                api: `${apiConfigs.BASE_API}appointment`,
                paymentMethod: method,
                isLoading: true,
                paidAmount: moneyUserGiveForStaff,
                creditCardInfo: false,
                merchantId: profile.merchantId,
                isPayment: false
            };

            this.props.actions.appointment.checkSerialNumber(code, bodyAction, optionAction);
        }

        await this.setState({
            isShowColProduct: false,
            isShowColAmount: false,
            categorySelected: {
                categoryId: -1,
                categoryType: ''
            },
            productSeleted: {
                name: ''
            },
            categoryTypeSelected: '',
            extraSelected: {
                extraId: -1,
                name: ''
            },
        });

    }

    confimPayOfflinemode = () => {
        this.setState({
            visibleScanCode: true
        })
    }

    onRequestCloseScanCode = () => {
        this.setState({
            visibleScanCode: false
        })
    }

    resultScanCode = async (e) => {
        await this.setState({
            visibleScanCode: false,
        });
        const { appointmentOfflineMode } = this.state;
        const tempDate = { ...appointmentOfflineMode, paymentTransactionId: e.data };
        this.props.actions.dataLocal.addAppointmentOfflineMode(tempDate);
        this.props.actions.appointment.showModalPrintReceipt();
    }

    getExtrasFromRedux = (productSeleted) => {
        const { extrasByMerchant } = this.props;
        const extrasBySort = [];

        for (let i = 0; i < extrasByMerchant.length; i++) {
            for (let j = 0; j < productSeleted.extras.length; j++) {
                const extraLocal = productSeleted.extras[j];
                const extralGlobal = extrasByMerchant[i];
                if (extralGlobal.extraId === extraLocal.extraId && extralGlobal.isDisabled === 0) {
                    extrasBySort.push(extralGlobal);
                    break;
                }
            }
        }

        return extrasBySort;
    }


    createABlockAppointment = () => {
        const { profile, fromTimeBlockAppointment } = this.props;
        const { customerInfoByPhone, infoUser, } = this.state;
        const userId = customerInfoByPhone.userId ? customerInfoByPhone.userId : 0;
        this.props.actions.appointment.createBlockAppointment(profile.merchantId,
            fromTimeBlockAppointment,
            userId,
            infoUser.firstName,
            infoUser.lastName,
            infoUser.phoneNumber,
        );
    }

    addBlockAppointment = async () => {
        const { blockAppointments ,isOpenBlockAppointmentId} = this.props;
        const { categoryTypeSelected, basket, productSeleted, extraSelected } = this.state;

        let isAppointmentIdOpen = "";

        for (let i = 0; i < this.blockAppointmentRef.length; i++) {
            if (!this.blockAppointmentRef[i].state.isCollapsed) {
                isAppointmentIdOpen = this.blockAppointmentRef[i].props.appointmentDetail.appointmentId;
                break;
            }
        }

        const appointmentId = isAppointmentIdOpen ? isAppointmentIdOpen : isOpenBlockAppointmentId;

        if (categoryTypeSelected === 'Product') {
            this.props.actions.appointment.addItemIntoAppointment(
                {
                    services: [],
                    extras: [],
                    products: [{
                        productId: productSeleted.productId,
                        quantity: this.amountRef.current.state.quanlity
                    }],
                    giftCards: []
                }, appointmentId, false, true);
        } else { // ------------- Buy online Extra , Service ---------
            const temptExtra = extraSelected.extraId !== -1 ? [{ extraId: extraSelected.extraId }] : [];
            this.props.actions.appointment.addItemIntoAppointment(
                {
                    services: [{
                        serviceId: productSeleted.serviceId
                    }],
                    extras: temptExtra,
                    products: [],
                    giftCards: []
                }, appointmentId, false, true);
        }

        await this.setState({
            isShowColProduct: false,
            isShowColAmount: false,
            categorySelected: {
                categoryId: -1,
                categoryType: ''
            },
            productSeleted: {
                name: ''
            },
            categoryTypeSelected: '',
            extraSelected: {
                extraId: -1,
                name: ''
            },
        });

    }

    addGiftCardIntoBlockAppointment = (code) =>{
        const {isOpenBlockAppointmentId,blockAppointments} = this.props;
        let isAppointmentIdOpen = "";
        for (let i = 0; i < this.blockAppointmentRef.length; i++) {
            if (!this.blockAppointmentRef[i].state.isCollapsed) {
                isAppointmentIdOpen = this.blockAppointmentRef[i].props.appointmentDetail.appointmentId;
                break;
            }
        }

        const appointmentId = isAppointmentIdOpen ? isAppointmentIdOpen : isOpenBlockAppointmentId;
        this.props.actions.appointment.addGiftCardIntoBlockAppointment(code,appointmentId);
    }

    removeItemInBlockAppointment = (dataRemove) => {
        const { blockAppointments } = this.props;
        let isAppointmentIdOpen = "";
        for (let i = 0; i < this.blockAppointmentRef.length; i++) {
            if (!this.blockAppointmentRef[i].state.isCollapsed) {
                isAppointmentIdOpen = this.blockAppointmentRef[i].props.appointmentDetail.appointmentId;
                break;
            }
        }
        const appointmentId = isAppointmentIdOpen ? isAppointmentIdOpen : blockAppointments[0].appointmentId;
        this.props.actions.appointment.removeItemIntoAppointment(dataRemove, appointmentId, false, true);
    }

    removeBlockAppointment = (appointmentId) => {
        const { profile } = this.props;
        this.props.actions.appointment.cancleAppointment(appointmentId, profile.merchantId, 0, true);
    }


    bookBlockAppointment = () => {
        this.props.gotoTabAppointment();
        this.props.actions.appointment.bookBlockAppointment();
        this.setState(initState);
        this.blockAppointmentRef = [];
    }

    toggleCollaps = (appointmentIdSelection) => {
        for (let i = 0; i < this.blockAppointmentRef.length; i++) {
            const appointmentDetail = this.blockAppointmentRef[i].props.appointmentDetail;
            if (appointmentDetail && appointmentDetail.appointmentId === appointmentIdSelection) {
                this.props.actions.appointment.updateIdBlockAppointmentOpen(appointmentDetail.appointmentId);
                this.blockAppointmentRef[i].setStateFromParent(false);
            } else {
                this.blockAppointmentRef[i].setStateFromParent(true);
            }
        }
    }

    setBlockToggleCollaps = () => {
        const { isOpenBlockAppointmentId } = this.props;
        for (let i = 0; i < this.blockAppointmentRef.length; i++) {
            const appointmentDetail = this.blockAppointmentRef[i].props.appointmentDetail;
            if (appointmentDetail.appointmentId === isOpenBlockAppointmentId) {
                this.blockAppointmentRef[i].setStateFromParent(false);
            } else {
                this.blockAppointmentRef[i].setStateFromParent(true);
            }
        }
    }

    addBlockAppointmentRef = ref => {
        if (ref) {
            this.blockAppointmentRef.push(ref);
        };
    }

    updateBlockAppointmentRef = () => {
        const { isOpenBlockAppointmentId, idNextToAppointmentRemove } = this.props;

        const temptBlockAppointmentRef = this.blockAppointmentRef.filter((block) => block._isMounted);

        if (temptBlockAppointmentRef.length > 0) {
            this.blockAppointmentRef = temptBlockAppointmentRef;

            let isAppointmentOpenExist = false;
            for (let i = 0; i < this.blockAppointmentRef.length; i++) {
                const appointmentDetail = this.blockAppointmentRef[i].props.appointmentDetail;
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

    }

    async  componentDidUpdate(prevProps, prevState) {
        const { isLoadingGetBlockAppointment, blockAppointments, isLoadingRemoveBlockAppointment } = this.props;
        if (blockAppointments.length > 0 && prevProps.isLoadingRemoveBlockAppointment != isLoadingRemoveBlockAppointment && !isLoadingRemoveBlockAppointment) {
            this.updateBlockAppointmentRef();
        }
        if (blockAppointments.length > 0 && prevProps.isLoadingGetBlockAppointment != isLoadingGetBlockAppointment && !isLoadingGetBlockAppointment) {
            this.setBlockToggleCollaps();
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    token: state.dataLocal.token,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    loading: state.app.loading,
    isGetAppointmentSucces: state.appointment.isGetAppointmentSucces,
    visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,
    profile: state.dataLocal.profile,
    isDonePayment: state.appointment.isDonePayment,
    connectionSignalR: state.appointment.connectionSignalR,
    flagSignInAppointment: state.appointment.flagSignInAppointment,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
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
    isLoadingRemoveBlockAppointment: state.appointment.isLoadingRemoveBlockAppointment,
    idNextToAppointmentRemove: state.appointment.idNextToAppointmentRemove,
    fromTimeBlockAppointment: state.appointment.fromTimeBlockAppointment
})

export default connectRedux(mapStateToProps, TabCheckout);
