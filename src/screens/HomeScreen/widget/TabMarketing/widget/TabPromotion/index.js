import { Alert, NativeModules } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from "@navigators/NavigatorServices";

const PosLink = NativeModules.MyApp;

class TabPromotion extends Layout {

  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      mode: 'date',
      show: false,
    }
  }

  componentDidMount() {
    this.props.actions.marketing.getPromotionByMerchant();
  }


  getDataItemPromotion = (index, promotions) => {
    const data = promotions.filter(item => item.promotionId === index);
    return data[0];
  }

  showCalendar = () => {
    this.setState({
      show:true
    })
  }


}

const mapStateToProps = state => ({
  profile: state.dataLocal.profile,
  language: state.dataLocal.language,
  promotions: state.marketing.promotions
})



export default connectRedux(mapStateToProps, TabPromotion);


