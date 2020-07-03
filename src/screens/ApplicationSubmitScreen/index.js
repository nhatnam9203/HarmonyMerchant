import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class ApplicationSubmitScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    submit = () => {
        const { navigation, generalInfo, businessInfo, bankInfo, principalInfo, selectPackageAndPricing } = this.props;
        // const pricingType = navigation.getParam('pricingType', "annualy");
        // const packagePricing = navigation.getParam('packagePricing', 1);

        this.props.actions.app.registerUser({
            generalInfo,
            businessInfo,
            bankInfo,
            principalInfo,
            pricingType: selectPackageAndPricing.pricingType,
            packagePricing: selectPackageAndPricing.packagePricing
        });
    }


}

const mapStateToProps = state => ({
    generalInfo: state.app.generalInfo,
    businessInfo: state.app.businessInfo,
    bankInfo: state.app.bankInfo,
    principalInfo: state.app.principalInfo,
    selectPackageAndPricing: state.app.selectPackageAndPricing,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, ApplicationSubmitScreen);