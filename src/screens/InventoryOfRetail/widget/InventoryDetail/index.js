import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { scaleSize } from '@utils';

class InventoryDetail extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            searchKeyword: "",
            visibleFilterModal: false
        };

        this.scrollRef = React.createRef();
    }

    showFilterModal = () => {
        this.setState({
            visibleFilterModal: true
        })
    }

    closeFilterModal = () => {
        this.setState({
            visibleFilterModal: false
        })
    }

    applyFilter = () => {
        alert("applyFilter")
    }

    resetFilter = () => {
        alert("resetFilter")
    }

    handleNewOrder = () => {
        alert("handleNewOrder")
    }

    handleScrollToNum = (num) => () => {
        this.scrollRef.current?.scrollTo({ x: 0, y: scaleSize(num), animated: true })
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin,

    orderRetailDetail: state.orderRetail.orderRetailDetail
})



export default connectRedux(mapStateToProps, InventoryDetail);