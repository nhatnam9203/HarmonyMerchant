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
        this.transactionTabRef = React.createRef();
        this.batchHistoryTabRef = React.createRef();
    }

    componentDidMount() {
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                });
                this.scrollTabRef.current.goToPage(0);
                this.checkPermissionRef.current.setStateFromParent('');
                if(this.transactionTabRef.current){
                    this.transactionTabRef.current.resetStateFromParent();
                }
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                this.tabSettleRef.current.onDidFocus();
                this.checkPermissionRef.current.setStateFromParent('');
                this.props.actions.invoice.toggleSettlementTabPermission();
            }
        );
    }

    onChangeTab = (index) => {
        const currentIndex = index.i;
        if (currentIndex === 1) {
            if(this.transactionTabRef.current){
                this.transactionTabRef.current.searchTransactions();
            }
        } else if (currentIndex === 2) {
            this.props.actions.invoice.getBatchHistory();
            // if(this.batchHistoryTabRef.current){
            //     this.batchHistoryTabRef.current.searchBatchHistory();
            // }
        }
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

    closePopupCheckSettementTabPermission = () => {
        this.props.actions.invoice.toggleSettlementTabPermission(false);
        this.props.navigation.navigate("Home");
    }

    backSettlementTab = () =>{
        this.tabSettleRef.current.scrollTabFromParent();
        this.props.actions.invoice.toggleDisplayBackSettleIcon(false);
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    connectPAXStatus: state.app.connectPAXStatus,
    settlementTabPermission: state.invoice.settlementTabPermission,
    isShowBackSettlement: state.invoice.isShowBackSettlement
})



export default connectRedux(mapStateToProps, SettlementScreen);

// https://dev.harmonypayment.com/api/appointment/staffSales/getBySettlement/{settlementId}