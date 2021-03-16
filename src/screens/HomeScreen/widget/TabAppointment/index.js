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
                    // console.log("onMessageFromWebview: ", JSON.stringify(data));
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
                        this.props.bookAppointment(appointmentId, data?.staffId || 0);
                    } else if (action === 'addGroupAnyStaff') {
                        this.props.createABlockAppointment(appointmentId, data.dataAnyStaff && data.dataAnyStaff.fromTime ? data.dataAnyStaff.fromTime : new Date());
                    } else if (action === 'push_notification' && data.isNotification) {
                        const appointment = data.appointment ? { ...data.appointment } : {};
                        this.handleNewAppointmentNotification(appointment)
                    } else if (action == 'addMore') {
                        this.props.addMoreAppointmentFromCalendar(data?.appointmentId);
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




    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isReloadWebview } = this.props;
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