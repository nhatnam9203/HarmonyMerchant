import React, { Component } from 'react';
import {
    PanResponder, View, StyleSheet
} from 'react-native';
import UserInactivity from 'react-native-user-inactivity';

import connectRedux from '@redux/ConnectRedux';

const TIME_TO_WAIT_FOR_INACTIVITY_MS = 2000;
const INACTIVITY_CHECK_INTERVAL_MS = 500;

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
            case '00:30 s':
                timeout = 30000;
                break;
            case '05:00 min':
                timeout = 300000;
                break;
            case '10:00 min':
                timeout = 600000;
                break;
            case '15:00 min':
                timeout = 900000;
                break;
            case '30:00 min':
                timeout = 1800000;
                break;
            default:
                timeout = 1 * 1000 * 60;
        }
        return timeout
    }

    handleInactive = isActive =>{
        const {activeScreen,visibleEnterPinInvoice,visibleEnterPin} = this.props;
        if(!isActive && activeScreen && !visibleEnterPinInvoice && ! visibleEnterPin){
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
                // timeForInactivity={3000}
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
    visibleEnterPin: state.app.visibleEnterPin
})



export default connectRedux(mapStateToProps, ParentContainer);

