import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    saveSettngApp = () => {

    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabGaneral);