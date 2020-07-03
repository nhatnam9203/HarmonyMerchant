import React from "react";
import _ from 'ramda';
import { } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class PackageAndPricing extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };

        this.billRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.app.getPackageAndPricing();
    }

    findPackage = (packageId = 1) => {
        const packageSelected = this.props.packageAndPricingData.find((value, index) => value.packageId === packageId);
        return packageSelected ? packageSelected : "";
    }

    startFreeTrial = (packageId = 1) => {
        const pricingType = this.billRef.current.state.toogle ? "annualy" : "monthly";
        const packagePricing = packageId;

        // this.props.navigation.navigate('ApplicationSubmit', {
        //     pricingType,
        //     packagePricing
        // });
        this.props.goToPage(4);
    }

}

const mapStateToProps = state => ({
    packageAndPricingData: state.app.packageAndPricingData
});

export default connectRedux(mapStateToProps, PackageAndPricing);