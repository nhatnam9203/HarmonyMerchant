import _ from "ramda";
import React from "react";
import { Platform, Linking, Alert, Share } from "react-native";
import RNFetchBlob from 'rn-fetch-blob';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getQuickFilterStringInvoice } from '@utils';

class BatchHistoryList extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            titleRangeTime: 'Time Range',
            visibleCalendar: false,
            keySearch: ""
        };
        this.modalCalendarRef = React.createRef();
    }

    setStateFromParent = async () => {
        await this.setState({
            titleRangeTime: 'Time Range',
            visibleCalendar: false,
            keySearch: ""
        });
    }

    gotoSettlementDetail = (settlement) => {
        this.props.actions.invoice.getStaffSalesBySettlementId(settlement.settlementId);
        this.props.actions.invoice.getGiftCardSalesBySettlementId(settlement.settlementId);
        this.props.goToBatchHistoryDetail({ ...settlement });
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`0`);
    }

    shareBatchHistoryList = async () => {
        this.props.actions.upload.exportBatchHistory();
    }

    printBatchHistoryList = () => {

    }

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    onRefresBathHistoryList = () => {
        this.searchBatchHistory(1, false);
    }


    searchBatchHistory = (page = 1, isShowLoading = true, isShowLoadMore = false) => {
        const { keySearch } = this.state;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        this.props.actions.invoice.getBatchHistory(
            keySearch ? keySearch : "",
            isCustomizeDate ? startDate : "",
            isCustomizeDate ? endDate : "",
            quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
            page,
            isShowLoading,
            isShowLoadMore
        );
    }

    changeTitleTimeRange = async (title) => {
        await this.setState({
            titleRangeTime: title === "Select" ? "Time Range" : title,
            visibleCalendar: false
        });
        setTimeout(() => {
            this.searchBatchHistory();
        }, 500);
    }

    loadMoreBatchHistoryList = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { batchHistoryPagesTotal, batchHistoryPagesCurrent } = this.props;
            if (batchHistoryPagesCurrent < batchHistoryPagesTotal) {
                this.searchBatchHistory(parseInt(batchHistoryPagesCurrent + 1), false, true)
                this.onEndReachedCalledDuringMomentum = true;
            }
        }
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listBatchHistory: state.invoice.listBatchHistory,
    refreshingBatchHistory: state.invoice.refreshingBatchHistory,
    batchHistoryPagesTotal: state.invoice.batchHistoryPagesTotal,
    batchHistoryPagesCurrent: state.invoice.batchHistoryPagesCurrent,
    isLoadMoreBatchHistoryList: state.invoice.isLoadMoreBatchHistoryList,
})



export default connectRedux(mapStateToProps, BatchHistoryList);