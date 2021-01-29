import React from 'react';
import _ from 'ramda';
import { AppState } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    validateIsNumber, getArrayProductsFromAppointment, getArrayServicesFromAppointment,
    getArrayExtrasFromAppointment, getArrayGiftCardsFromAppointment
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
    arrSelectedExtra: []
}

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            ...initState,
            appState: AppState.currentState,
            calendarLink: this.getLinkForCalendar()
        };
        this.webviewRef = React.createRef();
        this.amountRef = React.createRef();
        this.changeStylistRef = React.createRef();
        this.changePriceAmountProductRef = React.createRef();
        this.popupCheckDiscountPermissionRef = React.createRef();
    }

    componentDidMount() {
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    getLinkForCalendar() {
        const { profile, profileStaffLogin, deviceId } = this.props;
        const staffColumn = profile?.staffColumn || 8;
        const staffToken = profileStaffLogin?.token || "";
        const merchantId = profile?.merchantId || "";
        const staffId = profileStaffLogin?.staffId || 0;
        const tempDeviceId = deviceId ? deviceId : "";
        const roleName = profileStaffLogin?.roleName || "Admin";
        const url = `${apiConfigs.CALENDAR_URL}${staffColumn}/index.html?role=${roleName}&token=${staffToken}&merchantid=${merchantId}&staffId=${staffId}&deviceId=${tempDeviceId}`;

        return url;
    }

    updateLinkOfCalendar = async () => {
        const url = this.getLinkForCalendar();
        if (url !== `${this.state.calendarLink}`) {
            this.setState({
                calendarLink: url
            });
        }
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
                if (validateIsNumber(data) && data < -150) {
                    this.onLoadStartWebview();
                } else {
                    const { action, appointmentId } = data;
                    if (action === 'checkout') {
                        const arrayProducts = getArrayProductsFromAppointment(data?.appointment?.products || []);
                        const arryaServices = getArrayServicesFromAppointment(data?.appointment?.services || []);
                        const arrayExtras = getArrayExtrasFromAppointment(data?.appointment?.extras || []);
                        const arrayGiftCards = getArrayGiftCardsFromAppointment(data?.appointment?.giftCards || []);
                        const temptBasket = arrayProducts.concat(arryaServices, arrayExtras, arrayGiftCards);
                        if (temptBasket.length > 0) {
                            this.props.checkoutAppointment(appointmentId, data.appointment);
                            this.props.actions.appointment.checkoutAppointmentOffline(appointmentId);
                            this.setState({
                                appointmentIdOffline: appointmentId
                            })
                        } else {
                            this.props.bookAppointment(appointmentId);
                        }

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
                arrSelectedExtra: []
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
            arrSelectedExtra: []
        })
    }

    onPressSelectExtra = (extra) => {
        const { arrSelectedExtra } = this.state;
        let tempArrSelectedExtra;
        let isExist = false;
        for (let i = 0; i < arrSelectedExtra.length; i++) {
            if (arrSelectedExtra[i]?.extraId === extra?.extraId) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            tempArrSelectedExtra = arrSelectedExtra.filter((selectedExtra) => selectedExtra?.extraId !== extra?.extraId);
        } else {
            tempArrSelectedExtra = [...arrSelectedExtra];
            tempArrSelectedExtra.push(extra);
        }
        this.setState({
            arrSelectedExtra: tempArrSelectedExtra
        });
    }

    getPriceOfline(baseket) {
        let total = 0;
        for (let i = 0; i < baseket.length; i++) {
            total = total + parseInt(baseket[i].data.price);
        }
        return total;
    }

    formartBasket = () => {
        const { appointmentDetail } = this.props;
        const services = appointmentDetail?.services || [];
        const products = appointmentDetail?.products || [];
        const extras = appointmentDetail?.extras || [];

        const arrayProducts = getArrayProductsFromAppointment(products);
        const arryaServices = getArrayServicesFromAppointment(services);
        const arrayExtras = getArrayExtrasFromAppointment(extras);

        for (let i = 0; i < arryaServices.length; i++) {
            for (let j = 0; j < arrayExtras.length; j++) {
                if (arrayExtras[j]?.data?.bookingServiceId === arryaServices[i]?.data?.bookingServiceId) {
                    arryaServices[i]?.extras.push({ ...arrayExtras[j] });
                }
            }
        }

        const temptBasket = arryaServices.concat(arrayProducts);
        return temptBasket;
    }

    addAmount = async () => {
        const { categoryTypeSelected, productSeleted, appointmentId, arrSelectedExtra } = this.state;
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
                const temptBasket = [];
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
                arrSelectedExtra: []
            })

        } else {
            if (appointmentId !== -1) {
                // ------- Buy with appointment ------
                const temptExtra = [];
                for (let i = 0; i < arrSelectedExtra.length; i++) {
                    temptExtra.push({ extraId: arrSelectedExtra[i]?.extraId });
                }

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
                arrSelectedExtra: []
            })
        }
    }

    removeItemBasket = (item) => {
        const { basket } = this.state;
        const { appointmentDetail } = this.props;
        const appointmentId = appointmentDetail?.appointmentId || -1;

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
        // console.log("------ product: ",product);
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
        const { profileStaffLogin, appointmentDetail } = this.props;
        const { basket, appointmentId } = this.state;

        if (appointmentDetail && appointmentDetail?.subTotal > 0) {
            if (profileStaffLogin.roleName !== "Admin") {
                this.popupCheckDiscountPermissionRef?.current?.setStateFromParent('', appointmentId, false);
                this.props.actions.marketing.switchPopupCheckDiscountPermissionInHome(true);
            } else {
                this.props.actions.marketing.getPromotionByAppointment(appointmentId);
            }
        }
    }

    closePopupCheckDiscountPermissionInHome = () => {
        this.props.actions.marketing.switchPopupCheckDiscountPermissionInHome(false);
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
        const { currentTabParent, appointmentDetail, loading, isGetAppointmentSucces, isReloadWebview } = this.props;
        if (!loading && isGetAppointmentSucces && currentTabParent === 1) {
            // const { services, products, extras } = appointmentDetail;
            // const arrayProducts = getArrayProductsFromAppointment(products);
            // const arryaServices = getArrayServicesFromAppointment(services);
            // const arrayExtras = getArrayExtrasFromAppointment(extras);
            // const temptBasket = arrayProducts.concat(arryaServices, arrayExtras);
            this.props.actions.appointment.resetKeyUpdateAppointment();

            await this.setState({
                // total: appointmentDetail.total,
                // basket: temptBasket,
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

    visiblePopupCheckDiscountPermissionInHome: state.marketing.visiblePopupCheckDiscountPermissionInHome
})



export default connectRedux(mapStateToProps, TabAppointment);