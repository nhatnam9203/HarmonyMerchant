import React from "react";
import { StarPRNT } from "react-native-star-prnt";

import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";
import NavigationServices from "@navigators/NavigatorServices";
import PrintManager from "@lib/PrintManager";

class TabMarketing extends Layout {
  constructor(props) {
    super(props);
    this.scrollTabRef = React.createRef();
    this.reviewRef = React.createRef();
    this.marketPlace = React.createRef();
    this.photoGalleryRef = React.createRef();
  }

  fetchMarketingApi = (page) => {
    alert(page);
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
        this.photoGalleryRef.current.setStateFromParent();
        break;
      case 2:
        this.props.actions.review.getListReview();
        this.reviewRef.current.setStateFromParent();
        break;
      case 3:
        this.props.actions.review.getListMarketPlace();
        this.marketPlace.current.setStateFromParent();
        break;
      default:

        break;
    }

  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, TabMarketing);
