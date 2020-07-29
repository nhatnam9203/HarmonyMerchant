import React from 'react';
import { NativeModules, Alert } from 'react-native';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI } from '@utils';
import apiConfigs from '@configs/api';


const PosLink = NativeModules.MyApp;

class StaffIncomeDetailsTab extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        };
    }




    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    paxMachineInfo: state.dataLocal.paxMachineInfo,
    settleWaiting: state.invoice.settleWaiting,
    invoicesOfStaff: state.invoice.invoicesOfStaff,
    loading: state.app.loading,
    refreshingSettle: state.invoice.refreshingSettle,
    isGettingSettlement: state.invoice.isGettingSettlement,
    versionApp: state.dataLocal.versionApp,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales
})



export default connectRedux(mapStateToProps, StaffIncomeDetailsTab);