import {Linking} from 'react-native'
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
        Linking.openURL(`tel:1-810-594-6322`)
    }

    sendEmail = () => {
        Linking.openURL('mailto:support@harmonypay.com')
        
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabContactUs);