import React from 'react';
import _ from "ramda"

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren } from '@utils';

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

    getQuickFilterString(type) {
        let quickFilter = '';
        switch (type) {
            case 'Today':
                quickFilter = 'today';
                break;
            case 'Yesterday':
                quickFilter = 'yesterday';
                break;
            case 'This Week':
                quickFilter = 'thisWeek';
                break;
            case 'Last Week':
                quickFilter = 'lastWeek';
                break;
            case 'This Month':
                quickFilter = 'thisMonth';
                break;
            case 'Last Month':
                quickFilter = 'lastMonth';
                break;
            default:
                quickFilter = 'today'
        }
        return quickFilter
    }

    searchBatchHistory = () => {
        const { searchFilter } = this.state;
        const { keySearch } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;
        const isTimeRange = isCustomizeDate ? true : (quickFilter ? true : false);
        if (keySearch == '' && !isTimeRange) {
            this.props.actions.invoice.clearSearchBatchHistory();
        } else {
            if (isCustomizeDate) {
                const url = `timeStart=${startDate}&timeEnd=${endDate}&key=${keySearch}`
                this.props.actions.invoice.searchBatchHistory(url);
            } else if (quickFilter) {
                const url = `quickFilter=${this.getQuickFilterString(quickFilter)}&${endDate}&key=${keySearch}`
                this.props.actions.invoice.searchBatchHistory(url);
            } else {
                const url = `key=${keySearch}`
                this.props.actions.invoice.searchBatchHistory(url);
            }
        }
    }

    changeTitleTimeRange = (title) => {
        this.setState({
            titleRangeTime: title === "Select" ? "Time Range" : title,
            visibleCalendar: false
        })
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