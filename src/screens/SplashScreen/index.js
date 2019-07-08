import _ from 'ramda';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SplashScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

     componentDidMount() {
        const { profile, token } = this.props;
        this.props.actions.app.getStateCity();
        setTimeout(() => {
            if (!token) {
                this.props.navigation.navigate('Auth');
            } else if (token && !profile.needSetting) {
              Promise.all([
                    this.props.actions.category.getCategoriesByMerchantId(),
                    this.props.actions.extra.getExtraByMerchant(),
                    this.props.actions.service.getServicesByMerchant(),
                    this.props.actions.product.getProductsByMerchant(),
                    this.props.actions.staff.getStaffByMerchantId()
                ]).then((data) => {
                    
                    this.props.navigation.navigate('Drawer');
                });

                
            } else {
                this.props.navigation.navigate('SetupStore');
            }
        }, 1000)

    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token: state.dataLocal.token
})



export default connectRedux(mapStateToProps, SplashScreen);