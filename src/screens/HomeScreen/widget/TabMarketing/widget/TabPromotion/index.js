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
      keyCalendarUpdate:'',
      show: false,
    }
    this.promotionFirstRef = React.createRef();

  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant();
  }

  setDateSelected = (date) => {
    this.promotionFirstRef.current.setDateFromParent(this.state.keyCalendarUpdate,date);
  }

  getDataItemPromotion = (index, promotions) => {
    const data = promotions.filter(item => item.promotionId === index);
    return data[0];
  }

  showCalendar = async (keyCalendarUpdate,date) => {
    await this.setState({
      dateCalendar: date,
      keyCalendarUpdate:keyCalendarUpdate
    })
    await this.setState({
      show: true
    })
  }


}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  promotions: state.marketing.promotions
})



export default connectRedux(mapStateToProps, TabPromotion);


