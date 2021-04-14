import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CreditPaymentDetail extends Layout {

    constructor(props) {
        super(props);
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId,
    creditBatchDetailById: state.invoice.creditBatchDetailById,
})

export default connectRedux(mapStateToProps, CreditPaymentDetail);