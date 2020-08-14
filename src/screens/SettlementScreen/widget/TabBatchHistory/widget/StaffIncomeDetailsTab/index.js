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
        const { staffSalesBySettlementId } = this.props;
        let staffSalesDetail = [];
        let staffName = "";
        let total = 0;
        for (let i = 0; i < staffSalesBySettlementId.length; i++) {
            if (staffSalesBySettlementId[i].staffId === staffId) {
                staffSalesDetail = [...staffSalesBySettlementId[i].details];
                staffName = staffSalesBySettlementId[i].name;
                total = staffSalesBySettlementId[i].total;
                sales = staffSalesBySettlementId[i].sales;
                tax = staffSalesBySettlementId[i].tax;
                tip = staffSalesBySettlementId[i].tip;
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
        const { staffSalesBySettlementId } = this.props;
        const data = staffSalesBySettlementId.map((staff) => {
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