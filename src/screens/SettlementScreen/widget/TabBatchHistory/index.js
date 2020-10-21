import React from 'react';
import _ from "ramda"

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren, getQuickFilterStringInvoice } from '@utils';

class TabBatchHistory extends Layout {

    constructor(props) {
        super(props);
        
        this.scrollTabRef = React.createRef();
        this.batchHistoryListRef = React.createRef();
        this.batchHistoryDetailRef = React.createRef();
        this.staffIncomDetailsRef = React.createRef();
        this.creditPaymentDetailRef =  React.createRef();
    }

    setStateFromParent = () =>{
        if(this.batchHistoryListRef.current){
            this.batchHistoryListRef.current.setStateFromParent();
        }else{
            setTimeout(() =>{
                this.batchHistoryListRef.current.setStateFromParent();
            },300)
        }
    }

    scrollTabFromParent =(page) =>{
        this.scrollTabRef.current.goToPage(page);
    }

    goToBatchHistoryDetail = (settlementDetail) => {
        this.scrollTabRef.current.goToPage(1);
        if (!this.batchHistoryDetailRef.current) {
            setTimeout(() => {
                this.batchHistoryDetailRef.current.setStateFromParent(settlementDetail);
            }, 300);
        } else {
            this.batchHistoryDetailRef.current.setStateFromParent(settlementDetail);
        }
    }

    onPressStaff = (staffId) =>{
        this.scrollTabRef.current.goToPage(2);
        if (!this.staffIncomDetailsRef.current) {
            setTimeout(() => {
                this.staffIncomDetailsRef.current.setStateFromParent(staffId);
            }, 300);
        } else {
            this.staffIncomDetailsRef.current.setStateFromParent(staffId);
        }
    }

    onPressGiftCardTotal = () =>{
        this.scrollTabRef.current.goToPage(3);
    }

    gotoCreditPaymentDetail = (settlementDetail) =>{
        const paymentTransaction =  settlementDetail.paymentTransaction ? settlementDetail.paymentTransaction : [];
        this.scrollTabRef.current.goToPage(4);
        if(this.creditPaymentDetailRef.current){
            this.creditPaymentDetailRef.current.setStateFromParent(paymentTransaction);
        }else{
            setTimeout(() =>{
                this.creditPaymentDetailRef.current.setStateFromParent(paymentTransaction);
            },300)
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
});

export default connectRedux(mapStateToProps, TabBatchHistory);