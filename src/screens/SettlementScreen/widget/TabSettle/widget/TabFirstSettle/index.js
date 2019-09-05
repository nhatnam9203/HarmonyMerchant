import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabFirstSettle extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
    }



}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabFirstSettle);