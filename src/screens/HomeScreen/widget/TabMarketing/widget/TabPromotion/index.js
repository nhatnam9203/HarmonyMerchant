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
    }
  }

  onChangeTab = (index) => {
    const currentIndex = index.i;
    this.setState({ currentTab: currentIndex });
  }

  createNewCampaign = () =>{
    
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


