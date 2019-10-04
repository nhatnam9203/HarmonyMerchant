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
        const { token } = this.props;
        this.props.actions.app.resetIsFlashScreen(true);
        if (!token) {
            this.props.actions.app.getStateCity();
            this.props.navigation.navigate('Auth');
        } else {
            // this.props.actions.app.handleLockScreen(true);
            this.props.navigation.navigate('Drawer');
        }
    }

    gotoDrawer() {
        const { profile } = this.props;
        if (profile.needSetting) {
            this.props.actions.app.handleLockScreen(false);
            this.props.navigation.navigate('SetupStore');
        } else {
            Promise.all([
                this.props.actions.category.getCategoriesByMerchantId(),
                this.props.actions.extra.getExtraByMerchant(),
                this.props.actions.service.getServicesByMerchant(),
                this.props.actions.product.getProductsByMerchant(),
                this.props.actions.staff.getStaffByMerchantId(),
                this.props.actions.app.getStateCity()
            ]).then((data) => {
                if (data.length === 6) {
                    this.props.actions.app.stopLoadingApp();
                    this.props.actions.app.handleLockScreen(false);
                    this.props.navigation.navigate('Drawer');
                }

            });
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, visibleModalLock, isLoginStaff, isFlashScreen } = this.props;
        if (isFlashScreen && !loading && loading !== prevProps.loading && visibleModalLock && isLoginStaff) {
            this.props.actions.dataLocal.resetStateLoginStaff();
            this.gotoDrawer();
        }
    }

    componentWillUnmount() {
        this.props.actions.app.resetIsFlashScreen();
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    profileStaffLogin: state.dataLocal.profileStaffLogin,
    visibleModalLock: state.app.visibleModalLock,
    isLoginStaff: state.dataLocal.isLoginStaff,
    loading: state.app.loading,
    isFlashScreen: state.app.isFlashScreen
})



export default connectRedux(mapStateToProps, SplashScreen);