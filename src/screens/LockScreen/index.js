import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigatorServices from '@navigators/NavigatorServices';
import { openBrowser } from '@utils';

class LockScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            active: true,
            visibleForotPin: false
        }
        this.idInputRef = React.createRef();
        this.passwordInputRef = React.createRef();
    }

    submitPincode = () => {
        const password = this.passwordInputRef.current.state.value;
        const { profile } = this.props
        if (password.length === 4) {
            this.props.actions.staff.loginStaff(profile.merchantCode, password);
        } else {
            Alert.alert(`Pin must 4 numeric`);
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
                this.props.actions.staff.getStaffByMerchantId()
            ]).then((data) => {
                if (data.length === 5) {
                    this.props.actions.app.stopLoadingApp();
                    this.props.actions.app.handleLockScreen(false);
                    NavigatorServices.navigate('Drawer');
                }

            });
        }

    }


    support = () => {
        openBrowser('https://www.harmonypayment.com/');
    }

    forgotPincode = async () => {
        this.props.actions.staff.setVisibleForgotPin(true);
    }

    onAction = (active) => {
        this.setState({
            active,
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const { loading, visibleModalLock, isLoginStaff } = this.props;
        if (!loading && loading !== prevProps.loading && visibleModalLock && isLoginStaff) {
            this.props.actions.dataLocal.resetStateLoginStaff();
            this.gotoDrawer();
        }
    }

}

const mapStateToProps = state => ({
    language: state.dataLocal.language,
    errorLogin: state.auth.errorLogin,
    visibleModalLock: state.app.visibleModalLock,
    profile: state.dataLocal.profile,
    token: state.dataLocal.token,
    loading: state.app.loading,
    isLoginStaff: state.dataLocal.isLoginStaff,
    visibleForotPin: state.staff.visibleForotPin,
    profileStaffLogin: state.dataLocal.profileStaffLogin
});

export default connectRedux(mapStateToProps, LockScreen);