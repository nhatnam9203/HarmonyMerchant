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
      case 2:
        this.props.actions.review.getListReview();
        this.reviewRef.current.setStateFromParent();
        break;
      case 3:
        // this.props.actions.review.getListMarketPlace();
        break;
      default:
        const { profile } = this.props;
        this.props.actions.marketing.getBannerMerchant(
          profile.merchantId,
          false
        );
        break;
    }
    // if(currentIndex === 0){
    //     this.props.actions.marketing.getPromotionByMerchant();
    // }else{
    //     const { profile } = this.props;
    //     this.props.actions.marketing.getBannerMerchant(profile.merchantId,false);
    // }
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  profile: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, TabMarketing);
