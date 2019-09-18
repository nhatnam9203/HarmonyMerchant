import React from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getPosotion } from '@utils';


const initialState = {
    isFocus: true,
    currentTab: 1,
    visibleConfirm: false,
    temptCurrentTap: -1,
}

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.scrollTabParentRef = React.createRef();
        this.checkoutRef = React.createRef();
        this.tabAppointmentRef = React.createRef();
        this.tabCheckoutRef = React.createRef();
        this.watchVisibleConfrim = new Subject();
    }

    componentDidMount() {
        this.getCurrentLocation();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
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
            });
        }
    }


    gotoAppoitmentScreen = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }


    gotoPageCurentParent = () => {
        const { temptCurrentTap } = this.state;
        this.scrollTabParentRef.current.goToPage(temptCurrentTap);
        // this.setState({
        //     visibleConfirm: false
        // })
    }

    gotoTabAppointment = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    onPressHandlerChangeTab = async (index) => {
        const { currentTab } = this.state;
        if (currentTab === 1 && this.tabAppointmentRef.current.state.isShowAddAppointment ) {
            await this.setState({
                temptCurrentTap: index
            })
            this.tabAppointmentRef.current.setStateVisibleFromParent(true);
        } else if(currentTab === 2 && this.tabCheckoutRef.current.state.basket.length > 0 ){
            await this.setState({
                temptCurrentTap: index
            })
            this.tabCheckoutRef.current.setStateVisibleFromParent();
        } 
        else {
            this.scrollTabParentRef.current.goToPage(index);
        }


        // const { currentTab, checkVisibleConfirm } = this.state;
        // if (currentTab === 2  && checkVisibleConfirm) {
        //     this.setState({
        //         visibleConfirm: true,
        //         temptCurrentTap: index
        //     })
        // }
        // else if (currentTab === 2  && !checkVisibleConfirm) {
        //     this.props.actions.appointment.resetBasketEmpty();
        //     this.scrollTabParentRef.current.goToPage(index);
        // }  else {
        //     this.scrollTabParentRef.current.goToPage(index);
        // }
    }

    gotoCheckoutScreen = () => {
        this.scrollTabParentRef.current.goToPage(2);
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.actions.app.handleLockScreen(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    showLockScreen = () => {
        this.props.actions.app.handleLockScreen(true);
    }

    clearDataTabCheckout =() =>{
        this.tabCheckoutRef.current.setStateFromParent();
    }


    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
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
})



export default connectRedux(mapStateToProps, HomeScreen);