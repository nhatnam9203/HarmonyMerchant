import Layout from "./layout";
import connectRedux from "@redux/ConnectRedux";

class ApplicationSubmitScreen extends Layout {
  constructor(props) {
    super(props);
  }

  submit = () => {
    const {
      generalInfo,
      businessInfo,
      bankInfo,
      principalInfo,
      selectPackageAndPricing,
      type,
    } = this.props;
    this.props.actions.app.registerUser({
      generalInfo,
      businessInfo,
      bankInfo,
      principalInfo,
      pricingType: selectPackageAndPricing.pricingType,
      packagePricing: selectPackageAndPricing.packagePricing,
      type,
    });
  };
}

const mapStateToProps = (state) => ({
  generalInfo: state.app.generalInfo,
  businessInfo: state.app.businessInfo,
  bankInfo: state.app.bankInfo,
  principalInfo: state.app.principalInfo,
  selectPackageAndPricing: state.app.selectPackageAndPricing,
  language: state.dataLocal.language,
  type: state.app.type,
});

export default connectRedux(mapStateToProps, ApplicationSubmitScreen);
