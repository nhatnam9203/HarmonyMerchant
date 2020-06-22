import React from 'react';
import { Keyboard } from 'react-native';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';

class SettingScreen extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isFocus: true,
            indexTab: 0,
            visibleLogout: false
        }
        this.scrollTabRef = React.createRef();
        this.taxTabRef = React.createRef();
        this.generalTabRef = React.createRef();
    }

    componentDidMount() {

        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                this.setState({
                    isFocus: false
                })
            }
        );
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.setState({
                    isFocus: true
                });
                const { profile } = this.props;
                this.props.actions.app.getMerchantByID(profile.merchantId, false);

            }
        );
    }

    handleLockScreen = () => {
        const { isFocus } = this.state;
        if (isFocus) {
            this.props.navigation.navigate('Home');
            this.props.actions.app.changeFlagVisibleEnteerPinCode(true);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    selectMenu(index) {
        if (index === 7) {
            this.setState({
                visibleLogout: true
            })
        } else {
            this.setState({
                indexTab: index
            });
            this.fetchAPIsInSettingTab(index);
            this.scrollTabRef.current.goToPage(index);
            Keyboard.dismiss();
        }
    }

    fetchAPIsInSettingTab = (index) => {
        switch (index) {
            case 0:
                const { profile } = this.props;
                return this.props.actions.app.getMerchantByID(profile.merchantId, false);
            case 1:
                return this.props.actions.staff.getStaffByMerchantId();
            case 2:
                return this.props.actions.category.getCategoriesByMerchantId();
            case 3:
                return this.props.actions.service.getServicesByMerchant();
            case 4:
                return this.props.actions.extra.getExtraByMerchant();
            case 5:
                return this.updateTaxFromParent();
            default:

        }
    }

    updateTaxFromParent = () => {
        const { profile } = this.props;
        const productTAX = profile.taxProduct ? profile.taxProduct : '';
        const serviceTAX = profile.taxService ? profile.taxService : '';
        if (this.taxTabRef.current) {
            this.taxTabRef.current.setStateFromParent(productTAX, serviceTAX);
        } else {
            setTimeout(() => {
                this.taxTabRef.current.setStateFromParent(productTAX, serviceTAX);
            }, 500)
        }
    }

    logout = () => {
        this.props.actions.auth.logout();
        this.props.navigation.navigate('SigninStack');
    }

    backTab = () => {
        const { indexTab } = this.state;
        if (indexTab == 1) {
            this.props.actions.staff.switchAddStaff(false);
        }
        // this.props.actions.app.handleLockScreen(true);
    }

    componentDidUpdate(prevProps, prevState) {
        const { profile, loading } = this.props;
        if (prevProps.loading !== loading && prevProps.loading && !loading && !this.generalTabRef.current.state.isUpdateInternal && this.state.indexTab === 0) {
            this.generalTabRef.current.setStateFromParent(
                profile.webLink ? profile.webLink : '',
                profile.businessHourStart ? profile.businessHourStart : '',
                profile.businessHourEnd ? profile.businessHourEnd : '',
                profile.timezone ? profile.timezone : '',
            );
        }
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, SettingScreen);