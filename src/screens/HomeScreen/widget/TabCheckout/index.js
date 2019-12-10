import React from 'react';
import _ from 'ramda';
import { StarPRNT } from 'react-native-star-prnt';
const signalR = require('@aspnet/signalr');
import { Alert, NativeModules } from 'react-native';
import moment from 'moment';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, formatNumberFromCurrency, formatMoney, getStaffInfoById
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
    visiblePopupPaymentDetails: false
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

    addAmount = async () => {
        const { groupAppointment } = this.props;
        const { categoryTypeSelected, basket, productSeleted, extraSelected } = this.state;

        if (!_.isEmpty(groupAppointment)) {  // ------------- Buy online ---------
            const appointments = groupAppointment.appointments ? groupAppointment.appointments : [];
            const mainAppointment = appointments.find(appointment => appointment.isMain === 1);
            // console.log('mainAppointment : ', mainAppointment);
            const appointmentId = mainAppointment && mainAppointment.appointmentId ? mainAppointment.appointmentId : 0;
            if (categoryTypeSelected === 'Product') {
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [],
                        extras: [],
                        products: [{
                            productId: productSeleted.productId,
                            quantity: this.amountRef.current.state.quanlity
                        }]
                    }, appointmentId, true);
            } else { // ------------- Buy online Extra , Service ---------
                const temptExtra = extraSelected.extraId !== -1 ? [{ extraId: extraSelected.extraId }] : [];
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [{
                            serviceId: productSeleted.serviceId
                        }],
                        extras: temptExtra,
                        products: []
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
                await this.setState({
                    basket: temptBasket,
                    subTotalLocal: this.getPriceOfline(temptBasket),
                    taxLocal: this.calculateTotalTaxLocal(temptBasket)
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



    getPriceOfline(basket) {
        // console.log('basket : ' + JSON.stringify(basket));
        let total = 0;
        for (let i = 0; i < basket.length; i++) {
            if (basket[i].type === "Product") {
                total = total + parseFloat(basket[i].data.price) * basket[i].quanlitySet;
                // console.log('total : ', total);
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
        console.log('appointmentId : ', appointmentId);
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
            }
            this.props.actions.appointment.removeItemIntoAppointment(dataRemove, appointmentId, isGroup);
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
        if (changeButtonDone && !isDonePayment && paymentSelected === 'Harmony Pay') {
        } else {
            this.setState(prevState => ({
                paymentSelected: payment === prevState.paymentSelected ? '' : payment
            }))
        }


    }

    showColAmount = (item) => {
        const { categoryTypeSelected } = this.state;
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
        const { connectionSignalR } = this.props;
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

    }

    setStateFromParent = () => {
        this.setState(initState);
    }

    getPaymentString(type) {
        let method = '';
        switch (type) {
            case 'Harmony Pay':
                method = 'harmony';
                break;
            case 'Cash':
                method = 'cash';
                break;
            case 'Credit Cards':
                method = 'credit_card';
                break;
            case 'Others - Check':
                method = 'orther';
                break;
            default:
                method = 'cash'
        }
        return method
    }

    payBasket = async () => {
        await this.setState({
            visibleBillOfPayment: true
        })
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
                    productId: basket[i].data.productId,
                    quantity: basket[i].quanlitySet
                });
            } else if (basket[i].type === 'Service') {
                staffId = basket[i].staff && basket[i].staff.staffId ? basket[i].staff.staffId : 0;
                arryaServicesBuy.push({
                    serviceId: basket[i].data.serviceId,
                    staffId: basket[i].staff && basket[i].staff.staffId ? basket[i].staff.staffId : 0,
                    tipAmount: basket[i].staff && basket[i].staff.tip ? basket[i].staff.tip : 0,
                });
            } else if (basket[i].type === 'Extra') {
                arrayExtrasBuy.push({
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

    getHour() {
        const hours = parseInt(new Date().getHours()) - 12 > 0 ? parseInt(new Date().getHours()) - 13 : parseInt(new Date().getHours());
        const surfix = parseInt(new Date().getHours()) - 12 > 0 ? 'PM' : 'AM'
        // const temptDate = `${hours}:${new Date().getMinutes()}:${new Date().getSeconds()} ${surfix}`;
        const temptDate = `${hours}:${(new Date().getMinutes()) > 10 ? (new Date().getMinutes()) : `0${(new Date().getMinutes())}`} ${surfix}`;

        return temptDate;
    }

    getDate() {
        return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    }

    async printInvoice(isShowTip = false) {
        // ------------------------
        const { appointmentDetail } = this.props;
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, taxLocal, methodPayment } = this.state;
        // methodPayment === 'credit_card'

        const tipAmount = appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
        const discount = appointmentDetail.discount ? appointmentDetail.discount : 0;
        const tax = appointmentDetail.tax ? appointmentDetail.tax : 0;
        const total = appointmentDetail.total ? appointmentDetail.total : 0;

        const temptSubTotal = _.isEmpty(appointmentDetail) ? subTotalLocal : subTotal;
        const temptTotal = _.isEmpty(appointmentDetail) ? Number(formatNumberFromCurrency(subTotalLocal) + formatNumberFromCurrency(tipLocal) + formatNumberFromCurrency(taxLocal) - formatNumberFromCurrency(discountTotalLocal)).toFixed(2) : total;
        const temptDiscount = _.isEmpty(appointmentDetail) ? discountTotalLocal : discount;
        const temptTip = _.isEmpty(appointmentDetail) ? tipLocal : tipAmount;
        const temptTax = _.isEmpty(appointmentDetail) ? taxLocal : tax;

        // ------------------------

        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            if (printer.length > 0) {
                const portName = printer[0].portName;
                // -------- GET INFO BILL --------
                const { profile, profileStaffLogin } = this.props;
                const { firstName, lastName, phoneNumber } = this.state.infoUser;
                const commands = [];
                const temptDate = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
                commands.push({ appendInternational: StarPRNT.InternationalType.UK });

                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: `${profile.businessName}\n`,
                });
                commands.push({ enableEmphasis: false });

                profile.addressFull ? commands.push({
                    appendAlignment: 'Center',
                    data: `${profile.addressFull ? profile.addressFull : ''}\n`,
                }) : '';

                commands.push({
                    appendAlignment: 'Center',
                    data: `Tel: ${profile.phone}\n`
                });

                commands.push({
                    appendAlignment: 'Center',
                    data: `${profile.webLink}\n`
                });

                commands.push({ appendLineFeed: 1 });

                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: `SALE\n`,
                });
                commands.push({ appendLineFeed: 1 });
                commands.push({ enableEmphasis: false });

                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: "- - - - - - - - - - - - - - - -\n"
                });
                commands.push({ enableEmphasis: false });

                commands.push({
                    append: `Dated: ${this.getDate()} ${this.getHour()}\n`
                });
                commands.push({
                    append: `Staff: ${profileStaffLogin.displayName}\n`
                });
                commands.push({
                    append: `Invoice No: 1038400389489\n`
                });

                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: "- - - - - - - - - - - - - - - -\n"
                });
                commands.push({ enableEmphasis: false });


                commands.push({
                    appendAbsolutePosition: 0,
                    data: `DESCRIPTION`
                });

                commands.push({
                    appendAbsolutePosition: 190,
                    data: `QTY`
                });

                commands.push({
                    appendAbsolutePosition: 280,
                    data: `PRICE\n`
                });

                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: "- - - - - - - - - - - - - - - -\n"
                });
                commands.push({ enableEmphasis: false });

                // ------- Item ------ 
                commands.push({ appendFontStyle: 'B' });

                for (let i = 0; i < basket.length; i++) {
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `${basket[i].data.name}`,
                    })

                    commands.push({
                        appendAbsolutePosition: 195,
                        data: `${basket[i].quanlitySet ? basket[i].quanlitySet : ''}`
                    })

                    commands.push({
                        appendAbsolutePosition: 270,
                        data: `$ ${basket[i].data.price}\n`
                    })
                };
                commands.push({ appendFontStyle: 'A' });


                commands.push({ enableUnderline: true });
                commands.push({ enableEmphasis: true });
                commands.push({
                    appendAlignment: 'Center',
                    data: "                                \n",

                });
                commands.push({ appendLineFeed: 1 });
                commands.push({ enableUnderline: false });
                commands.push({ enableEmphasis: false });

                commands.push({ appendFontStyle: 'B' });
                // --------- Row 0 ---------
                commands.push({
                    appendAbsolutePosition: 0,
                    data: `Sub total`
                })

                commands.push({
                    appendAbsolutePosition: 270,
                    data: `$ ${formatMoney(temptSubTotal)}\n`
                })
                // --------- Row 2 ---------
                commands.push({
                    appendAbsolutePosition: 0,
                    data: `TAX`
                })

                commands.push({
                    appendAbsolutePosition: 270,
                    data: `$ ${formatMoney(temptTax)}\n`
                })

                // --------- Row 3 ---------
                commands.push({
                    appendAbsolutePosition: 0,
                    data: `Discount`
                })

                commands.push({
                    appendAbsolutePosition: 270,
                    data: `$ ${formatMoney(temptDiscount)}\n`
                });

                if (!isShowTip) {
                    // --------- Row 1 ---------
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `Tip`
                    })

                    commands.push({
                        appendAbsolutePosition: 270,
                        data: `$ ${formatMoney(temptTip)}\n`
                    })

                    commands.push({ appendFontStyle: 'A' });
                    // --------- Row 4 ---------
                    commands.push({ enableEmphasis: true });
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `TOTAL`
                    })

                    commands.push({
                        appendAbsolutePosition: 270,
                        data: `$ ${formatMoney(temptTotal)}\n`
                    })
                    // commands.push({ enableEmphasis: false });

                } else {
                    commands.push({ appendFontStyle: 'A' });
                    commands.push({ enableEmphasis: true });
                    commands.push({ appendLineFeed: 1 });
                    // --------- Row Tip ---------
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `Tip`
                    });

                    commands.push({
                        appendAbsolutePosition: 180,
                        data: `_ _ _ _ _ _ _ _ _\n`
                    });

                    commands.push({ appendLineFeed: 1 });
                    // --------- Row Total ---------

                    commands.push({ enableEmphasis: true });
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `TOTAL`
                    })

                    commands.push({
                        appendAbsolutePosition: 180,
                        data: `_ _ _ _ _ _ _ _ _\n`
                    });
                }

                if (methodPayment === 'credit_card') {
                    commands.push({ appendLineFeed: 1 });
                    commands.push({ enableEmphasis: true });
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `Signature`
                    })

                    commands.push({
                        appendAbsolutePosition: 180,
                        data: `_ _ _ _ _ _ _ _ _\n`
                    });
                }


                // ---------- End --------
                commands.push({ enableEmphasis: false });
                commands.push({ appendLineFeed: 1 });
                commands.push({
                    appendAlignment: 'Center',
                    data: `Thank you !\n`
                });
                commands.push({
                    appendAlignment: 'Center',
                    data: `please come again\n`
                });

                commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
                const result = await PrintManager.getInstance().print(portName, commands);
            } else {
                setTimeout(() => {
                    alert('Please connect to your print ! ')
                }, 500)
            }
        } catch (error) {
            // console.log('scan error : ', error);
        }

    }

    addAppointmentOfflineMode() {
        const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal,
            infoUser, tipLocal, subTotalLocal, taxLocal
        } = this.state;
        const { profile } = this.props;
        let method = this.getPaymentString(paymentSelected);
        const dataAnymousAppoitment = this.getBasketOffline();
        const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
        const appointmentOfflineMode = {
            firstName: infoUser.firstName,
            lastName: infoUser.lastName,
            phoneNumber: infoUser.phoneNumber,
            subtotal: subTotalLocal ? parseFloat(subTotalLocal) : 0,
            tax: taxLocal ? parseFloat(taxLocal) : 0,
            tipAmount: tipLocal ? parseFloat(tipLocal) : 0,
            qrcode: 'https://www.harmonypayment.com',
            merchantId: profile.merchantId,
            services: arryaServicesBuy,
            extras: arrayExtrasBuy,
            products: arrayProductBuy,
            fromTime: moment.parseZone(new Date()).local().format('MM/DD/YYYY h:mm A'),
            staffId,
            customDiscountFixed: customDiscountPercentLocal,
            customDiscountPercent: customDiscountFixedLocal,
            paymentMethod: method
        };
        this.props.actions.appointment.addAppointmentOfflineMode(appointmentOfflineMode);
    }

    donotPrintBill = () => {
        // ------- Handle Offline mode ------
        const { isOfflineMode } = this.props;
        if (isOfflineMode) {
            this.addAppointmentOfflineMode();
        }
        // ---------------------------------

        const { connectionSignalR } = this.props;
        const { paymentSelected } = this.state;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        if (paymentSelected === 'Cash' || paymentSelected === 'Others - Check') {
            this.openCashDrawer();
        }
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
    }


    printBill = async () => {
        // ------- Handle Offline mode ------
        const { isOfflineMode } = this.props;
        if (isOfflineMode) {
            this.addAppointmentOfflineMode();
        }
        // ---------------------------------

        const printer = await PrintManager.getInstance().portDiscovery();
        if (printer.length > 0) {
            const { paymentSelected, basket } = this.state;
            const { connectionSignalR } = this.props;
            if (!_.isEmpty(connectionSignalR)) {
                connectionSignalR.stop();
            }
            if (paymentSelected === 'Cash' || paymentSelected === 'Others - Check') {
                this.openCashDrawer();
            }
            this.printInvoice();
            this.scrollTabRef.current.goToPage(0);
            this.props.actions.appointment.closeModalPaymentCompleted();
            this.props.gotoAppoitmentScreen();
            this.props.actions.appointment.resetBasketEmpty();
            this.setState(initState);
            this.props.actions.appointment.resetPayment();

            // console.log('----- basket : ' + JSON.stringify(basket));
        } else {
            alert('Please connect to your print ! ');
        }

    }

    openCashDrawer = async (isDelay = false) => {
        this.setState({
            visiblePopupPaymentDetails: true
        })
    }

    // ------------ Signal R -------

    setupSignalR(profile, token, appointmentDetail) {

        try {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${apiConfigs.BASE_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app`, { accessTokenFactory: () => token })
                .configureLogging({
                    log: function (logLevel, message) {
                    }
                })
                .build();

            connection.on("ListWaNotification", (data) => {
                const temptData = JSON.parse(data);
                // console.log('temptData : ' + JSON.stringify(temptData)); 
                // checkoutGroupId
                if (!_.isEmpty(temptData.data) && temptData.data.isPaymentHarmony
                    && temptData.data.appointmentId == appointmentDetail.appointmentId
                ) {
                    this.props.actions.appointment.donePaymentHarmony();
                    connection.stop();
                }
                // ---------- Handle reload Tip in Customer App ---------
                if (!_.isEmpty(temptData.data) && temptData.data.isTipAppointment
                    && temptData.data.appointmentId == appointmentDetail.appointmentId
                ) {
                    this.props.actions.appointment.getAppointmentById(appointmentDetail.appointmentId);
                }
            });

            connection.onclose(async (error) => {
                // console.log('----- Close -----');
                this.props.actions.appointment.resetConnectSignalR();
            });


            connection.start()
                .then(() => this.props.actions.appointment.referenceConnectionSignalR(connection));
            // .catch(error => { });

        } catch (error) {
            // console.log('------ error : ', error);
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
        const { groupAppointment, paymentDetilInfo } = this.props;
        if (_.isEmpty(paymentDetilInfo)) {
            const { total, subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
            const temptTotal = _.isEmpty(groupAppointment) ? Number(subTotalLocal + tipLocal + parseFloat(taxLocal) - discountTotalLocal).toFixed(2) : groupAppointment.total;
            this.modalBillRef.current.setStateFromParent(`${temptTotal}`);
        } else {
            const totalExact = paymentDetilInfo.dueAmount ? paymentDetilInfo.dueAmount : 0;
            this.modalBillRef.current.setStateFromParent(`${totalExact}`);
        }


    }

    doneBill = async () => {
        const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal, infoUser } = this.state;
        const { groupAppointment, profile, paxMachineInfo } = this.props;

        const { subTotalLocal, tipLocal, discountTotalLocal, taxLocal } = this.state;
        const temptTotal = _.isEmpty(groupAppointment) ? Number(subTotalLocal + tipLocal + parseFloat(taxLocal) - discountTotalLocal).toFixed(2) : groupAppointment.total;
        const moneyUserGiveForStaff = parseFloat(formatNumberFromCurrency(this.modalBillRef.current.state.quality));
        const moneyChange = moneyUserGiveForStaff - parseFloat(formatNumberFromCurrency(temptTotal));
        const method = this.getPaymentString(paymentSelected);


        if (moneyUserGiveForStaff == 0) {
            alert('Enter amount!');
        } else {
            await this.setState({
                visibleBillOfPayment: false,
            });

            this.modalBillRef.current.setStateFromParent(`0`);
            if (!_.isEmpty(groupAppointment)) {
                if (method === 'harmony') {
                    console.log('harmony');
                } else if (method === 'credit_card') {

                    if (paxMachineInfo.isSetup) {
                        this.hanleCreditCardProcess(true, moneyUserGiveForStaff);
                    } else {
                        setTimeout(() => {
                            alert('Please setup your pax machine in setting');
                        }, 300)

                    }

                } else {
                    this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff);
                }

            } else { // ------ Handle Buy at store -------
                if (method === 'credit_card') {
                    this.hanleCreditCardProcess(false, moneyUserGiveForStaff);
                } else {
                    const dataAnymousAppoitment = this.getBasketOffline();
                    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;
                    this.props.actions.appointment.createAnymousAppointment(profile.merchantId, arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
                        customDiscountPercentLocal, customDiscountFixedLocal, staffId,
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

        const moneyCreditCard = parseFloat(formatNumberFromCurrency(moneyUserGiveForStaff)).toFixed(2) * 100;
        console.log("moneyUserGiveForStaff : ", moneyCreditCard)
        // 3. Send Transaction 
        PosLink.sendTransaction(moneyCreditCard, (message) => this.handleResponseCreditCard(message, online, moneyUserGiveForStaff));
    }

    async handleResponseCreditCard(message, online, moneyUserGiveForStaff) {
        await this.setState({
            visibleProcessingCredit: false
        })
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                setTimeout(() => {
                    alert(result.message);
                }, 300)

            } else {
                const { profile, groupAppointment } = this.props;
                const { paymentSelected, customDiscountPercentLocal, customDiscountFixedLocal, infoUser } = this.state;
                let method = this.getPaymentString(paymentSelected);

                if (online) {
                    // ------ Payment with credit online card success ----
                    this.props.actions.appointment.paymentAppointment(groupAppointment.checkoutGroupId, method, moneyUserGiveForStaff, message, profile.merchantId);
                } else {
                    // ------ Payment with credit offline card success ----
                    const dataAnymousAppoitment = this.getBasketOffline();
                    const { arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, staffId } = dataAnymousAppoitment;

                    this.props.actions.appointment.createAnymousAppointment(profile.merchantId, arrayProductBuy, arryaServicesBuy, arrayExtrasBuy, method, true,
                        customDiscountPercentLocal, customDiscountFixedLocal, staffId,
                        infoUser.firstName,
                        infoUser.lastName,
                        infoUser.phoneNumber,
                        moneyUserGiveForStaff,
                        message,
                    );
                }
            }
        } catch (error) {
            // console.log('error : ', error)
        }
    }

    cancelTransaction = async () => {
        await this.setState({
            visibleProcessingCredit: false,
            changeButtonDone: false,
        });
        PosLink.cancelTransaction()
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
        console.log('appointmentId : ', appointmentId);
        this.changeStylistRef.current.setStateFromParent(service, appointmentId);
        await this.setState({
            visibleChangeStylist: true,
            // appointmentIdChangeStylist: appointmentId
        })
    }

    donePayment = () => {
        const { methodPayment } = this.state;
        const { appointmentDetail, appointmentIdOffline } = this.props;
        const temptAppointmentId = _.isEmpty(appointmentDetail) ? appointmentIdOffline : appointmentDetail.appointmentId;
        if (methodPayment !== 'cash') {
            if (methodPayment === 'harmony') {
                setTimeout(() => {
                    this.props.actions.appointment.showModalPrintReceipt();
                }, 500);
            } else if (methodPayment === 'credit_card') {
                this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
                setTimeout(() => {
                    this.props.actions.appointment.showModalPrintReceipt();
                }, 500);
            } else {
                this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
                this.props.actions.appointment.showModalPrintReceipt();
            }
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

    changeStylistBasketLocal = async (serviceId, staffId, tip) => {
        const { basket } = this.state;
        const { listStaffByMerchant } = this.props;
        if (staffId) {
            const temptStaff = getStaffInfoById(listStaffByMerchant, staffId);
            const temptBasket = basket.map((item, index) => {
                if (item.type === 'Service' && item.data.serviceId === serviceId) {
                    return {
                        ...item,
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
        const { basket, subTotalLocal, tipLocal, discountTotalLocal, customDiscountPercentLocal,
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

    async callbackDiscountToParent(customDiscountPercentLocal, customDiscountFixedLocal, discountTotalLocal) {
        await this.setState({
            customDiscountPercentLocal,
            customDiscountFixedLocal,
            discountTotalLocal
        })
    }

    cancelHarmonyPayment = async () => {
        await this.setState({
            changeButtonDone: false,
            paymentSelected: '',
        });
        this.props.actions.appointment.cancelHarmonyPayment(this.props.appointmentDetail.appointmentId);
        this.props.actions.appointment.resetPayment();
        const { connectionSignalR } = this.props;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
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
        const firstName = this.customerNameRef.current.state.firstName;
        const lastName = this.customerNameRef.current.state.lastName;
        const { infoUser } = this.state;

        await this.setState({
            infoUser: { ...infoUser, firstName, lastName },
            visibleCustomerName: false
        })

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
        const { infoUser } = this.state;
        const codeAreaPhone = this.CustomerPhoneRef.current.state.codeAreaPhone;
        const phone = this.CustomerPhoneRef.current.state.phone;
        const phoneNumber = `${codeAreaPhone}${phone}`;
        await this.setState({
            infoUser: { ...infoUser, phoneNumber },
            visibleCustomerPhone: false
        })
    }

    // ----------- Change Flow Checkout ------------

    getTypesOfMoneyAppointmenr = (appointmentDetail) => {
        const tipAmount = appointmentDetail.tipAmount ? appointmentDetail.tipAmount : 0;
        const subTotal = appointmentDetail.subTotal ? appointmentDetail.subTotal : 0;
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


    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentTabParent, appointmentDetail, loading, isGetAppointmentSucces,
            isDonePayment
        } = this.props;
        if (!loading && isGetAppointmentSucces && currentTabParent === 2) {
            const { services, products, extras } = appointmentDetail;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
            this.props.actions.appointment.resetKeyUpdateAppointment();
            await this.setState({
                total: appointmentDetail.total,
                basket: temptBasket,
                appointmentId: appointmentDetail.appointmentId,
                infoUser: {
                    firstName: appointmentDetail.firstName,
                    lastName: appointmentDetail.lastName,
                    phoneNumber: appointmentDetail.phoneNumber,
                }
            });
        }
        if (isDonePayment) {
            this.props.actions.appointment.resetPayment();
            this.donePayment();
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
    appointmentIdOffline: state.appointment.appointmentIdOffline,
    connectionSignalR: state.appointment.connectionSignalR,
    flagSignInAppointment: state.appointment.flagSignInAppointment,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    extrasByMerchant: state.extra.extrasByMerchant,
    listStaffByMerchant: state.staff.listStaffByMerchant,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    isOfflineMode: state.network.isOfflineMode,
    groupAppointment: state.appointment.groupAppointment,
    visiblePopupPaymentDetails: state.appointment.visiblePopupPaymentDetails,
    paymentDetilInfo: state.appointment.paymentDetilInfo,
    visibleChangeMoney: state.appointment.visibleChangeMoney
})

export default connectRedux(mapStateToProps, TabCheckout);
