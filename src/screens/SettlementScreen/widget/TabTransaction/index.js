import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren, getQuickFilterStringInvoice } from '@utils';

class TabTransaction extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            searchFilter: {
                keySearch: '',
                status: ''
            },
            titleRangeTime: 'Time Range',
            visibleCalendar: false
        };
        this.modalCalendarRef = React.createRef();
    }

    componentDidMount() {
        this.searchTransactions();
    }

    searchTransactions = () => {
        const { searchFilter } = this.state;
        const { keySearch, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;

        this.props.actions.invoice.getTransactionSettlement(
            status,
            isCustomizeDate ? startDate : "",
            isCustomizeDate ? endDate : "",
            keySearch,
            quickFilter ? getQuickFilterStringInvoice(quickFilter) : "",
        );


    }

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    changeTitleTimeRange = async (title) => {
        await this.setState({
            titleRangeTime: title === "Select" ? "Time Range" : title,
            visibleCalendar: false
        });
        setTimeout(() => {
            this.searchTransactions();
        }, 500);
    }

    updateSearchFilterInfo = async (key, value) => {
        const temptState = updateStateChildren(key, value, this.state.searchFilter);
        await this.setState({
            searchFilter: temptState
        });
        if (key !== "keySearch") {
            setTimeout(() => {
                this.searchTransactions();
            }, 500);
        } else {
            // this.props.actions.invoice.updateSearchKeyword(this.state.searchFilter.keySearch);
        }
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    transactionsSettlement: state.invoice.transactionsSettlement,
    listTransactionSearch: state.invoice.listTransactionSearch,
    isShowSearchTransaction: state.invoice.isShowSearchTransaction,
    refreshingTransaction: state.invoice.refreshingTransaction
})



export default connectRedux(mapStateToProps, TabTransaction);