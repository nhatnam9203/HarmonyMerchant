import React, { Component } from 'react';
import UserInactivity from 'react-native-user-inactivity';
import _ from "ramda";
import SoundPlayer from 'react-native-sound-player'

import connectRedux from '@redux/ConnectRedux';

class ParentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true
        };
        this._interval = false;
    }

    getTimeOut(number) {
        let timeout = 0;
        switch (number) {
            case '2 Minutes':
                timeout = parseInt(2 * 60 * 1000);
                break;
            case '5 Minutes':
                timeout = parseInt(5 * 60 * 1000);
                break;
            case '10 Minutes':
                timeout = parseInt(10 * 60 * 1000);
                break;
            case '15 Minutes':
                timeout = parseInt(15 * 60 * 1000);
                break;
            default:
                timeout = parseInt(2000 * 60 * 1000);
        }
        return timeout
    }

    handleInactive = isActive => {
        // console.log("----- handleInactive: ",isActive);
        if (this._interval && isActive) {
            clearInterval(this._interval);
        }

        const { activeScreen, visibleEnterPinInvoice, visibleEnterPin, isOfflineMode,
            autoLockScreenAfter, groupAppointment,
            invoiceTabPermission, settlementTabPermission, customerTabPermission,
            inventoryTabPermission, reportTabPermission, settingTabPermission, visiblePaymentCompleted
        } = this.props;
        const parent = this.props.navigation.dangerouslyGetParent();
        const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
        if (!isActive && activeScreen && !visibleEnterPin && !isDrawerOpen && !isOfflineMode && autoLockScreenAfter != "Never"
            && _.isEmpty(groupAppointment) && !invoiceTabPermission && !settlementTabPermission
            && !customerTabPermission && !inventoryTabPermission && !reportTabPermission
            && !settingTabPermission && !visiblePaymentCompleted
        ) {
            this.props.handleLockScreen();
        }
    }

    handleNotification = () => {
        this._interval = setInterval(() => {
            this.playSoundNotificaton();
        }, 5000);
    }

    playSoundNotificaton = () => {
        try {
            // play the file tone.mp3
            SoundPlayer.playSoundFile('harmony', 'mp3')
            // or play from url
        } catch (e) {
            console.log(`cannot play the sound file`, e)
        }
    }

    render() {
        const { autoLockScreenAfter } = this.props;
        const { active } = this.state;
        return (
            <UserInactivity
                isActive={active}
                timeForInactivity={this.getTimeOut(autoLockScreenAfter)}
                onAction={this.handleInactive}
                style={{ flex: 1 }}
            >
                {this.props.children}
            </UserInactivity>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        const { isHandleNotiWhenHaveAAppointment } = this.props;
        if (isHandleNotiWhenHaveAAppointment && prevProps.isHandleNotiWhenHaveAAppointment !== isHandleNotiWhenHaveAAppointment) {
            // console.log("------ set interval nootifixation -----");
            this.handleNotification();
            this.props.actions.app.resetStateNotiWhenHaveAAppointment();
        }
    }

    componentWillUnmount() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }
}



const mapStateToProps = state => ({
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
    visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,
    visibleEnterPin: state.app.visibleEnterPin,
    isOfflineMode: state.network.isOfflineMode,
    groupAppointment: state.appointment.groupAppointment,
    invoiceTabPermission: state.invoice.invoiceTabPermission,
    settlementTabPermission: state.invoice.settlementTabPermission,
    customerTabPermission: state.customer.customerTabPermission,
    inventoryTabPermission: state.product.inventoryTabPermission,
    reportTabPermission: state.staff.reportTabPermission,
    settingTabPermission: state.app.settingTabPermission,
    visiblePaymentCompleted: state.appointment.visiblePaymentCompleted,

    isHandleNotiWhenHaveAAppointment: state.app.isHandleNotiWhenHaveAAppointment

})



export default connectRedux(mapStateToProps, ParentContainer);

