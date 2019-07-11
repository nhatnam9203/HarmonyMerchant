import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils'

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
                    basket: temptBasket
                })
            }

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
                const temptBasket = basket.filter((item) => item.id !== `${productSeleted.serviceId}_ser`);
                temptBasket.unshift({
                    type: 'Service',
                    id: `${productSeleted.serviceId}_ser`,
                    data: {
                        name: productSeleted.name,
                        serviceId: productSeleted.serviceId,
                        price: productSeleted.price
                    },
                    serviceName: productSeleted.name
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
                    basket: temptBasketExtra
                })
            }
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
        const { appointmentId, paymentSelected } = this.state;
        let method = this.getPaymentString(paymentSelected);
        if (appointmentId !== -1) {
            // --------- Payment with appointment -----
            this.props.actions.appointment.paymentAppointment(appointmentId, method);
        }

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
    isGetAppointmentSucces: state.appointment.isGetAppointmentSucces
})



export default connectRedux(mapStateToProps, TabCheckout);