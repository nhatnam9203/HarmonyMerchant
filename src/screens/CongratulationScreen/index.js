import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class CongratulationScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gotoDrawerStack= () =>{

    }



}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, CongratulationScreen);