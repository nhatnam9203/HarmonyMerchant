import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

}

const mapStateToProps = state => ({
})



export default connectRedux(mapStateToProps, TabGaneral);