import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { validateIsNumber } from '@utils';

class TabAppointment extends Layout {

    constructor(props) {
        super(props);
        this.webviewRef = React.createRef();
    }

    componentDidMount() {
    }

    onLoadStartWebview = () => {
        this.props.actions.app.loadingApp();
        setTimeout(() => {
            this.props.actions.app.stopLoadingApp();
        }, 4000)

    }

    onLoadEndWebview = () => {
        this.props.actions.app.stopLoadingApp();
    }

    onMessageFromWebview = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        // console.log('data : ', JSON.stringify(data));
        if (validateIsNumber(data) && data < 0) {
            this.onLoadStartWebview();
        } else {
            const { action, appointmentId } = data;
            if (action === 'checkout') {
                this.props.actions.appointment.getAppointmentById(appointmentId);
                this.props.actions.appointment.checkoutAppointment(appointmentId);
                this.props.gotoCheckoutScreen();
            }
        }
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    token: state.dataLocal.token

})



export default connectRedux(mapStateToProps, TabAppointment);