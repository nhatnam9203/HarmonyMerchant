import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class ForgotPasswordScreen extends Layout {

    constructor(props) {
        super(props);
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    forgotPass = () => {
        const { profile, isForgotPin } = this.props;
        const email = this.idInputRef.current.state.value;
        if (isForgotPin) {
            this.props.actions.staff.forgotPin(profile.merchantCode, email);
        } else {
            this.props.actions.auth.forgotPassword(email);
        }
    }
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.authMerchant.merchant,
  })

export default connectRedux(mapStateToProps, ForgotPasswordScreen);
