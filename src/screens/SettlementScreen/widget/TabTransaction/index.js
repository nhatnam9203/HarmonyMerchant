import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { updateStateChildren } from '@utils';

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
        this.props.actions.invoice.getTransactionSettlement();
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

    searchTransactions = () => {
        const { searchFilter } = this.state;
        const { keySearch, status } = searchFilter;
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;
        const isTimeRange = isCustomizeDate ? true : (quickFilter ? true : false);
        if (keySearch == '' && status == '' && !isTimeRange) {
            this.props.actions.invoice.clearSearTransaction();
        } else {
            if (isCustomizeDate) {
                const url = `status=${status}&timeStart=${startDate}&timeEnd=${endDate}&key=${keySearch}`
                this.props.actions.invoice.searchTransactionSettlement(url);
            } else if (quickFilter) {
                const url = `status=${status}&quickFilter=${this.getQuickFilterString(quickFilter)}&${endDate}&key=${keySearch}`
                this.props.actions.invoice.searchTransactionSettlement(url);
            } else {
                const url = `status=${status}&key=${keySearch}`
                this.props.actions.invoice.searchTransactionSettlement(url);
            }
        }
    }

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    changeTitleTimeRange = (title) => {
        this.setState({
            titleRangeTime: title,
            visibleCalendar: false
        })
    }

    updateSearchFilterInfo = (key, value) => {
        const temptState = updateStateChildren(key, value, this.state.searchFilter);
        this.setState({
            searchFilter: temptState
        })
    }


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    transactionsSettlement: state.invoice.transactionsSettlement,
    listTransactionSearch: state.invoice.listTransactionSearch,
    isShowSearchTransaction: state.invoice.isShowSearchTransaction
})



export default connectRedux(mapStateToProps, TabTransaction);