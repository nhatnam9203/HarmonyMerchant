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
        // alert('alert phi')
    }

    sendEmail = () => {

    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabContactUs);