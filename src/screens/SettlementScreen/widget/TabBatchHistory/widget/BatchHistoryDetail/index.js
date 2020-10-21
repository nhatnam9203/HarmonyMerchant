import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class BatchHistoryDetail extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            settlementDetail:{}
        };
    }

    setStateFromParent = async (settlementDetail) => {
        await this.setState({
            settlementDetail
        })
    }

    onPressStaff = (staffId) => {
        this.props.onPressStaff(staffId);
        this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
    }

    onPressGiftCardTotal = () => {
        const {gitfCardSalesBySettlementId} = this.props;
        if(gitfCardSalesBySettlementId.length > 0){
            this.props.onPressGiftCardTotal();
            this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
        }
    }

    shareBatchHistoryDetail = () =>{
        const {settlementDetail} = this.state;
        const settlementId = settlementDetail.settlementId ?  settlementDetail.settlementId : 0;
        this.props.actions.upload.exportBatchDetail(settlementId);
    }

    printBatchHistoryDetail = () =>{
        
    }

    gotoCreditPaymentDetail = () =>{
      this.props.gotoCreditPaymentDetail();
    }
    
}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId,
    gitfCardSalesBySettlementId: state.invoice.gitfCardSalesBySettlementId
});

export default connectRedux(mapStateToProps, BatchHistoryDetail);