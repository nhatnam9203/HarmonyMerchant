import React from 'react';
import _ from 'ramda';
import { Alert, AppState } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    validateIsNumber, getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment
} from '@utils';
import apiConfigs from '@configs/api';

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
    appointmentIdOffline: 0,
    visibleChangePriceAmountProduct: false,
}

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            ...initState,
            appState: AppState.currentState,
            tempLink:this.getLinkForCalendar()
        };
        this.webviewRef = React.createRef();
        this.amountRef = React.createRef();
        this.changeStylistRef = React.createRef();
        this.changePriceAmountProductRef = React.createRef();

    }

    componentDidMount() {
        this.updateLinkOfCalendar();
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    getLinkForCalendar(){
        const { profile, profileStaffLogin, deviceId } = this.props;
        const staffColumn = profile.staffColumn ? profile.staffColumn : 8;
        const staffToken = profileStaffLogin.token ? profileStaffLogin.token : "";
        const merchantId = profile.merchantId ? profile.merchantId: "";
        const staffId = profileStaffLogin.staffId ? profileStaffLogin.staffId : 0;
        const tempDeviceId = deviceId ? deviceId : "";
        const url = `${apiConfigs.CALENDAR_URL}${staffColumn}/index.html?token=${staffToken}&merchantid=${merchantId}&staffId=${staffId}&deviceId=${tempDeviceId}`;

        return url;
    }

    updateLinkOfCalendar = () => {
        const { profile, profileStaffLogin, deviceId } = this.props;
        const staffColumn = profile.staffColumn ? profile.staffColumn : 8;
        const staffToken = profileStaffLogin.token ? profileStaffLogin.token : "";
        const merchantId = profile.merchantId ? profile.merchantId: "";
        const staffId = profileStaffLogin.staffId ? profileStaffLogin.staffId : 0;
        const tempDeviceId = deviceId ? deviceId : "";
        const url = `${apiConfigs.CALENDAR_URL}${staffColumn}/index.html?token=${staffToken}&merchantid=${merchantId}&staffId=${staffId}&deviceId=${tempDeviceId}`;

        this.setState({
            tempLink: url
        })
    }

    onNotif = (notif) => {
        this.props.actions.app.closeAllPopupPincode();
        this.props.navigation.navigate("Home");
        this.notif.resetBadgeNumber();
    }


    handleAppStateChange = nextAppState => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
            if (this.webviewRef.current) {
                this.webviewRef.current.postMessage(JSON.stringify({
                    action: 'resetWeb',
                }));
            }

        }
        this.setState({ appState: nextAppState });
    };

    reloadWebviewFromParent = () => {
        this.webviewRef.current.postMessage(JSON.stringify({
            action: 'reloadWed',
        }))
    }

    connectWebview = () => {
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

    handleNewAppointmentNotification = (appointment) => {
    }

    onMessageFromWebview = async (event) => {
        try {
            if (event.nativeEvent && event.nativeEvent.data) {
                const data = JSON.parse(event.nativeEvent.data);
                // console.log('data : ', JSON.stringify(data));
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
                    } else if (action === 'addGroupAnyStaff') {
                        this.props.createABlockAppointment(appointmentId, data.dataAnyStaff && data.dataAnyStaff.fromTime ? data.dataAnyStaff.fromTime : new Date());
                    } else if (action === 'push_notification' && data.isNotification) {
                        const appointment = data.appointment ? { ...data.appointment } : {};
                        this.handleNewAppointmentNotification(appointment)
                    }
                }
            }
        } catch (error) {
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

    formartBasket = (basket = []) => {
        const services = [];
        const extras = [];
        const products = [];

        for (let i = 0; i < basket.length; i++) {
            const temptItem = basket[i];
            if (temptItem.type === "Service") {
                services.push(temptItem);
            } else if (temptItem.type === "Extra") {
                extras.push(temptItem);
            } else if (temptItem.type === "Product") {
                products.push(temptItem)
            }
        }

        return services.concat(extras, products);
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

    changeProductInBasket = async (product) => {
        // console.log("product : ", JSON.stringify(product));
        this.changePriceAmountProductRef.current.setStateFromParent(product);
        this.setState({
            visibleChangePriceAmountProduct: true
        })

    }

    changeProductBasketLocal = async (productIdLocal, price, quantity) => {

    }

    changeStylist = async (service) => {
        this.changeStylistRef.current.setStateFromParent(service);
        await this.setState({
            visibleChangeStylist: true
        })
    }

    showModalDiscount = () => {
        const { profileStaffLogin } = this.props;
        const { basket } = this.state;
        if (basket.length > 0) {
            if (profileStaffLogin.roleName !== "Admin") {
                alert("You don't have permission!")
            } else {
                const { appointmentId } = this.state;
                this.props.actions.marketing.getPromotionByAppointment(appointmentId);
                this.setState({
                    visibleDiscount: true
                })
            }
        }
    }

    closeModalDiscount = () => {
        this.setState({
            visibleDiscount: false
        })
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { currentTabParent, appointmentDetail, loading, isGetAppointmentSucces,
            isLoginStaff, isReloadWebview
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

        if (isReloadWebview && isReloadWebview != prevProps.isReloadWebview) {
            this.reloadWebviewFromParent();
            this.props.actions.app.resetStateReloadWebView();
        }

        

    }

    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleAppStateChange);
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
    isReloadWebview: state.app.isReloadWebview,
    deviceId: state.dataLocal.deviceId,
    extrasByMerchant: state.extra.extrasByMerchant,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
})



export default connectRedux(mapStateToProps, TabAppointment);