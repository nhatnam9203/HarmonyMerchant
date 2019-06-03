import React from 'react';

import Layout from './layout';
import connectRedux from '../../../../redux/ConnectRedux';


class TabStaffManagement extends Layout {

    constructor(props) {
        super(props);
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
})



export default connectRedux(mapStateToProps, TabStaffManagement);