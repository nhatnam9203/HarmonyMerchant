import React from 'react';
import _ from 'ramda';

import Layout from './layout';
import { getQuickFilterTimeRange } from '@utils';
import connectRedux from '@redux/ConnectRedux';

class ReportScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            valueSwitch: true,
            visibleCalendar: false,
            titleRangeTime: 'All time'
        };
        this.modalCalendarRef = React.createRef();
    }

    componentDidMount() {
        this.props.actions.staff.getListStaffsSalaryTop();
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                })
            }
        );
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    onValueChangeSwich = (value) => {
        this.setState({
            valueSwitch: value
        })
    }

    showCalendar = () => {
        this.setState({
            visibleCalendar: true
        })
    }

    changeTitleTimeRange = (title) => {
        this.setState({
            titleRangeTime: title !== 'Time Range' ? title : 'All time',
            visibleCalendar: false
        })
    }

    searchStaff = () => {
        const { isCustomizeDate, startDate, endDate, quickFilter } = this.modalCalendarRef.current.state;
        let url;
        if (isCustomizeDate) {
            url = `timeStart=${startDate}&timeEnd=${endDate}`;
        } else {
            url = `quickFilter=${getQuickFilterTimeRange(quickFilter)}`;
        }
        this.props.actions.staff.filterListStaffsSalaryTop(url);
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listStaffsSalary: state.staff.listStaffsSalary,
    refreshListStaffsSalary: state.staff.refreshListStaffsSalary
})



export default connectRedux(mapStateToProps, ReportScreen);