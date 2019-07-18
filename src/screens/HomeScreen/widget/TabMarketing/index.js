import React from 'react';
import { StarPRNT } from 'react-native-star-prnt';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";
import PrintManager from '@lib/PrintManager';

class TabMarketing extends Layout {

    constructor(props) {
        super(props);
        this.scrollTabRef = React.createRef();
    }

    componentDidMount() {
    }

    addPromotion = async () => {
    }




}

const mapStateToProps = state => ({
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, TabMarketing);