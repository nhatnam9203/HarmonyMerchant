import React from 'react';
import _ from 'ramda';
import { StarPRNT } from 'react-native-star-prnt';

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
    visiblePaymentCompleted: false
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

    payBasket = () => {
        const { appointmentId, paymentSelected, basket } = this.state;
        for (let i = 0; i < basket.length; i++) {
            console.log('basket item : ', basket[i]);
            console.log(`${basket[i].data.name}`);
        }
    }

    payBasket = async () => {
        const { appointmentId, paymentSelected, basket } = this.state;
        let method = this.getPaymentString(paymentSelected);
        if (appointmentId !== -1) {
            // --------- Payment with appointment -----
            this.props.actions.appointment.paymentAppointment(appointmentId, method);
        } else {
            //-------Payment Anymous ------
            const { profile } = this.props;
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

    async printInvoice() {
        try {
            const printer = await PrintManager.getInstance().portDiscovery();
            if (printer) {
                const portName = printer[0].portName;
                PrintManager.getInstance().openCashDrawer(portName);
                // -------- GET INFO BILL --------
                const { profile } = this.props;
                const { basket } = this.state;
                const commands = [];
                const temptDate = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
                commands.push({ appendInternational: StarPRNT.InternationalType.UK });

                commands.push({
                    append: `Business Name : ${profile.businessName}  \nAddress : ${profile.address}  \nCity, State 12345\nPhone Number :${profile.phone}  \nDate : ${temptDate}\n`
                })
                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: "----------------------\n"
                })

                for (let i = 0; i < basket.length; i++) {
                    commands.push({
                        appendAbsolutePosition: 0,
                        data: `${i + 1}`
                    })

                    commands.push({
                        appendAbsolutePosition: 50,
                        data: `${basket[i].data.name} : `
                    })

                    commands.push({
                        appendAbsolutePosition: 320,
                        data: `$  ${basket[i].data.price} \n`
                    })
                }

                commands.push({
                    appendAlignment: StarPRNT.AlignmentPosition.Center,
                    data: "\n"
                })

                commands.push({
                    appendAbsolutePosition: 0,
                    data: ``
                })

                commands.push({
                    appendAbsolutePosition: 50,
                    data: `Total : `
                })

                commands.push({
                    appendAbsolutePosition: 320,
                    data: `$  ${this.state.total} \n`
                })

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
            console.log('scan error : ', error);
        }

    }

    donotPrintBill = () => {
        this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.closeModalPaymentCompleted();
        this.props.gotoAppoitmentScreen();
        this.props.actions.appointment.resetBasketEmpty();
        this.setState(initState);
    }


    printBill = () => {
        this.printInvoice();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, isGetAppointmentSucces } = this.props;
        if (!loading && isGetAppointmentSucces) {
            this.props.actions.appointment.resetKeyUpdateAppointment();
            this.setState({
                isInitBasket: false
            })
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    loading: state.app.loading,
    isGetAppointmentSucces: state.appointment.isGetAppointmentSucces,
    visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,
    profile: state.dataLocal.profile
})



export default connectRedux(mapStateToProps, TabCheckout);