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
            staffSalesDetail: []
        };
    }

    setStateFromParent = (staffId = 0) => {
        const staffSalesDetail = this.getStaffSalesDetail(staffId);
        console.log("staffSalesDetail : ",JSON.stringify(staffSalesDetail));
    }

    getStaffSalesDetail = (staffId = 0) => {
        const { staffSales } = this.props;
        let staffSalesDetail = [];
        for (let i = 0; i < staffSales.length; i++) {
            if (staffSales[i].staffId === staffId) {
                staffSalesDetail = [...staffSales[i].details];
                break;
            }
        }
        return staffSalesDetail;
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {

    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales
})



export default connectRedux(mapStateToProps, StaffIncomeDetailsTab);