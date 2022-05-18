import connectRedux from "@redux/ConnectRedux";
import React from "react";
import Layout from "./layout";

class BatchHistoryDetail extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      settlementDetail: {},
    };

    this.receiptRef = React.createRef();
  }

  setStateFromParent = async (settlementDetail) => {
    await this.setState({
      settlementDetail,
    });
  };

  onPressStaff = (staffId) => {
    this.props.onPressStaff(staffId);
    this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
  };

  onPressGiftCardTotal = () => {
    const { gitfCardSalesBySettlementId } = this.props;
    if (gitfCardSalesBySettlementId.length > 0) {
      this.props.onPressGiftCardTotal();
      this.props.actions.invoice.toggleDisplayBackBatchHistoryIcon(`1`);
    }
  };

  printBatchHistoryDetail = async () => {
    this.receiptRef.current?.print();
  };

  shareBatchHistoryDetail = async () => {
    this.receiptRef.current?.share();
  };

  gotoCreditPaymentDetail = () => {
    const batchId = this.state.settlementDetail?.settlementId || "";
    this.props.actions.invoice.getCreditBatchDetailById(batchId);
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  staffSalesBySettlementId: state.invoice.staffSalesBySettlementId,
  gitfCardSalesBySettlementId: state.invoice.gitfCardSalesBySettlementId,
  depositTotalBySettlementId: state.invoice.depositTotalBySettlementId,
});

export default connectRedux(mapStateToProps, BatchHistoryDetail);
