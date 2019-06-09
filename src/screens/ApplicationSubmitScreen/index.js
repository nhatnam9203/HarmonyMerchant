import React from 'react';

import Layout from './layout';
import connectRedux from '../../redux/ConnectRedux';

class ApplicationSubmitScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    submit =() =>{
        alert('ddd')
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, ApplicationSubmitScreen);