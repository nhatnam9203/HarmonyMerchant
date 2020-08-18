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
        const {gitfCardSalesBySettlementId} = this.props;
        if(gitfCardSalesBySettlementId.length > 0){
            this.props.onPressGiftCardTotal();
            this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
        }
    }

    shareBatchHistoryDetail = () =>{

    }

    printBatchHistoryDetail = () =>{
        
    }
    
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    gitfCardSalesBySettlementId: state.invoice.gitfCardSalesBySettlementId,
    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId,
    gitfCardSalesBySettlementId: state.invoice.gitfCardSalesBySettlementId
});

export default connectRedux(mapStateToProps, BatchHistoryDetail);