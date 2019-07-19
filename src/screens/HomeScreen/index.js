import React from 'react';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
const signalR = require('@aspnet/signalr');
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class HomeScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            currentTab: 0,
            visibleConfirm: false,
            temptCurrentTap: -1,
            checkVisibleConfirm: false
        }
        this.scrollTabParentRef = React.createRef();
        this.checkoutRef = React.createRef();
        this.watchVisibleConfrim = new Subject();
    }

    componentDidMount() {
        // this.props.actions.category.getCategoriesByMerchantId();
        this.setupSignalR();
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

    setupSignalR() {
        const { profile, token } = this.props;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://api2.levincidemo.com/notification/?merchantId=${profile.merchantId}&Title=Merchant&type=appointment_pay`, { accessTokenFactory: () => token })
            .build();

        connection.on("ListWaNotification", (data) => {
             console.log('ListWaNotification : ',data);
            // // const temptData = JSON.parse(data)
            // // console.log('---- : ', temptData.json);
            const temptData = JSON.parse(data);
            if (!_.isEmpty(temptData.data)) {
                this.props.actions.appointment.donePaymentHarmony();
            }

        });

        connection.start().catch(function (err) {
            console.log("Error on Start : ", err);
        });
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
    token: state.dataLocal.token
})



export default connectRedux(mapStateToProps, HomeScreen);