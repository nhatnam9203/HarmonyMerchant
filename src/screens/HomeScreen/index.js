import React from 'react';
import _ from 'ramda';
import { Alert } from 'react-native';


import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getPosotion } from '@utils';


const initialState = {
    isFocus: true,
    currentTab: 1,
    visibleConfirm: false,
    temptCurrentTap: -1,
    visibleEnterPin: true,

    isConnectedInternet: true
}


class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.scrollTabParentRef = React.createRef();
        this.tabAppointmentRef = React.createRef();
        this.tabCheckoutRef = React.createRef();
        this.popupEnterPinRef = React.createRef();
    }

    componentDidMount() {
        this.getCurrentLocation();
        // this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                });
                this.scrollTabParentRef.current.goToPage(1);
                this.popupEnterPinRef.current.setStateFromParent('');
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }


    async getCurrentLocation() {
        const { profile } = this.props;
        if (!profile.longitude || !profile.latitude) {
            const position = await getPosotion();
            const { latitude, longitude } = position.coords;
            this.props.actions.app.merchantSetting({
                businessHourStart: profile.businessHourStart,
                businessHourEnd: profile.businessHourEnd,
                webLink: profile.webLink,
                latitude: latitude,
                longitude: longitude,
                taxService: profile.taxService,
                taxProduct: profile.taxProduct,
            });
        }
    }


    gotoAppoitmentScreen = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }


    gotoPageCurentParent = () => {
        const { temptCurrentTap } = this.state;
        this.scrollTabParentRef.current.goToPage(temptCurrentTap);
    }

    gotoTabAppointment = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    onPressHandlerChangeTab = async (index) => {
        const { currentTab } = this.state;
        if (currentTab !== index) {
            if (currentTab === 1 && this.tabAppointmentRef.current.state.isShowAddAppointment) {
                await this.setState({
                    temptCurrentTap: index
                })
                this.tabAppointmentRef.current.setStateVisibleFromParent(true);
            } else if (currentTab === 2 && this.tabCheckoutRef.current.state.basket.length > 0) {
                await this.setState({
                    temptCurrentTap: index
                })
                this.tabCheckoutRef.current.setStateVisibleFromParent();
            }
            else {
                if (currentTab === 2 && this.tabCheckoutRef.current.state.basket.length === 0) {
                    this.tabCheckoutRef.current.resetStateFromParent();
                }
                this.scrollTabParentRef.current.goToPage(index);
            }
        }

    }


    handleLockScreen = async () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.scrollTabParentRef.current.goToPage(1);
            this.popupEnterPinRef.current.setStateFromParent('');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        this.popupEnterPinRef.current.setStateFromParent('');
        this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        this.scrollTabParentRef.current.goToPage(1);
    }

    clearDataTabCheckout = () => {
        if (this.tabCheckoutRef.current) {
            this.tabCheckoutRef.current.resetStateFromParent();
        }
    }

    checkoutAppointment = async (appointmentId) => {
        await this.setState({
            currentTab: 2
        })
        this.props.actions.appointment.getAppointmentById(appointmentId);
        this.props.actions.appointment.checkoutAppointment(appointmentId);
        this.scrollTabParentRef.current.goToPage(2);
    }

    bookAppointment = async (appointmentId) => {
        this.props.actions.appointment.getAppointmentById(appointmentId);
        // this.props.actions.appointment.checkoutAppointment(appointmentId);
    }

    submitPincode = () => {
        const password = this.popupEnterPinRef.current.state.value;
        const { profile } = this.props;
        if (password.length === 4) {
            this.props.actions.staff.loginStaff(profile.merchantCode, password);
        } else {
            Alert.alert(`Pin must 4 numeric`);
        }
    }


    loginStaffSuccess = () => {
        const { listAppointmentsOfflineMode } = this.props;
        if (listAppointmentsOfflineMode.length > 0) {
            this.props.actions.appointment.submitAppointmentOffline(listAppointmentsOfflineMode);
        }
        Promise.all([
            this.props.actions.category.getCategoriesByMerchantId(),
            this.props.actions.extra.getExtraByMerchant(),
            this.props.actions.service.getServicesByMerchant(),
            this.props.actions.product.getProductsByMerchant(),
            this.props.actions.staff.getStaffByMerchantId()
        ]).then((data) => {
            this.props.actions.staff.reloadButtonEnterPincode();
            if (data.length === 5) {
                this.props.actions.app.changeFlagVisibleEnteerPinCode(false);
            }
        }).catch(error => {
            this.props.actions.staff.reloadButtonEnterPincode();
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { isLoginStaff } = this.props;
        if (isLoginStaff) {
            this.props.actions.dataLocal.resetStateLoginStaff();
            this.loginStaffSuccess();
        }
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
        // unsubscribeInternet();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    token: state.dataLocal.token,
    appointmentIdOffline: state.appointment.appointmentIdOffline,
    appointmentDetail: state.appointment.appointmentDetail,
    visibleModalLock: state.app.visibleModalLock,
    loading: state.app.loading,
    isLoginStaff: state.dataLocal.isLoginStaff,
    listAppointmentsOfflineMode: state.appointment.listAppointmentsOfflineMode
})



export default connectRedux(mapStateToProps, HomeScreen);