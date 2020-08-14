import _ from "ramda";

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class GiftCardSalesDetailsTab extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            giftCardType: "All type"
        };
    }

    setStateFromParent = async () => {
        await this.setState({
            giftCardType: "All type"
        })
    }


    onChangeGiftCardType = async (value, index, data) => {
        await this.setState({
            giftCardType:value
        })
    }

    getDataDropdownGiftCardSalesList = () => {
        const { gitfCardSalesBySettlementId } = this.props;
        const data = gitfCardSalesBySettlementId.map((giftCard) => {
            return {
                value: giftCard.name ? giftCard.name : "",
            }
        });
        return [{ value: "All type" }, ...data];
    }

    getDataGiftCardSales = () => {
        const { gitfCardSalesBySettlementId } = this.props;
        const { giftCardType } = this.state;
        if (giftCardType === "All type") {
            return [...gitfCardSalesBySettlementId];
        }else{
            const dataFilter =  gitfCardSalesBySettlementId.filter(gitfCard => gitfCard.name === giftCardType);
            return dataFilter ? dataFilter : [];
        }

    }

    backHomeTab = () => {
        this.props.backHomeTab();
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    gitfCardSalesBySettlementId: state.invoice.gitfCardSalesBySettlementId
})



export default connectRedux(mapStateToProps, GiftCardSalesDetailsTab);