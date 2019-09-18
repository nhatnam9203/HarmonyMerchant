import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    validateIsNumber, getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils';

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
    total: 0,
    isInitBasket: true,
    appointmentId: -1,
    infoUser: {
        firstName: '',
        lastName: '',
        phoneNumber: ''
    },
    isShowAddAppointment: false,
    visibleConfirm: false
}

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
        this.state = initState;
        this.webviewRef = React.createRef();
        this.amountRef = React.createRef();
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
                },
                isShowAddAppointment: true
            }
        }
        return null
    }


    onLoadStartWebview = () => {

    }

    onLoadEndWebview = () => {
        this.props.actions.app.stopLoadingApp();
    }

    onMessageFromWebview = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        // console.log('data : ', JSON.stringify(data));
        if (validateIsNumber(data) && data < -150) {
            this.onLoadStartWebview();
        } else {
            const { action, appointmentId } = data;
            if (action === 'checkout') {
                this.props.actions.appointment.getAppointmentById(appointmentId);
                this.props.actions.appointment.checkoutAppointment(appointmentId);
                this.props.gotoCheckoutScreen();
            } else if (action == 'signinAppointment') {
                // alert('ddd')
                this.props.actions.appointment.getAppointmentById(appointmentId);
                this.props.actions.appointment.checkoutAppointment(appointmentId);

                this.setState({
                    // isShowAddAppointment: true,
                    isInitBasket: false
                })

                // this.props.actions.appointment.changeFlagSigninAppointment(true);
                // this.props.gotoCheckoutScreen();

            }
        }
    }

    // -------- Add Appointment --------
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

    getDataColProduct() {
        const { categorySelected, categoryTypeSelected } = this.state;
        const { productsByMerchantId, servicesByMerchant } = this.props;
        const data = categoryTypeSelected === 'Service' ? servicesByMerchant : productsByMerchantId;
        const temptData = data.filter(item => {
            return item.categoryId === categorySelected.categoryId && item.isDisabled === 0;
        });
        return temptData;
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

    getPriceOfline(baseket) {
        let total = 0;
        for (let i = 0; i < baseket.length; i++) {
            total = total + parseInt(baseket[i].data.price);
        }
        return total;
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
                await this.setState({
                    basket: temptBasket,
                    // total: parseInt(this.amountRef.current.state.quanlity * productSeleted.price)
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

    clearDataCofrim = () => {
        // const { connectionSignalR } = this.props;
        // if (!_.isEmpty(connectionSignalR)) {
        //     connectionSignalR.stop();
        // }
        // this.props.gotoPageCurent();
        this.setState(initState);
        this.props.actions.appointment.resetBasketEmpty();
        // this.scrollTabRef.current.goToPage(0);
        this.props.actions.appointment.resetPayment();
        this.props.actions.appointment.changeFlagSigninAppointment(false);
    }

    setStateVisibleFromParent = async (visibleConfirm) => {
        await this.setState({
            visibleConfirm
        })
    }

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
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    categoriesByMerchant: state.category.categoriesByMerchant,
    productsByMerchantId: state.product.productsByMerchantId,
    servicesByMerchant: state.service.servicesByMerchant,
    appointmentDetail: state.appointment.appointmentDetail,
    isGetAppointmentSucces: state.appointment.isGetAppointmentSucces,
})



export default connectRedux(mapStateToProps, TabAppointment);