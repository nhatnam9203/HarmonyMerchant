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
            creditCount: 0,
            creditAmount: 0,
            editPaymentByHarmony: 0.00,
            editPaymentByCreditCard: 0.00,
            editPaymentByCash: 0.00,
            editOtherPayment: 0.00,
            discountSettlement: 0.00,
            total: 0.00,
            note: '',
            isEditOtherAmount: false,
            isEditCashAmount: false,
            settlementDetail:{}
        };
        this.otherAmountRef = React.createRef();
        this.cashAmountRef = React.createRef();
        this.creditAmountRef = React.createRef();
    }

    setStateFromParent = async (settlementDetail) => {
        await this.setState({
            settlementDetail
        })
    }

    onPressStaff = (staffId) => {
        this.props.onPressStaff(staffId);
    }

    onPressGiftCardTotal = () => {
        this.props.onPressGiftCardTotal();
    }


    editCashAmount = () => {
        this.setState({
            isEditCashAmount: true
        });
        this.cashAmountRef.current.setStateFromParent(this.state.editPaymentByCash);
    }

    cancelEditCashAmount = () => {
        this.setState({
            isEditCashAmount: false
        });
        this.scrollTo(0);
    }

    saveEditCashAmount = () => {
        const changeAmount = this.cashAmountRef.current.state.amount;
        this.setState({
            isEditCashAmount: false,
            editPaymentByCash: changeAmount
        });

        this.scrollTo(0);
    }

    editOtherAmount = () => {
        this.setState({
            isEditOtherAmount: true
        });
        this.otherAmountRef.current.setStateFromParent(this.state.editOtherPayment);
    }

    cancelEditOtherAmount = () => {
        this.setState({
            isEditOtherAmount: false
        });
        this.scrollTo(0);
    }

    saveEditOtherAmount = () => {
        const changeAmount = this.otherAmountRef.current.state.amount;
        this.setState({
            isEditOtherAmount: false,
            editOtherPayment: changeAmount
        });

        this.scrollTo(0);
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