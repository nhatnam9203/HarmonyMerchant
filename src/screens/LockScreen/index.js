import React from 'react';
import { Alert } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import NavigatorServices from '@navigators/NavigatorServices';

class LockScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            active: true,
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
        Promise.all([
            this.props.actions.category.getCategoriesByMerchantId(),
            this.props.actions.extra.getExtraByMerchant(),
            this.props.actions.service.getServicesByMerchant(),
            this.props.actions.product.getProductsByMerchant(),
            this.props.actions.staff.getStaffByMerchantId()
        ]).then((data) => {
            // console.log('----- data : ', data)
            if (data.length === 5) {
                this.props.actions.app.stopLoadingApp();
                this.props.actions.app.handleLockScreen(false);
                NavigatorServices.navigate('Drawer');
            }

        });
    }


    support = () => { }

    forgotPincode = () => {
        // this.props.navigation.navigate('ForgotPassword');
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
    loading: state.app.loading,
    isLoginStaff: state.dataLocal.isLoginStaff
});

export default connectRedux(mapStateToProps, LockScreen);