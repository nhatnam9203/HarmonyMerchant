import React from 'react';

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
            visibleCalendar: false
        };
        this.scrollTabRef = React.createRef();
        this.modalCalendarRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.invoice.getBatchHistory();
    }

    gotoTabDetail = () => {
        this.scrollTabRef.current.goToPage(1);
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
            titleRangeTime: title,
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


}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listBatchHistory: state.invoice.listBatchHistory,
    listBatchHistorySearch: state.invoice.listBatchHistorySearch,
    isShowSearchBatchHistory: state.invoice.isShowSearchBatchHistory
})



export default connectRedux(mapStateToProps, TabBatchHistory);