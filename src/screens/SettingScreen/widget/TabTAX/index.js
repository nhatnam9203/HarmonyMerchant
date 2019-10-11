import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';

class TabTAX extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scrollTabHardwareRef = React.createRef();
    }

    gotoListDevices = (type) => {
        this.scrollTabHardwareRef.current.goToPage(1);
    }

    backHomeHardware =() =>{
        this.scrollTabHardwareRef.current.goToPage(0);
    }

    gotoSetupDevice =() =>{
        this.scrollTabHardwareRef.current.goToPage(2);
    }

    backListDevices =() =>{
        this.scrollTabHardwareRef.current.goToPage(1);
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabTAX);