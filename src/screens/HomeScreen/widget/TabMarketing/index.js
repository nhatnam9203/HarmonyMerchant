import connectRedux from "@redux/ConnectRedux";
import React from "react";
import Layout from "./layout";

class TabMarketing extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      isChangeBackground: false,
    };

    this.scrollTabRef = React.createRef();
    this.promotionTabRef = React.createRef();
    this.reviewRef = React.createRef();
    this.marketPlace = React.createRef();
    this.photoGalleryRef = React.createRef();
  }

  handleChangeBackgrounColor = (currentchildPage) => {
    this.setState({
      isChangeBackground: currentchildPage === 0 ? false : true,
    });
  };

  addPromotion = async () => {};

  onChangeTab = (index) => {
    const currentIndex = index.i;
    switch (currentIndex) {
      case 0:
        this.props.actions.marketing.getPromotionByMerchant();
        break;
      case 1:
        const { profile } = this.props;
        this.props.actions.marketing.getBannerMerchant(
          profile.merchantId,
          true
        );
        this.photoGalleryRef.current?.setStateFromParent();
        break;
      case 2:
        this.props.actions.review.getListReview();
        this.reviewRef.current?.setStateFromParent();
        break;
      case 3:
        this.props.actions.review.getListMarketPlace();
        this.marketPlace.current?.setStateFromParent();
        break;
      default:
        break;
    }
    this.setState({
      currentTab: currentIndex,
    });
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, TabMarketing);
