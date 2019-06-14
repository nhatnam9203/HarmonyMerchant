import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";


class TabMarketing extends Layout {

    constructor(props) {
        super(props);
        this.scrollTabRef = React.createRef();
    }

    componentDidMount(){
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabMarketing);