import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SettlementScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
        };
        this.scrollTabRef = React.createRef();
        this.tabSettleRef = React.createRef();
        this.checkPermissionRef = React.createRef();
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                });
                this.scrollTabRef.current.goToPage(0);
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                this.tabSettleRef.current.onDidFocus();
                this.props.actions.auth.toggleVisiblePopupCheckStaffPermission();
                this.checkPermissionRef.current.setStateFromParent('');
            }
        );
    }

    reviewBatchHistory = () => {
        this.scrollTabRef.current.goToPage(2);
    }


    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    closePopupCheckStaffPermission = () => {
        this.props.actions.auth.toggleVisiblePopupCheckStaffPermission(false);
        this.props.navigation.navigate("Home");
    }


    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    listCustomersByMerchant: state.customer.listCustomersByMerchant,
    listCustomersSearch: state.customer.listCustomersSearch,
    isShowSearchCustomer: state.customer.isShowSearchCustomer,
    refreshListCustomer: state.customer.refreshListCustomer,
    stateCity: state.dataLocal.stateCity,
    connectPAXStatus: state.app.connectPAXStatus
})



export default connectRedux(mapStateToProps, SettlementScreen);