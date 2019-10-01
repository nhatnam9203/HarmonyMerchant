import React from 'react';
import _ from 'ramda';
import { StarPRNT } from 'react-native-star-prnt';
const signalR = require('@aspnet/signalr');
import { Alert, NativeModules } from 'react-native';


import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, formatNumberFromCurrency, formatMoney
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
    visibleChangeMoney: false
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
    }


    getDataColProduct() {
        const { categorySelected, categoryTypeSelected } = this.state;
        const { productsByMerchantId, servicesByMerchant } = this.props;
        const data = categoryTypeSelected === 'Service' ? servicesByMerchant : productsByMerchantId;
        const temptData = data.filter(item => {
            return item.categoryId === categorySelected.categoryId && item.isDisabled === 0;
        });
        return temptData;
    }

    onPressSelectCategory = (category) => {
        const { categorySelected } = this.state;
        if (categorySelected.categoryId !== category.categoryId) {
            this.setState({
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
        }
    }

    addAmount = async () => {
        const { categoryTypeSelected, basket, productSeleted, extraSelected, appointmentId } = this.state;
        // console.log('appointmentId : ', appointmentId);
        if (categoryTypeSelected === 'Product') {
            if (appointmentId !== -1) {
                // ------- Buy With Appointment -----
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [],
                        extras: [],
                        products: [{
                            productId: productSeleted.productId,
                            quantity: this.amountRef.current.state.quanlity
                        }]
                    }, appointmentId)
            } else {
                // ------ Buy Ofline -----------
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
                    total: this.getPriceOfline(temptBasket)
                })
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

        } else {
            if (appointmentId !== -1) {
                // ------- Buy with appointment ------
                const temptExtra = extraSelected.extraId !== -1 ? [{ extraId: extraSelected.extraId }] : [];
                this.props.actions.appointment.addItemIntoAppointment(
                    {
                        services: [{
                            serviceId: productSeleted.serviceId
                        }],
                        extras: temptExtra,
                        products: []
                    }, appointmentId)
            } else {
                // ------ Buy Offline ------
                alert('You can only sell products to visitors');
                // const temptBasket = basket.filter((item) => item.id !== `${productSeleted.serviceId}_ser`);
                // temptBasket.unshift({
                //     type: 'Service',
                //     id: `${productSeleted.serviceId}_ser`,
                //     data: {
                //         name: productSeleted.name,
                //         serviceId: productSeleted.serviceId,
                //         price: productSeleted.price
                //     },
                //     serviceName: productSeleted.name
                // });
                // const temptBasketExtra = temptBasket.filter((item) => item.id !== `${extraSelected.extraId}_extra`);
                // if (extraSelected.extraId !== -1) {
                //     temptBasketExtra.unshift({
                //         type: 'Extra',
                //         id: `${extraSelected.extraId}_extra`,
                //         data: {
                //             name: extraSelected.name,
                //             extraId: extraSelected.extraId,
                //             price: extraSelected.price
                //         },
                //         serviceName: productSeleted.name
                //     });
                // }

                // this.setState({
                //     basket: temptBasketExtra
                // })
            }
            this.setState({
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

    getPriceOfline(baseket) {
        let total = 0;
        for (let i = 0; i < baseket.length; i++) {
            // total = total + parseInt(baseket[i].data.price) 
            total = total + formatNumberFromCurrency(baseket[i].data.price);

        }
        return total;
    }

    removeItemBasket = (item) => {
        const { appointmentId, basket } = this.state;
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
            this.props.actions.appointment.removeItemIntoAppointment(dataRemove, appointmentId);
        } else {
            // -------- Remove Offline --------
            const temptBasket = basket.filter((itemBasket) => itemBasket.id !== item.id);
            this.setState({
                basket: temptBasket
            })
        }

    }

    selectedPayment = (payment) => {
        this.setState(prevState => ({
            paymentSelected: payment === prevState.paymentSelected ? '' : payment
        }))
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

    showModalDiscount = () => {
        const { appointmentDetail } = this.props;
        const discount = appointmentDetail.discount ? appointmentDetail.discount : 0;
        if (discount !== 0 && discount !== '0.00') {
            const { appointmentId } = this.state;
            this.props.actions.marketing.getPromotionByAppointment(appointmentId);
            this.setState({
                visibleDiscount: true
            })
        }
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
        const { appointmentId, paymentSelected, basket, total } = this.state;
        const { profile, token, appointmentDetail, paxMachineInfo } = this.props;
        let method = this.getPaymentString(paymentSelected);

        if (appointmentId !== -1) {
            // --------- Payment with appointment -----
            if (method === 'credit_card') {
                if (paxMachineInfo.isSetup) {
                    this.hanleCreditCardProcess();
                    await this.setState({
                        changeButtonDone: true,
                        methodPayment: method
                    });
                    this.props.actions.appointment.paymentAppointment(appointmentId, method, false);
                } else {
                    alert('Please setup your pax machine in setting');
                }

            } else {
                if (method === 'harmony') {
                    this.setupSignalR(profile, token, appointmentDetail);
                }
                if (method === 'cash') {
                    await this.setState({
                        visibleBillOfPayment: true
                    })
                }
                await this.setState({
                    changeButtonDone: true,
                    methodPayment: method
                });
                const isLoading = method === 'cash' ? false : true;
                this.props.actions.appointment.paymentAppointment(appointmentId, method, isLoading);
            }
        } else
            //-------Payment Anymous ------
            if (method === 'harmony') {
                alert('Does not support payment for anonymous customers');
            } else {
                if (method === 'credit_card') {
                    if (paxMachineInfo.isSetup) {
                        this.hanleCreditCardProcess();
                        await this.setState({
                            changeButtonDone: true,
                            methodPayment: method
                        });
                        const arrayProductBuy = basket.map((product) => {
                            if (product.type === 'Product') {
                                return {
                                    productId: product.data.productId,
                                    quantity: product.quanlitySet
                                }
                            }
                        })
                        this.props.actions.appointment.createAnymousAppointment(profile.merchantId, arrayProductBuy, method, false);
                    } else {
                        alert('Please setup your pax machine in setting');
                    }

                } else {
                    if (method === 'cash') {
                        await this.setState({
                            visibleBillOfPayment: true
                        })
                    }
                    await this.setState({
                        changeButtonDone: true,
                        methodPayment: method
                    });
                    const arrayProductBuy = basket.map((product) => {
                        if (product.type === 'Product') {
                            return {
                                productId: product.data.productId,
                                quantity: product.quanlitySet
                            }
                        }
                    })
                    const isLoadingOffline = method === 'cash' ? false : true;
                    this.props.actions.appointment.createAnymousAppointment(profile.merchantId, arrayProductBuy, method, isLoadingOffline);
                }

            }
    }

    async hanleCreditCardProcess() {
        const { total } = this.state;
        const { paxMachineInfo } = this.props;
        const { ip, port, timeout } = paxMachineInfo;

        // 1. Check setup pax 
        PosLink.setupPax(ip, port, timeout);

        // 2. Show modal processing 
        await this.setState({
            visibleProcessingCredit: true
        })

        // 3. Send Transaction 

        PosLink.sendTransaction(formatNumberFromCurrency(total) * 100, (message) => this.handleResponseCreditCard(message));
    }

    async handleResponseCreditCard(message) {
        // console.log('---- Response : ',message);
        const { appointmentId } = this.state;
        await this.setState({
            visibleProcessingCredit: false
        })
        try {
            const result = JSON.parse(message);
            if (result.status == 0) {
                await this.setState({
                    changeButtonDone: false,
                });
                setTimeout(() => {
                    alert(result.message);
                }, 200)

            } else {
                const { profile } = this.props;
                // ------ Payment with credit card success ----
                this.props.actions.appointment.submitPaymentWithCreditCard(profile.merchantId, '0', message, appointmentId);

            }
            // console.log('message : ', message);
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

    getHour() {
        const hours = parseInt(new Date().getHours()) - 12 > 0 ? parseInt(new Date().getHours()) - 13 : parseInt(new Date().getHours());
        const surfix = parseInt(new Date().getHours()) - 12 > 0 ? 'PM' : 'AM'
        const temptDate = `${hours}:${new Date().getMinutes()}:${new Date().getSeconds()} ${surfix}`;
        return temptDate;
    }

    getDate() {
        return `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    }

    async printInvoice() {
        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            if (printer.length > 0) {
                const portName = printer[0].portName;
                // PrintManager.getInstance().openCashDrawer(portName);
                // -------- GET INFO BILL --------
                const { profile } = this.props;
                const { basket, infoUser } = this.state;
                const { firstName, lastName, phoneNumber } = this.state.infoUser;
                const commands = [];
                const temptDate = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
                commands.push({ appendInternational: StarPRNT.InternationalType.UK });

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: `${profile.businessName}\n`
                });

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: `${profile.phone}\n`
                });

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: `Fax : ${profile.taxId}\n`
                });

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: `${profile.webLink}\n`
                });

                commands.push({ appendLineFeed: 2 });
                commands.push({
                    appendAbsolutePosition: 10,
                    data: `${this.getHour()}`
                });
                commands.push({
                    appendAbsolutePosition: 210,
                    data: `Drawer:Simon\n`
                });
                // ----------------
                commands.push({
                    appendAbsolutePosition: 10,
                    data: `${this.getDate()}`
                })
                commands.push({
                    appendAbsolutePosition: 210,
                    data: `#1038400389489\n`
                })
                // ----------------
                commands.push({
                    appendAbsolutePosition: 10,
                    data: `Client :${firstName} ${lastName}\n`
                });
                // ----------------
                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: "-------------------------------\n"
                });

                // ----------------
                commands.push({
                    appendAbsolutePosition: 10,
                    data: `DESCRIPTION`
                });

                commands.push({
                    appendAbsolutePosition: 220,
                    data: `QTY`
                });

                commands.push({
                    appendAbsolutePosition: 320,
                    data: `PRICE\n`
                });

                // ----------------

                commands.push({
                    appendAbsolutePosition: 10,
                    data: `---------------`
                });

                commands.push({
                    appendAbsolutePosition: 210,
                    data: `-----`
                });

                commands.push({
                    appendAbsolutePosition: 285,
                    data: `--------\n`
                });
                // ------- Price ------ 
                for (let i = 0; i < basket.length; i++) {
                    commands.push({
                        appendAbsolutePosition: 10,
                        data: `${basket[i].data.name}`,
                    })

                    commands.push({
                        appendAbsolutePosition: 230,
                        data: `${basket[i].quanlitySet ? basket[i].quanlitySet : ''}`
                    })

                    commands.push({
                        appendAbsolutePosition: 330,
                        data: `${basket[i].data.price}\n`
                    })
                }

                // --------
                commands.push({
                    appendAbsolutePosition: 10,
                    data: `                    `
                })

                commands.push({
                    appendUnderline: "           \n"
                })

                // --------
                commands.push({
                    appendAbsolutePosition: 130,
                    data: `Sub total`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `$ ${this.state.total}\n`
                });
                // --------
                commands.push({
                    appendAbsolutePosition: 200,
                    data: `Tax`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `$ 0\n`
                });
                // --------
                commands.push({
                    appendAbsolutePosition: 180,
                    data: `TOTAL`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `$ ${this.state.total}\n`
                });

                // --------
                commands.push({ appendLineFeed: 1 });

                // --------
                commands.push({
                    appendAbsolutePosition: 185,
                    data: `CASH`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `${this.state.total}\n`
                });
                // --------
                commands.push({ appendLineFeed: 1 });

                // --------
                commands.push({
                    appendAbsolutePosition: 140,
                    data: `Tendered`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `120\n`
                });

                // --------
                commands.push({
                    appendAbsolutePosition: 160,
                    data: `Change`
                });
                commands.push({
                    appendAbsolutePosition: 320,
                    data: `15\n`
                });
                // ------
                commands.push({ appendLineFeed: 1 });

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: "--- See you again ---\n"
                })


                commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
                const result = await PrintManager.getInstance().print(portName, commands);
                this.donotPrintBill();
            } else {
                alert('Please connect to your print ! ')
            }
        } catch (error) {
            // console.log('scan error : ', error);
        }

    }

    donotPrintBill = () => {
        const { connectionSignalR } = this.props;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
    }


    printBill = () => {
        const { connectionSignalR } = this.props;
        if (!_.isEmpty(connectionSignalR)) {
            connectionSignalR.stop();
        }
        this.printInvoice();
    }

    async  openCashDrawer() {
        const printer = await PrintManager.getInstance().portDiscovery();
        if (printer.length > 0) {
            const portName = printer[0].portName;
            PrintManager.getInstance().openCashDrawer(portName);
        } else {
            // alert('Please connect to your print ! ')
        }
    }

    donePayment = () => {
        const { methodPayment } = this.state;
        const { appointmentDetail, appointmentIdOffline } = this.props;
        const temptAppointmentId = _.isEmpty(appointmentDetail) ? appointmentIdOffline : appointmentDetail.appointmentId;
        if (methodPayment === 'cash') {
            this.openCashDrawer();
            this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
            this.props.actions.appointment.showModalPrintReceipt();
        } else if (methodPayment === 'harmony') {
            this.props.actions.appointment.showModalPrintReceipt();
        } else if (methodPayment === 'credit_card') {
            this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
            this.props.actions.appointment.showModalPrintReceipt();
        } else {
            this.props.actions.appointment.checkoutSubmit(temptAppointmentId);
            this.props.actions.appointment.showModalPrintReceipt();
        }
    }

    // ------------ Signal R -------

    setupSignalR(profile, token, appointmentDetail) {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiConfigs.BASE_URL}notification/?merchantId=${profile.merchantId}&Title=Merchant&kind=app`, { accessTokenFactory: () => token })
            .build();

        connection.on("ListWaNotification", (data) => {
            const temptData = JSON.parse(data);
            // console.log('temptData : ' + JSON.stringify(temptData));
            if (!_.isEmpty(temptData.data) && temptData.data.isPaymentHarmony
                && temptData.data.appointmentId == appointmentDetail.appointmentId
            ) {
                this.props.actions.appointment.donePaymentHarmony();
                this.props.actions.appointment.getAppointmentById(appointmentDetail.appointmentId);
                connection.stop();
            }
        });

        connection.onclose(async (error) => {
            this.props.actions.appointment.resetConnectSignalR();
            // console.log('error ', error);
        });

        connection.start()
            .then(() => this.props.actions.appointment.referenceConnectionSignalR(connection))
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


    disconnectSignalR = () => {

    }

    showModalBill = async () => {
        // await this.setState({
        //     visibleBillOfPayment: true
        // })
    }

    extractBill = () => {
        const { total } = this.state;
        this.modalBillRef.current.setStateFromParent(`${total}`);
    }

    doneBill = async () => {
        await this.setState({
            visibleBillOfPayment: false,
        });

        const moneyUserGiveForStaff = this.modalBillRef.current.state.quality;
        // console.log('moneyUserGiveForStaff : ',moneyUserGiveForStaff);
        const { total } = this.state;
        const moneyChange = parseFloat(formatNumberFromCurrency(moneyUserGiveForStaff)) - parseFloat(formatNumberFromCurrency(total));
        if (moneyChange === 0) {
            //    this.props.actions.appointment.showModalPrintReceipt();
        } else {
            this.cashBackRef.current.setStateFromParent(`${formatMoney(moneyChange)}`);
            await this.setState({
                visibleChangeMoney: true
            })
            // setTimeout(() => {
            //     Alert.alert(
            //         `Change : $ ${formatMoney(moneyChange)}`,
            //         ``,
            //         [
            //             { text: 'OK', onPress: () => { } },
            //         ],
            //         { cancelable: false },
            //     );
            // }, 300)

        }
        this.modalBillRef.current.setStateFromParent(`0`);
    }

    setStateVisibleFromParent = async (visibleConfirm) => {
        await this.setState({
            visibleConfirm
        })
    }

    changeStylist = async (service) => {
        this.changeStylistRef.current.setStateFromParent(service);
        await this.setState({
            visibleChangeStylist: true
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentTabParent, appointmentDetail, loading, isGetAppointmentSucces } = this.props;
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
})



export default connectRedux(mapStateToProps, TabCheckout);
