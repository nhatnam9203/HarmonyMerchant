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
    this.promotionDetailRef = React.createRef();
    this.setStateToPromotiomDetail = null;
  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant(false);
  }

  onChangeTab = (index) => {
    const currentIndex = index.i;
    this.props.handleChangeBackgrounColor(currentIndex);
  }

  handleSetStateToPromotiomDetail = (ref) => {
    this.setStateToPromotiomDetail = ref;
  }

  createNewCampaign = () => {
    this.goToPage(1);
    const data = {
      title: "Valentine Day",
      startDate: "02/14/2021",
      endDate: "03/13/2021",
      startTime: "08:30 AM",
      endTime: "00:00 AM"
    }
    if (this.setStateToPromotiomDetail) {
      this.setStateToPromotiomDetail(data);
    } else {
      setTimeout(() => {
        this.setStateToPromotiomDetail(data);
      }, 300)
    }

  }

  editCampaign = (campaign) => () => {
    alert(campaign);
  }

  disableCampaign = (campaign) => () => {
    // console.log(campaign);
    this.props.actions.marketing.disablePromotionById(campaign?.id || 0);
  }

  cancelCampaign = () => {
    this.scrollTabParentRef?.current.goToPage(0);
  }

  goToPage = (page = 1) => {
    if (this.scrollTabParentRef?.current) {
      this.scrollTabParentRef?.current.goToPage(page);
    } else {
      setTimeout(() => {
        this.scrollTabParentRef?.current.goToPage(page);
      }, 300)
    }
  }

  viewRule = () => {
    this.goToPage(2);
  }

  disableRule = () => {

  }

  cancelRewardPoints = () => {
    this.goToPage(0);
  }

  saveRewardPoints = () => {
    this.goToPage(0);
  }

  componentWillUnmount() {
    this.setStateToPromotiomDetail = null;
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


