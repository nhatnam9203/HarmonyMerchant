import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigationServices from '@navigators/NavigatorServices';
class CongratulationScreen extends Layout {
  constructor(props) {
    super(props);
  }

  gotoDrawerStack = () => {
    const { merchant = {} } = this.props;
    switch (merchant?.type) {
      case Constants.APP_TYPE.POS:
        NavigationServices.replace('SalonNavigator');
        break;
      case Constants.APP_TYPE.RETAILER:
        NavigationServices.replace('RetailerNavigator');
        break;
      default:
        NavigationServices.replace('AuthNavigator');

        break;
    }
    this.props.actions.dataLocal.resetNeddSettingStore();
  };
}

const mapStateToProps = (state) => ({
  language: state.dataLocal.language,
  merchant: state.dataLocal.profile,
});

export default connectRedux(mapStateToProps, CongratulationScreen);
