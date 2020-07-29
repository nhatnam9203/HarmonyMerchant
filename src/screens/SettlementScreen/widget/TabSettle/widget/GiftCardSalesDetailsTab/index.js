import React from 'react';
import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { formatNumberFromCurrency, formatMoney, scaleSzie, roundFloatNumber, requestAPI } from '@utils';
import apiConfigs from '@configs/api';


class GiftCardSalesDetailsTab extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            staffSalesDetail: [],
            staffName: "",
            total: 0
        };
    }

    setStateFromParent = async () => {
    //    alert("0909")
    }

    getStaffSalesDetail = (staffId = 0) => {
        const { staffSales } = this.props;
        let staffSalesDetail = [];
        let staffName = "";
        let total = 0;
        for (let i = 0; i < staffSales.length; i++) {
            if (staffSales[i].staffId === staffId) {
                staffSalesDetail = [...staffSales[i].details];
                staffName = staffSales[i].name;
                total = staffSales[i].total;
                break;
            }
        }
        return { staffSalesDetail, staffName, total };
    }

    onChangeStaff = async (value, index, data) => {
        const staffId = data[index].staffId ? data[index].staffId : 0;
        const { staffSalesDetail, staffName, total } = this.getStaffSalesDetail(staffId);
        await this.setState({
            staffSalesDetail,
            staffName,
            total
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

    backHomeTab = () => {
        this.props.backHomeTab();
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales
})



export default connectRedux(mapStateToProps, GiftCardSalesDetailsTab);