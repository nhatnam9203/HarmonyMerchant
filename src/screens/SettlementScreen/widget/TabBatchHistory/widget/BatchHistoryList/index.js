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
        this.props.actions.invoice.getGiftCardSalesBySettlementId(89);
        this.props.goToBatchHistoryDetail({...settlement});
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`0`);
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