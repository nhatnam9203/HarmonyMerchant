import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getServiceIdByName } from '@utils';
import { scaleSize } from '@utils';

class TabPromotion extends Layout {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0
    };

    this.scrollTabParentRef = React.createRef();
    this.promotionDetailRef = React.createRef();
  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant(false);
  }

  onChangeTab = (index) => {
    const currentIndex = index.i;
    this.props.handleChangeBackgrounColor(currentIndex);
  }



  createNewCampaign = () => {
    this.props.actions.marketing.resetStatePromotionDetailById();
    this.props.actions.marketing.getSMSInformation(1);
    this.goToPage(1);
    if (this.promotionDetailRef?.current) {
      this.promotionDetailRef?.current?.setStateFromParent();
    } else {
      setTimeout(() => {
        this.promotionDetailRef?.current?.setStateFromParent();
      }, 300)
    }

  }

  editCampaign = (campaign) => () => {

    this.goToPage(1);
    if (this.promotionDetailRef?.current) {
      this.promotionDetailRef?.current?.setStateFromParent(campaign);
    } else {
      setTimeout(() => {
        this.promotionDetailRef?.current?.setStateFromParent(campaign);
      }, 300)
    }


    this.props.actions.marketing.getPromotionDetailById(campaign?.id,campaign?.conditionId);
    // setTimeout(() => {
    //   this.props.actions.marketing.getSMSInformation(campaign?.conditionId);
    // }, 500)
  }

  getSMSInformation = (conditionId) => {
    // console.log("----- getSMSInformation: ",conditionId);
    this.props.actions.marketing.getSMSInformation(conditionId);
  }

  disableCampaign = (campaign) => () => {
    this.props.actions.marketing.disablePromotionById(campaign?.id || 0);
  }

  enableCampaign = (campaign) => () => {
    this.props.actions.marketing.enablePromotionById(campaign?.id || 0);
  }

  cancelCampaign = () => {
    this.scrollTabParentRef?.current?.goToPage(0);
  }

  goToPage = (page = 1) => {
    if (this.scrollTabParentRef?.current) {
      this.scrollTabParentRef?.current?.goToPage(page);
    } else {
      setTimeout(() => {
        this.scrollTabParentRef?.current?.goToPage(page);
      }, 300)
    }
  }

  updatePromotionById = (promotionId, body) => {
    this.props.actions.marketing.updatePromotionById(promotionId, body);
  }

  handleCreateNewCampaign = (campaign) => {
    this.props.actions.marketing.createNewCampaign(campaign);
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

  componentDidUpdate(prevProps, prevState) {
    const { isUpdatePromotionById } = this.props;
    if (isUpdatePromotionById && prevProps.isUpdatePromotionById !== isUpdatePromotionById) {
      this.props.actions.marketing.resetStateIsUpdatePromotionById(false);
      this.goToPage(0);
    }
  }

}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  promotions: state.marketing.promotions,
  servicesByMerchant: state.service.servicesByMerchant,
  categoriesByMerchant: state.category.categoriesByMerchant,
  isApplyPromotion: state.marketing.isApplyPromotion,
  refreshingPromotion: state.marketing.refreshingPromotion,
  isGetPromotionByMerchant: state.marketing.isGetPromotionByMerchant,

  isUpdatePromotionById: state.marketing.isUpdatePromotionById
})



export default connectRedux(mapStateToProps, TabPromotion);


