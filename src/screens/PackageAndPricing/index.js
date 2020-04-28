import _ from 'ramda';
import {} from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class PackageAndPricing extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
}

const mapStateToProps = state => ({

});

export default connectRedux(mapStateToProps, PackageAndPricing);