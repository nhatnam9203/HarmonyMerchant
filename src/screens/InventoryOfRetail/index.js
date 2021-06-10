import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {

} from '@utils';

class InventoryOfRetail extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0
        };

        this.scrollableTabViewRef = React.createRef();
    }

    componentDidMount() {
    }

    handleNewOrder = () => {
        this.scrollableTabViewRef.current.goToPage(2);
    }

    backOrderHome =( ) =>{
        this.scrollableTabViewRef.current.goToPage(0);
    }

    onChangeTab = (index) => {
        this.setState({ currentTab: index.i });
    }

    componentDidUpdate(prevProps, prevState){
        const {isGetOrderRetailDetail} = this.props;
        if(isGetOrderRetailDetail && prevProps?.isGetOrderRetailDetail !== isGetOrderRetailDetail){
            this.props.actions.orderRetail.resetStateIsGetOrderRetailDetail();
            this.scrollableTabViewRef.current.goToPage(1);
            
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin,

    isGetOrderRetailDetail: state.orderRetail.isGetOrderRetailDetail
})

export default connectRedux(mapStateToProps, InventoryOfRetail);