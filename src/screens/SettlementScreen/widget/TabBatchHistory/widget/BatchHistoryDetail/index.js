import React from 'react';
import { NativeModules, Alert } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI,
    CARD_TYPE, PAYMENT_TYPE
} from '@utils';
import apiConfigs from '@configs/api';


const PosLink = NativeModules.MyApp;

class BatchHistoryDetail extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            settlementDetail:{}
        };
    }

    setStateFromParent = async (settlementDetail) => {
        await this.setState({
            settlementDetail
        })
    }

    onPressStaff = (staffId) => {
        this.props.onPressStaff(staffId);
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
    }

    onPressGiftCardTotal = () => {
        this.props.onPressGiftCardTotal();
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
    }
    
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    invoicesOfStaff: state.invoice.invoicesOfStaff,
    loading: state.app.loading,
    refreshingSettle: state.invoice.refreshingSettle,
    isGettingSettlement: state.invoice.isGettingSettlement,
    versionApp: state.dataLocal.versionApp,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales,

    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId
})



export default connectRedux(mapStateToProps, BatchHistoryDetail);