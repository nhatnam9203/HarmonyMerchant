import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class BatchHistoryList extends Layout {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    gotoSettlementDetail = (settlement) => {
        this.props.actions.invoice.getStaffSalesBySettlementId(settlement.settlementId);
        // const data = {
        //     paymentByHarmony : settlement.paymentByHarmony ? settlement.paymentByHarmony : 0.00,
        //     paymentByCreditCard : settlement.paymentByCreditCard ? settlement.paymentByCreditCard : 0.00,
        //     paymentByCash : settlement.paymentByCash ? settlement.paymentByCash : 0.00,
        //     otherPayment : settlement.otherPayment ? settlement.otherPayment : 0.00,
        //     total : settlement.total ? settlement.total : 0.00,
        //     note : settlement.note ? settlement.note : "",
        //     settlementDate : settlement.settlementDate ? settlement.settlementDate : new Date(),
        //     paymentByCashStatistic : settlement.paymentByCashStatistic ? settlement.paymentByCashStatistic : 0.00,
        //     otherPaymentStatistic : settlement.otherPaymentStatistic ? settlement.otherPaymentStatistic : 0.00,
        // };
        this.props.goToBatchHistoryDetail({...settlement});
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSales: state.invoice.staffSales,
    gitfCardSales: state.invoice.gitfCardSales,

    listBatchHistory: state.invoice.listBatchHistory,
    refreshingBatchHistory: state.invoice.refreshingBatchHistory,
})



export default connectRedux(mapStateToProps, BatchHistoryList);