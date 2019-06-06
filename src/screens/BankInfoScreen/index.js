import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class BankInfoScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, BankInfoScreen);