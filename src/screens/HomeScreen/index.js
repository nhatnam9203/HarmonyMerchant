import React from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

const initialState = {
    isFocus: true,
    currentTab: 0,
    visibleConfirm: false,
    temptCurrentTap: -1,
    checkVisibleConfirm: false
}

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.scrollTabParentRef = React.createRef();
        this.checkoutRef = React.createRef();
        this.watchVisibleConfrim = new Subject();
    }

    componentDidMount() {
        this.initWatchVisible();
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


    gotoAppoitmentScreen = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    initWatchVisible = () => {
        this.watchVisibleConfrim.pipe(
            distinctUntilChanged(),
        ).subscribe(val => {
            if (this.state.checkVisibleConfirm !== val) {
                this.setState({
                    checkVisibleConfirm: val
                })
            }


        })
    }

    checkVisibleConfirm = (visible) => {
        this.watchVisibleConfrim.next(visible)
    }

    gotoPageCurent = () => {
        const { temptCurrentTap } = this.state;
        this.scrollTabParentRef.current.goToPage(temptCurrentTap);
        this.setState({
            visibleConfirm: false
        })
    }

    gotoTabAppointment = () => {
        this.scrollTabParentRef.current.goToPage(1);
    }

    onPressHandlerChangeTab = (index) => {
        const { currentTab, checkVisibleConfirm } = this.state;
        if (currentTab === 2 && checkVisibleConfirm) {
            this.setState({
                visibleConfirm: true,
                temptCurrentTap: index
            })
        }
        else if (currentTab === 2 && !checkVisibleConfirm) {
            this.props.actions.appointment.resetBasketEmpty();
            this.scrollTabParentRef.current.goToPage(index);
        } else {
            this.scrollTabParentRef.current.goToPage(index);
        }
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