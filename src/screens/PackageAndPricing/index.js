import _ from 'ramda';
import { } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class PackageAndPricing extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    findPackage = (packageId = 1) =>{
        const packageSelected = this.props.packageAndPricingData.find((value,index) => value.packageId === packageId);
        return packageSelected ? packageSelected : "";
    }

    componentDidMount() {
        this.props.actions.app.getPackageAndPricing();
    }
}

const mapStateToProps = state => ({
    packageAndPricingData: state.app.packageAndPricingData
});

export default connectRedux(mapStateToProps, PackageAndPricing);