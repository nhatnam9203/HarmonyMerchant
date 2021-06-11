import { Linking } from 'react-native'
import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';

class TabContactUs extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    callPhone = () => {
        Linking.openURL(`tel:800-531-3126`)
    }

    sendEmail = () => {
        Linking.openURL('mailto:team@harmonypayment.com')

    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabContactUs);