import React from 'react';
import { } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getServiceIdByName } from '@utils';
import { scaleSzie } from '../../../../../../utils';


class TabPromotion extends Layout {

  constructor(props) {
    super(props);
    this.state = {
      dateCalendar: new Date(),
      keyCalendarUpdate: '',
      promotionIdCalendar: -1,
      show: false,
    }
    this.promotionFirstRef = React.createRef();
    this.promotionSecondRef = React.createRef();
    this.promotionThirdRef = React.createRef();
    this.promotionFourRef = React.createRef();
    this.promotionFiveRef = React.createRef();
    this.promotionRewardPointsRef = React.createRef();
    this.scrollRef = React.createRef();
  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant();
  }

  onPressListPromotion = () => {
    this.props.actions.marketing.getPromotionByMerchant(false);
  }

  setDateSelected = (date) => {
    const { promotionIdCalendar } = this.state;
    if (promotionIdCalendar === 1) {
      this.promotionFirstRef.current.setDateFromParent(this.state.keyCalendarUpdate, date);
    } else if (promotionIdCalendar === 6) {
      this.promotionRewardPointsRef.current.setDateFromParent(this.state.keyCalendarUpdate, date);
    } else {
      this.promotionSecondRef.current.setDateFromParent(this.state.keyCalendarUpdate, date);
    }
    this.props.actions.marketing.setStatusApplyButton(true);
  }

  getDataItemPromotion = (index, promotions) => {
    const data = promotions.filter(item => item.promotionId === index);
    return data[0];
  }

  getDataDropdownService() {
    const { servicesByMerchant } = this.props;
    return servicesByMerchant.map(item => {
      return { value: item.name }
    });
  }

  showCalendar = async (keyCalendarUpdate, date, promotionId) => {
    await this.setState({
      dateCalendar: date,
      keyCalendarUpdate: keyCalendarUpdate,
      promotionIdCalendar: promotionId
    })
    await this.setState({
      show: true
    });
  }

  applyPromotion = (promotionId, isSendNoti) => {
    // console.log("--- promotionId :", promotionId);
    const { servicesByMerchant } = this.props;

    const promotionFirst = this.promotionFirstRef.current.state.data;
    const promotionSeconde = this.promotionSecondRef.current.state.data;
    const promotionThird = this.promotionThirdRef.current.state.data;
    const promotionFour = this.promotionFourRef.current.state.data;
    const promotionFive = this.promotionFiveRef.current.state.data;

    const temptPromotionSecond = {
      ...this.promotionSecondRef.current.state.data,
      serviceUsing: getServiceIdByName(servicesByMerchant, promotionSeconde.serviceUsing ? promotionSeconde.serviceUsing : 0),
      serviceApply: getServiceIdByName(servicesByMerchant, promotionSeconde.serviceApply ? promotionSeconde.serviceApply : 0),
    };

    let tempPromotion;
    switch (parseInt(promotionId)) {
      case 1:
        tempPromotion = promotionFirst;
        break;
      case 2:
        tempPromotion = temptPromotionSecond;
        break;
      case 3:
        tempPromotion = promotionThird;
        break;
      case 4:
        tempPromotion = promotionFour;
        break;
      case 5:
        tempPromotion = promotionFive;
        break;
      default:
        tempPromotion = promotionFive;
    };

    // const dataUpdate = [promotionFirst, temptPromotionSecond, promotionThird, promotionFour, promotionFive];
    this.props.actions.marketing.updatePromotionByMerchant([tempPromotion], promotionId, isSendNoti);
  }

  checkSelectPromotion = () => {
    this.props.actions.marketing.setStatusApplyButton(true);
  }

  sendNotification = (promotionId) => {

    this.props.actions.marketing.sendNotificationByPromotionId(promotionId);
  }

  updatePromotionsFromParent = () => {
    const { promotions } = this.props;
    this.promotionFirstRef.current.setStateFromParent(this.getDataItemPromotion(1, promotions));
    this.promotionSecondRef.current.setStateFromParent(this.getDataItemPromotion(2, promotions));
    this.promotionThirdRef.current.setStateFromParent(this.getDataItemPromotion(3, promotions));
    this.promotionFourRef.current.setStateFromParent(this.getDataItemPromotion(4, promotions));
    this.promotionFiveRef.current.setStateFromParent(this.getDataItemPromotion(5, promotions));
    this.promotionRewardPointsRef.current.setStateFromParent(this.getDataItemPromotion(6, promotions));
  }

  scrollToNumber = (num = 0) => {
    this.scrollRef.current.scrollTo({ x: 0, y: scaleSzie(num), animated: true })
  }

  toogleOtherPromotions = (ref) => {
    let firstPromotion = this.promotionFirstRef === this[ref] ? false : true;
    let secondPromotion = this.promotionSecondRef === this[ref] ? false : true;
    let thirdPromotion = this.promotionThirdRef === this[ref] ? false : true;
    let fourPromotion = this.promotionFourRef === this[ref] ? false : true;
    let fivePromotion = this.promotionFiveRef === this[ref] ? false : true;
    let rewardPromotion = this.promotionRewardPointsRef === this[ref] ? false : true;

    this.promotionFirstRef.current.toogleFromParent(firstPromotion);
    this.promotionSecondRef.current.toogleFromParent(secondPromotion);
    this.promotionThirdRef.current.toogleFromParent(thirdPromotion);
    this.promotionFourRef.current.toogleFromParent(fourPromotion);
    this.promotionFiveRef.current.toogleFromParent(fivePromotion);
    this.promotionRewardPointsRef.current.toogleFromParent(rewardPromotion);
  }

  componentDidUpdate(prevProps, prevState) {
    const { profile, isGetPromotionByMerchant } = this.props;
    if (prevProps.isGetPromotionByMerchant !== isGetPromotionByMerchant && isGetPromotionByMerchant) {
      this.props.actions.marketing.resetStateGetPromotion();
      this.updatePromotionsFromParent();
    }
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


