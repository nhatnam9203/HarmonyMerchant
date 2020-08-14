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
        this.props.actions.invoice.getGiftCardSalesBySettlementId(settlement.settlementId);
        this.props.goToBatchHistoryDetail({...settlement});
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`0`);
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    listBatchHistory: state.invoice.listBatchHistory,
    refreshingBatchHistory: state.invoice.refreshingBatchHistory,
})



export default connectRedux(mapStateToProps, BatchHistoryList);