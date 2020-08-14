import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class StaffIncomeDetailsTab extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            staffSalesDetail: [],
            staffName: "",
            total: 0,
            sales: 0,
            tax: 0,
            tip: 0
        };
    }

    setStateFromParent = async (staffId = 0) => {
        const { staffSalesDetail, staffName, total, sales, tax, tip } = this.getStaffSalesDetail(staffId);
        await this.setState({
            staffSalesDetail,
            staffName,
            total,
            sales,
            tax,
            tip
        });
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
                sales = staffSales[i].sales;
                tax = staffSales[i].tax;
                tip = staffSales[i].tip;
                break;
            }
        }
        return { staffSalesDetail, staffName, total, sales, tax, tip };
    }

    onChangeStaff = async (value, index, data) => {
        const staffId = data[index].staffId ? data[index].staffId : 0;
        const { staffSalesDetail, staffName, total, sales, tax, tip } = this.getStaffSalesDetail(staffId);
        await this.setState({
            staffSalesDetail,
            staffName,
            total,
            sales,
            tax,
            tip
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
    gitfCardSales: state.invoice.gitfCardSales,

    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId
})



export default connectRedux(mapStateToProps, StaffIncomeDetailsTab);