import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';

class TabHardware extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scrollTabHardwareRef = React.createRef();
    }

    gotoListDevices = (type) => {
        alert(type)
    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabHardware);