import React from 'react';
import _ from "ramda"

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren, getQuickFilterStringInvoice } from '@utils';

class TabBatchHistory extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            searchFilter: {
                keySearch: '',
            },
            titleRangeTime: 'Time Range',
            visibleCalendar: false,
            settleSelected: {}
        };
        this.scrollTabRef = React.createRef();
        this.modalCalendarRef = React.createRef();
        this.arraySettleRef = [];
    }

    componentDidMount() {
        this.props.actions.invoice.getBatchHistory();
    }

    getTotalByCardType = (cardType) => {
        const { settleSelected } = this.state;
        const paymentByCreditCards = !_.isEmpty(settleSelected) && settleSelected.paymentByCreditCards ? settleSelected.paymentByCreditCards : [];
        let total = 0.00;
        for (let i = 0; i < paymentByCreditCards.length; i++) {
            if (paymentByCreditCards[i].cardType === cardType) {
                total = paymentByCreditCards[i].amount;
                break;
            }
        }
        return total;
    }

    pushSettleIntoArray = (ref) => {
        if (ref) {
            this.arraySettleRef.push(ref);
        }
    }

    gotoTabCardTransactions = () => {
        this.scrollTabRef.current.goToPage(1);
    }

    gotoTabDetail = () => {
        this.scrollTabRef.current.goToPage(2);
    }

    backReport = () => {
        this.scrollTabRef.current.goToPage(0);
    }

    onRefresBathHistoryList =() =>{
        this.searchBatchHistory(1,false);
    }

    searchBatchHistory = (page = 1, isShowLoading = true) => {
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        this.props.actions.invoice.getBatchHistory(
            keySearch,
            isCustomizeDate ? startDate : "",
            isCustomizeDate ? endDate : "",
            quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
            page,
            isShowLoading
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

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    updateSearchFilterInfo = (key, value) => {
        const temptState = updateStateChildren(key, value, this.state.searchFilter);
        this.setState({
            searchFilter: temptState
        })
    }

    selectSette = async (settle) => {
        for (let i = 0; i < this.arraySettleRef.length; i++) {
            if (this.arraySettleRef[i].props.batchHistory.settlementId === settle.settlementId) {
                this.arraySettleRef[i].setStateFromParent(true);
            } else {
                this.arraySettleRef[i].setStateFromParent(false);
            }
        };
        await this.setState({
            settleSelected: settle
        });
    }

    loadMoreBatchHistoryList = () => {
        if (!this.onEndReachedCalledDuringMomentum) {
            const { batchHistoryPagesTotal, batchHistoryPagesCurrent } = this.props;
            if (batchHistoryPagesCurrent < batchHistoryPagesTotal) {
                this.props.actions.invoice.getBatchHistory(false, batchHistoryPagesCurrent + 1);
                this.onEndReachedCalledDuringMomentum = true;
            }
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
    batchHistoryPagesCurrent: state.invoice.batchHistoryPagesCurrent
})



export default connectRedux(mapStateToProps, TabBatchHistory);