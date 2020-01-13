import React from 'react';
import _ from 'ramda';
import { Alert } from 'react-native';

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
    visibleConfirm: false,
    visibleChangeStylist: false,
    visibleDiscount: false,
    appointmentIdOffline: 0
}

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
        this.state = initState;
        this.webviewRef = React.createRef();
        this.amountRef = React.createRef();
        this.changeStylistRef = React.createRef();
        this.popupEnterPinRef = React.createRef();
    }

    reloadWebviewFromParent = () => {
        this.webviewRef.current.postMessage(JSON.stringify({
            action: 'reloadWed',
        }))
    }

    connectWebview = () => {
        // //console.log('appointmentIdOffline : ',this.state.appointmentIdOffline);
        this.webviewRef.current.postMessage(JSON.stringify({
            action: 'PaidOffline',
            idAppointment: this.state.appointmentIdOffline
        }))
    }

    setStateFromParent = async () => {
        await this.setState(initState);
    }

    onLoadEndWebview = () => {
        this.props.actions.app.stopLoadingApp();
    }

    onLoadStartWebview = () => {
        this.webviewRef.current.reload();

    }

    onMessageFromWebview = async (event) => {
        try {
            if (event.nativeEvent && event.nativeEvent.data) {
                const data = JSON.parse(event.nativeEvent.data);
                // //console.log('data : ', JSON.stringify(data));
                if (validateIsNumber(data) && data < -150) {
                    this.onLoadStartWebview();
                } else {
                    const { action, appointmentId } = data;
                    if (action === 'checkout') {
                        this.props.checkoutAppointment(appointmentId, data.appointment);
                        this.props.actions.appointment.checkoutAppointmentOffline(appointmentId);
                        this.setState({
                            appointmentIdOffline: appointmentId
                        })
                    } else if (action == 'signinAppointment') {
                        this.props.bookAppointment(appointmentId);
                    }
                }
            }
        } catch (error) {
            // //console.log('------ error : ', event);
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
                        }],
                        giftCards: []
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
                        products: [],
                        giftCards: []
                    }, appointmentId)
            } else {
                // ------ Buy Offline ------
                alert('You can only sell products to visitors');
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
            this.props.actions.appointment.removeItemIntoAppointment(dataRemove, appointmentId, false);
        } else {
            // -------- Remove Offline --------
            const temptBasket = basket.filter((itemBasket) => itemBasket.id !== item.id);
            this.setState({
                basket: temptBasket
            })
        }
    }

    clearDataCofrim = () => {
        this.setState(initState);
        this.props.actions.appointment.resetBasketEmpty();
        this.props.actions.appointment.resetPayment();
        this.props.actions.appointment.changeFlagSigninAppointment(false);
        this.props.clearDataTabCheckout();
        // ------- Cancle book appointment ----------
        const { profile, appointmentDetail } = this.props;
        this.props.actions.appointment.cancleAppointment(this.state.appointmentId, profile.merchantId, appointmentDetail.userId ? appointmentDetail.userId : 0);
    }

    setStateVisibleFromParent = async (visibleConfirm) => {
        await this.setState({
            visibleConfirm
        })
    }

    bookAppointment = () => {
        this.setState(initState);
        this.props.actions.appointment.resetBasketEmpty();
        this.props.actions.appointment.resetPayment();
        this.props.actions.appointment.changeFlagSigninAppointment(false);
        this.props.clearDataTabCheckout();
    }

    changeStylist = async (service) => {
        this.changeStylistRef.current.setStateFromParent(service);
        await this.setState({
            visibleChangeStylist: true
        })
    }

    showModalDiscount = () => {
        const { basket } = this.state;
        if (basket.length > 0) {
            const { appointmentId } = this.state;
            this.props.actions.marketing.getPromotionByAppointment(appointmentId);
            this.setState({
                visibleDiscount: true
            })
        }
    }

    closeModalDiscount = () => {
        this.setState({
            visibleDiscount: false
        })
    }

    submitPincode = () => {
        const password = this.popupEnterPinRef.current.state.value;
        const { profile } = this.props;
        if (password.length === 4) {
            this.popupEnterPinRef.current.setStateFromParent(true);
            this.props.actions.staff.loginStaff(profile.merchantCode, password);
        } else {
            Alert.alert(`Pin must 4 numeric`);
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentTabParent, appointmentDetail, loading, isGetAppointmentSucces,
            isLoginStaff,isReloadWebview
        } = this.props;
        if (!loading && isGetAppointmentSucces && currentTabParent === 1) {
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
                },
                isShowAddAppointment: true,
            });
        }

        if(isReloadWebview && isReloadWebview != prevProps.isReloadWebview){
            this.reloadWebviewFromParent();
            this.props.actions.app.resetStateReloadWebView();
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

    isLoginStaff: state.dataLocal.isLoginStaff,
    loading: state.app.loading,

    isReloadWebview: state.app.isReloadWebview

})



export default connectRedux(mapStateToProps, TabAppointment);