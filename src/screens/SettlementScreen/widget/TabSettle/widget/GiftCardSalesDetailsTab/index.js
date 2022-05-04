import _ from "ramda";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class GiftCardSalesDetailsTab extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      giftCardType: "All type",
    };
  }

  setStateFromParent = async () => {
    await this.setState({
      giftCardType: "All type",
    });
  };

  onChangeGiftCardType = async (value, index, data) => {
    await this.setState({
      giftCardType: value,
    });
  };

  getDataDropdownGiftCardSalesList = () => {
    const { gitfCardSales } = this.props;
    const data = gitfCardSales.map((giftCard) => {
      return {
        value: giftCard.name ? giftCard.name : "",
      };
    });
    return [{ value: "All type" }, ...data];
  };

  getDataGiftCardSales = () => {
    const { gitfCardSales } = this.props;
    const { giftCardType } = this.state;
    if (giftCardType === "All type") {
      return [...gitfCardSales];
    } else {
      const dataFilter = gitfCardSales.filter(
        (gitfCard) => gitfCard.name === giftCardType
      );
      return dataFilter ? dataFilter : [];
    }
  };

  backHomeTab = () => {
    this.props.backHomeTab();
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  staffSales: state.invoice.staffSales,
  gitfCardSales: state.invoice.gitfCardSales,
  depositedAmount: state.invoice.depositedAmount,
});

export default connectRedux(mapStateToProps, GiftCardSalesDetailsTab);
