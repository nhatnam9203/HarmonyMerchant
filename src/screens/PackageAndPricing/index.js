import React from "react";
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class PackageAndPricing extends Layout {

    constructor(props) {
        super(props);
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
        this.props.actions.app.setPackagePricing({
            pricingType,
            packagePricing
        })
        this.props.goToPage(5);
    }
}

const mapStateToProps = state => ({
    packageAndPricingData: state.app.packageAndPricingData
});

export default connectRedux(mapStateToProps, PackageAndPricing);