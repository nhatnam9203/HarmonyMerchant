import React from 'react';
import { Alert, NativeModules } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";

const PosLink = NativeModules.MyApp;

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
  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant();
  }

  setDateSelected = (date) => {
    const { promotionIdCalendar } = this.state;
    if (promotionIdCalendar === 1) {
      this.promotionFirstRef.current.setDateFromParent(this.state.keyCalendarUpdate, date);
    } else {
      this.promotionSecondRef.current.setDateFromParent(this.state.keyCalendarUpdate, date);
    }
  }

  getDataItemPromotion = (index, promotions) => {
    const data = promotions.filter(item => item.promotionId === index);
    return data[0];
  }

  getDataDropdownService(){
    const {servicesByMerchant} = this.props;
    return servicesByMerchant.map(item =>{
      return {value: item.name}
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
    })
  }

  applyPromotion = () => {
    const promotionFirst = this.promotionFirstRef.current.state.data;
    const promotionSeconde = this.promotionSecondRef.current.state.data;
    const promotionThird = this.promotionThirdRef.current.state.data;
    const promotionFour = this.promotionFourRef.current.state.data;
    const promotionFive = this.promotionFiveRef.current.state.data;

    const dataUpdate = [promotionFirst,promotionSeconde,promotionThird,promotionFour,promotionFive];
    
    // console.log('promotionFirst : ', JSON.stringify(dataUpdate));
    this.props.actions.marketing.updatePromotionByMerchant(dataUpdate);
  }

}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  promotions: state.marketing.promotions,
  servicesByMerchant: state.service.servicesByMerchant
})



export default connectRedux(mapStateToProps, TabPromotion);


