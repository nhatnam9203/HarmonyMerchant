import React, { Component } from 'react';
import UserInactivity from 'react-native-user-inactivity';

import connectRedux from '@redux/ConnectRedux';

class ParentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: true
        }
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
        const { activeScreen, visibleEnterPinInvoice, visibleEnterPin, isOfflineMode, autoLockScreenAfter } = this.props;
        const parent = this.props.navigation.dangerouslyGetParent();
        const isDrawerOpen = parent && parent.state && parent.state.isDrawerOpen;
        if (!isActive && activeScreen && !visibleEnterPinInvoice && !visibleEnterPin && !isDrawerOpen && !isOfflineMode && autoLockScreenAfter != "Never") {
            this.props.handleLockScreen();
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

}



const mapStateToProps = state => ({
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
    visibleEnterPinInvoice: state.app.visibleEnterPinInvoice,
    visibleEnterPin: state.app.visibleEnterPin,
    isOfflineMode: state.network.isOfflineMode,
})



export default connectRedux(mapStateToProps, ParentContainer);

