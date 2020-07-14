import React from 'react';
import _ from 'ramda';
import { Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Subject } from 'rxjs';
import { distinctUntilChanged, finalize } from 'rxjs/operators';

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
        this.unsubscribeNetInfo = null;
        this.watcherNetwork = new Subject();
    }

    componentDidMount() {
        this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
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

        setTimeout(() => {
            this.scrollTabParentRef.current.goToPage(1, false);
        }, 50);
        this.initWatcherNetwork();

        this.unsubscribeNetInfo = NetInfo.addEventListener(state => {
            const isConnected = state.isConnected ? state.isConnected : false;
            this.watcherNetwork.next(isConnected);
        });

    }

    initWatcherNetwork = () => {
        this.watcherNetwork.pipe(
            distinctUntilChanged()
        ).subscribe(isConnected => {
            this.checkIsOfflineMode(isConnected);
        })
    }

    checkIsOfflineMode = (isConnected) => {
        const { isOfflineMode } = this.props;
        if (!isConnected && !isOfflineMode) {
            this.props.actions.app.showPopupDisconneted();
        } else if (isConnected && isOfflineMode) {
            this.props.actions.app.showPopupConneted(true),
                this.props.actions.app.toogleOfflineMode(false);
        }
    }


    async getCurrentLocation() {
        const { profile } = this.props;
        if (!profile.longitude || !profile.latitude) {
            try {
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
            } catch (error) {

            }
        }
    }

    gotoAppoitmentScreen = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    gotoPageCurentParent = (isDrawer = false) => {
        if (isDrawer) {
            this.scrollTabParentRef.current.goToPage(1);
            this.props.navigation.openDrawer();
        } else {
            const { temptCurrentTap } = this.state;
            this.scrollTabParentRef.current.goToPage(temptCurrentTap);
        }

    }

    gotoTabAppointment = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    createABlockAppointment = (fromTime) => {
        const { profile } = this.props;
        this.props.actions.appointment.createBlockAppointment(profile.merchantId, fromTime);
        this.scrollTabParentRef.current.goToPage(2);
    }

    onPressHandlerChangeTab = async (index) => {
        const { currentTab } = this.state;
        const { groupAppointment, appointmentIdOffline, blockAppointments } = this.props;
        if (appointmentIdOffline !== 0) {
            this.props.actions.appointment.checkoutAppointmentOffline(0);
        }
        if (currentTab !== index) {
            if (currentTab === 1 && this.tabAppointmentRef.current.state.isShowAddAppointment) {
                //console.log('-----1-------');
                await this.setState({
                    temptCurrentTap: index
                })
                this.tabAppointmentRef.current.setStateVisibleFromParent(true);
            } else if (currentTab === 2 && this.tabCheckoutRef.current.state.basket.length > 0) {
                // console.log('-----2-------');
                await this.setState({
                    temptCurrentTap: index
                })
                this.tabCheckoutRef.current.setStateVisibleFromParent();
            }
            else {
                //console.log('-----3-------');
                if (currentTab === 2 && this.tabCheckoutRef.current.state.basket.length === 0) {
                    // console.log('-----4-------');
                    if (!_.isEmpty(groupAppointment)) {
                        //console.log('-----5-------');
                        await this.setState({
                            temptCurrentTap: index
                        })
                        this.tabCheckoutRef.current.setStateVisibleFromParent();
                    } else if (blockAppointments && blockAppointments.length > 0) {
                        await this.setState({
                            temptCurrentTap: index
                        })
                        this.tabCheckoutRef.current.setStateVisibleFromParent();
                    }
                    else {
                        //console.log('-----6-------');
                        this.tabCheckoutRef.current.resetStateFromParent();
                        this.scrollTabParentRef.current.goToPage(index);
                    }
                } else {
                    // console.log('-----7-------');
                    this.scrollTabParentRef.current.goToPage(index);
                }

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
        const { groupAppointment, blockAppointments } = this.props;
        if (!_.isEmpty(groupAppointment) || (blockAppointments && blockAppointments.length > 0)) {
            this.tabCheckoutRef.current.setStateVisibleFromParent(true,true);
        } else {
            this.props.navigation.openDrawer();
        }
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

    checkoutAppointment = async (appointmentId, appointment = {}) => {
        await this.setState({
            currentTab: 2
        })
        const { groupAppointment, isOfflineMode } = this.props;
        if (isOfflineMode) {
            this.tabCheckoutRef.current.setBasketOfflineModeFromParent(appointment);
        } else {
            const checkoutGroupId = !_.isEmpty(groupAppointment) && groupAppointment.checkoutGroupId ? groupAppointment.checkoutGroupId : 0;
            this.props.actions.appointment.checkoutAppointment(appointmentId, checkoutGroupId);
        }

        this.scrollTabParentRef.current.goToPage(2);
    }

    bookAppointment = async (appointmentId) => {
        this.props.actions.appointment.getAppointmentById(appointmentId);
    }

    submitPincode = () => {
        const password = this.popupEnterPinRef.current.state.value;
        const { profile } = this.props;
        if (password.length === 4) {
            this.props.actions.staff.loginStaff(profile.merchantCode, password);
        } else {
            Alert.alert(`PIN must be 4 digits.`);
        }
    }


    loginStaffSuccess = () => {
        const { listAppointmentsOfflineMode } = this.props;
        if (listAppointmentsOfflineMode && listAppointmentsOfflineMode.length > 0) {
            this.props.actions.appointment.submitAppointmentOffline(listAppointmentsOfflineMode);
        }
        this.getCurrentLocation();
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
        const { isLoginStaff, isCheckAppointmentBeforeOffline, groupAppointment } = this.props;
        if (isLoginStaff) {
            this.props.actions.dataLocal.resetStateLoginStaff();
            this.loginStaffSuccess();
        }

        // ----------- Check Appointent Checkout berfore Offline mode -----------
        if (!_.isEmpty(groupAppointment) && isCheckAppointmentBeforeOffline && isCheckAppointmentBeforeOffline !== prevProps.isCheckAppointmentBeforeOffline) {
            this.props.actions.appointment.checkAppointmentBeforOffline(false);
            this.tabCheckoutRef.current.resetStateFromParent();
            this.scrollTabParentRef.current.goToPage(1);
            this.props.actions.appointment.resetGroupAppointment();
        }
    }

    // ----------- Handle group appointment -------

    gotoAppointmentTabToGroup = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    pushAppointmentIdOfflineIntoWebview = () => {
        this.tabAppointmentRef.current.connectWebview();
    }

    onChangeTab = (index) => {
        this.setState({ currentTab: index.i });
        if (index.i === 0) {
            const { profile } = this.props;
            this.props.actions.marketing.getPromotionByMerchant();
            this.props.actions.marketing.getBannerMerchant(profile.merchantId, false);
        }
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
        this.unsubscribeNetInfo();
        this.watcherNetwork.pipe(
            finalize(() => { })
        );
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
    listAppointmentsOfflineMode: state.dataLocal.listAppointmentsOfflineMode,
    groupAppointment: state.appointment.groupAppointment,
    isOfflineMode: state.network.isOfflineMode,
    isCheckAppointmentBeforeOffline: state.appointment.isCheckAppointmentBeforeOffline,
    blockAppointments: state.appointment.blockAppointments,
})



export default connectRedux(mapStateToProps, HomeScreen);