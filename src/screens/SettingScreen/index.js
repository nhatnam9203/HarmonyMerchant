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
            case 1:
                return this.props.actions.staff.getStaffByMerchantId();
            case 2:
                return this.props.actions.category.getCategoriesByMerchantId();
            case 3:
                return this.props.actions.service.getServicesByMerchant();
            case 4:
                return  this.props.actions.extra.getExtraByMerchant();
            default:

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

    componentWillUnmount() {
        this.didBlurSubscription.remove();
        this.didFocusSubscription.remove();
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language
})



export default connectRedux(mapStateToProps, SettingScreen);