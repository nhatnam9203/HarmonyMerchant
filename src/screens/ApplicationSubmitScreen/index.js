import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class ApplicationSubmitScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    submit1 = () => {
        this.props.navigation.navigate('GeneralInfo');
    }

    submit = () => {
        const { generalInfo, businessInfo, bankInfo, principalInfo } = this.props;
        this.props.actions.app.registerUser({
            generalInfo,
            businessInfo,
            bankInfo,
            principalInfo
        });
    }


}

const mapStateToProps = state => ({
    generalInfo: state.app.generalInfo,
    businessInfo: state.app.businessInfo,
    bankInfo: state.app.bankInfo,
    principalInfo: state.app.principalInfo,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, ApplicationSubmitScreen);