import React from 'react';
import _ from "ramda"

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren, getQuickFilterStringInvoice } from '@utils';

class TabBatchHistory extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scrollTabRef = React.createRef();
        this.batchHistoryDetailRef = React.createRef();
        this.staffIncomDetailsRef = React.createRef();
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

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listBatchHistory: state.invoice.listBatchHistory,
    listBatchHistorySearch: state.invoice.listBatchHistorySearch,
    isShowSearchBatchHistory: state.invoice.isShowSearchBatchHistory,
    refreshingBatchHistory: state.invoice.refreshingBatchHistory,
    batchHistoryPagesTotal: state.invoice.batchHistoryPagesTotal,
    batchHistoryPagesCurrent: state.invoice.batchHistoryPagesCurrent,
    isLoadMoreBatchHistoryList: state.invoice.isLoadMoreBatchHistoryList,
    searchBatchHistoryKeyword: state.invoice.searchBatchHistoryKeyword
})



export default connectRedux(mapStateToProps, TabBatchHistory);