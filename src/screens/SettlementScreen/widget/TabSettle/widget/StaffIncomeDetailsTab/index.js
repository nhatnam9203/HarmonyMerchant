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
            staffSalesDetail: [],
            staffName: ""
        };
    }

    setStateFromParent = async (staffId = 0) => {
        const { staffSalesDetail, staffName } = this.getStaffSalesDetail(staffId);
        await this.setState({
            staffSalesDetail,
            staffName
        });
    }

    getStaffSalesDetail = (staffId = 0) => {
        const { staffSales } = this.props;
        let staffSalesDetail = [];
        let staffName = "";
        for (let i = 0; i < staffSales.length; i++) {
            if (staffSales[i].staffId === staffId) {
                staffSalesDetail = [...staffSales[i].details];
                staffName = staffSales[i].name
                break;
            }
        }
        return { staffSalesDetail, staffName };
    }

    onChangeStaff = async (value, index, data) => {
        const staffId = data[index].staffId ? data[index].staffId : 0;
        const { staffSalesDetail, staffName } = this.getStaffSalesDetail(staffId);
        await this.setState({
            staffSalesDetail,
            staffName
        });
    }

    getDataDropdownStaffSalesList = () => {
        const { staffSales } = this.props;
        const data = staffSales.map((staff) => {
            return {
                value: staff.name ? staff.name : "",
                staffId: staff.staffId ? staff.staffId : 0
            }
        });
        return data;
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