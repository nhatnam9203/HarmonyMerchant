import React from 'react';
import _ from 'ramda';
import { StarPRNT } from 'react-native-star-prnt';
const signalR = require('@aspnet/signalr');

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils';
import PrintManager from '@lib/PrintManager';

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
    isPressDone: false,
    methodPayment: ''
}

class TabCheckout extends Layout {

    constructor(props) {
        super(props);
        this.state = initState;
        this.amountRef = React.createRef();
        this.scrollTabRef = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { appointmentDetail } = nextProps;
        if (!_.isEmpty(nextProps.appointmentDetail) && !prevState.isInitBasket) {
            const { services, products, extras } = appointmentDetail;
            const arrayProducts = getArrayProductsFromAppointment(products);
            const arryaServices = getArrayServicesFromAppointment(services);
            const arrayExtras = getArrayExtrasFromAppointment(extras);
            const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
            return {
                total: appointmentDetail.total,
                basket: temptBasket,
                isInitBasket: true,
                appointmentId: appointmentDetail.appointmentId,
                infoUser: {
                    firstName: appointmentDetail.firstName,
                    lastName: appointmentDetail.lastName,
                    phoneNumber: appointmentDetail.phoneNumber,
                }
            }
        }
        return null
    }

    getDataColProduct() {
        const { categorySelected, categoryTypeSelected } = this.state;
        const { productsByMerchantId, servicesByMerchant } = this.props;
        const data = categoryTypeSelected === 'Service' ? servicesByMerchant : productsByMerchantId;
        const temptData = data.filter(item => {
            return item.categoryId === categorySelected.categoryId
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
        console.log('appointmentId : ', appointmentId);
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
                this.setState({
                    basket: temptBasket,
                    total: parseInt(this.amountRef.current.state.quanlity * productSeleted.price)
                })
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
        this.setState({
            paymentSelected: payment
        })
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
        this.setState({
            visibleDiscount: true
        })
    }

    clearDataCofrim = () => {
        this.props.gotoPageCurent();
        this.setState(initState);
        this.props.actions.appointment.resetBasketEmpty();
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.resetPayment();
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
        const { appointmentId, paymentSelected, basket } = this.state;
        const { profile, token, appointmentDetail } = this.props;
        let method = this.getPaymentString(paymentSelected);

        if (appointmentId !== -1) {
            // --------- Payment with appointment -----
            if (method === 'harmony') {
                this.setupSignalR(profile, token, appointmentDetail);
            }
            await this.setState({
                changeButtonDone: true,
                isPressDone: false,
                methodPayment: method
            });
            this.props.actions.appointment.paymentAppointment(appointmentId, method);

        } else {
            //-------Payment Anymous ------
            if (method === 'harmony') {
                alert('Does not support payment for anonymous customers');
            } else {
                const { profile } = this.props;
               await this.setState({
                    changeButtonDone: true,
                    isPressDone: false,
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
                this.props.actions.appointment.createAnymousAppointment(profile.merchantId, arrayProductBuy, method)
            }

        }
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
                const { basket } = this.state;
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
                    data: `https://www.google.com/\n`
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
                    data: `Client : Maggie Victory\n`
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
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
        this.props.actions.appointment.resetPayment();
    }


    printBill = () => {
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
            this.props.actions.appointment.showModalPrintReceipt();
        } else {
            // this.openCashDrawer();
            this.props.actions.appointment.showModalPrintReceipt();
        }
    }

    // ------------ Signal R -------

    setupSignalR(profile, token, appointmentDetail) {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://api2.levincidemo.com/notification/?merchantId=${profile.merchantId}&Title=Merchant&type=appointment_pay`, { accessTokenFactory: () => token })
            .build();

        connection.on("ListWaNotification", (data) => {
            const temptData = JSON.parse(data);
            // console.log('temptData : ', data);
            // console.log('appointmentDetail : ', appointmentDetail);
            // console.log('profile : ', profile);
            // console.log('token : ', token);

            if (!_.isEmpty(temptData.data) && temptData.data.isPaymentHarmony && temptData.data.appointmentId == appointmentDetail.appointmentId) {
                this.props.actions.appointment.donePaymentHarmony();
            }

        });

        connection.start().catch(function (err) {
            // console.log("Error on Start : ", err);
        });

        connection.onclose(async () => {
            await this.start();
        });

    }

    async  start() {
        const { profile, token } = this.props;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://api2.levincidemo.com/notification/?merchantId=${profile.merchantId}&Title=Merchant&type=appointment_pay`, { accessTokenFactory: () => token })
            .build();
        try {
            await connection.start();
            // console.log("connected");
        } catch (err) {
            // console.log(err);
            setTimeout(() => start(), 5000);
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isGetAppointmentSucces } = this.props;
        if (!loading && isGetAppointmentSucces) {
            this.props.actions.appointment.resetKeyUpdateAppointment();
            this.setState({
                isInitBasket: false,
            })
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
    appointmentIdOffline: state.appointment.appointmentIdOffline
})



export default connectRedux(mapStateToProps, TabCheckout);