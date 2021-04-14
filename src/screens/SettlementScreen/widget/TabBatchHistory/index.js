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
        this.creditPaymentDetailRef = React.createRef();
    }

    setStateFromParent = () => {
        if (this.batchHistoryListRef.current) {
            this.batchHistoryListRef.current.setStateFromParent();
        } else {
            setTimeout(() => {
                this.batchHistoryListRef.current.setStateFromParent();
            }, 300)
        }
    }

    scrollTabFromParent = (page) => {
        if (this.scrollTabRef?.current) {
            this.scrollTabRef?.current?.goToPage(page);
        }

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

    onPressStaff = (staffId) => {
        this.scrollTabRef.current.goToPage(2);
        if (!this.staffIncomDetailsRef.current) {
            setTimeout(() => {
                this.staffIncomDetailsRef.current.setStateFromParent(staffId);
            }, 300);
        } else {
            this.staffIncomDetailsRef.current.setStateFromParent(staffId);
        }
    }

    onPressGiftCardTotal = () => {
        this.scrollTabRef.current.goToPage(3);
    }

    gotoCreditPaymentDetail = (settlementDetail) => {
        const paymentTransaction = settlementDetail.paymentTransaction ? settlementDetail.paymentTransaction : [];
        const paymentByCreditCard = settlementDetail.paymentByCreditCard ? settlementDetail.paymentByCreditCard : 0.00;
        this.scrollTabRef?.current?.goToPage(4);
        if (this.creditPaymentDetailRef.current) {
            this.creditPaymentDetailRef.current.setStateFromParent(paymentTransaction, paymentByCreditCard);
        } else {
            setTimeout(() => {
                this.creditPaymentDetailRef.current.setStateFromParent(paymentTransaction, paymentByCreditCard);
            }, 300)
        }
    }

    componentDidUpdate(prevProps,prevState){
        const {isGetCreditBatchDetailById } = this.props;
        if(isGetCreditBatchDetailById && prevProps.isGetCreditBatchDetailById !== isGetCreditBatchDetailById){
            this.props.actions.invoice.resetStateCreditBatchDetailById();
            this.scrollTabRef.current.goToPage(4);
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    isGetCreditBatchDetailById: state.invoice.isGetCreditBatchDetailById
});

export default connectRedux(mapStateToProps, TabBatchHistory);