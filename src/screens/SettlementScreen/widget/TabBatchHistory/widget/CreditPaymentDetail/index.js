import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class CreditPaymentDetail extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            paymentTransaction:[],
            paymentByCreditCard:0.00
        };
    }

    setStateFromParent = async (paymentTransaction,paymentByCreditCard) => {
        await this.setState({
            paymentTransaction,
            paymentByCreditCard
        });
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    staffSalesBySettlementId: state.invoice.staffSalesBySettlementId
})



export default connectRedux(mapStateToProps, CreditPaymentDetail);