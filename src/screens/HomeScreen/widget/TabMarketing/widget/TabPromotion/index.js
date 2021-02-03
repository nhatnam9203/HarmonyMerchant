import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getServiceIdByName } from '@utils';
import { scaleSzie } from '@utils';

class TabPromotion extends Layout {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0
    };

    this.scrollTabParentRef = React.createRef();

  }

  onChangeTab = (index) => {
    const currentIndex = index.i;
    this.props.handleChangeBackgrounColor(currentIndex);
  }

  createNewCampaign = () => {
    if (this.scrollTabParentRef?.current) {
      this.scrollTabParentRef?.current.goToPage(1);
    } else {
      setTimeout(() => {
        this.scrollTabParentRef?.current.goToPage(1);
      }, 300)
    }
  }

  editCampaign = (campaign) => () => {
    alert(campaign);
  }

  disableCampaign = () => {
    alert("disableCampaign")
  }

  cancelCampaign = () => {
    this.scrollTabParentRef?.current.goToPage(0);
  }


}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  promotions: state.marketing.promotions,
  servicesByMerchant: state.service.servicesByMerchant,
  isApplyPromotion: state.marketing.isApplyPromotion,
  refreshingPromotion: state.marketing.refreshingPromotion,
  isGetPromotionByMerchant: state.marketing.isGetPromotionByMerchant
})



export default connectRedux(mapStateToProps, TabPromotion);


