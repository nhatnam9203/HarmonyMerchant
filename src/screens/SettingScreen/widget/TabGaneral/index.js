import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import {
    getNameLanguage, getPosotion, gotoSettingsDevice, BusinessWorkingTime,
    getTitleSignInAppDisplay, getValueSignInAppDisplay,
    getTitleSendLinkGoogle, getValueSendLinkGoogle
} from '@utils';

class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        const { profile, autoLockScreenAfter } = this.props;

        this.state = {
            languageApp: getNameLanguage(this.props.language),
            longitude: profile?.longitude || '',
            latitude: profile?.latitude || '',
            webLink: profile?.webLink || '',
            autoCloseAt: profile.autoCloseAt || "",
            autoLockScreenAfter: autoLockScreenAfter,
            timezone: profile?.timezone || '',
            isUpdateInternal: false,
            businessHour: profile?.businessHour || BusinessWorkingTime,
            turnAmount: profile?.turnAmount || 0,
            staffColumn: profile?.staffColumn || 8,
            signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
            sendReviewLinkOption: getTitleSendLinkGoogle(profile?.sendReviewLinkOption || ""),
            isUsingTurn: profile?.isUsingTurn || false,

            giftForNewEnabled: profile?.giftForNewEnabled || false
        };
        this.inputRefsTime = [];
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }
    };

    setStateFromParent = async (webLink, timezone, autoCloseAt, turnAmount, staffColumn, signinAppStyle, sendReviewLinkOption, isUsingTurn, giftForNewEnabled) => {
        const { isFocus, currentTab } = this.props;
        if (isFocus && currentTab === 0) {
            await this.setState({
                webLink,
                timezone,
                autoCloseAt,
                turnAmount,
                isUpdateInternal: false,
                staffColumn,
                signinAppStyle: getTitleSignInAppDisplay(signinAppStyle),
                sendReviewLinkOption: getTitleSendLinkGoogle(sendReviewLinkOption || ""),
                isUsingTurn,
                giftForNewEnabled
            });
            this.updateWorkTime();
        }

    }

    updateWorkTime = () => {
        const { profile } = this.props;
        const businessHour = profile.businessHour ? profile.businessHour : BusinessWorkingTime;
        for (let i = 0; i < this.inputRefsTime.length; i++) {
            this.inputRefsTime[i].setStateFromParent(businessHour[this.inputRefsTime[i].props.title]);
        }
    }

    onRefreshGeneral = () => {
        const { profile } = this.props;
        this.props.actions.app.getMerchantByID(profile.merchantId, true);
    }

    getCurrentPosition = async () => {
        try {
            const position = await getPosotion();
            const { latitude, longitude } = position.coords;
            await this.setState({
                latitude: `${latitude}`,
                longitude: `${longitude}`,
            })
        } catch (error) {
            gotoSettingsDevice();
        }
    }

    changeAutoLockTime = (value) => {
        this.props.actions.dataLocal.updateAutoLockTime(value);
    }

    saveSettngApp = async () => {
        const { profile } = this.props;
        const { languageApp, longitude, latitude, webLink, autoCloseAt, timezone,
            turnAmount, staffColumn, signinAppStyle, sendReviewLinkOption, isUsingTurn, giftForNewEnabled
        } = this.state;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeSettingLocal(temptLanguage, autoCloseAt);
        await this.setState({
            isUpdateInternal: true
        });
        let objWorkingTime = [];
        this.inputRefsTime.forEach(ref => {
            objWorkingTime = {
                ...objWorkingTime,
                [ref.props.title]: {
                    timeStart: ref.state.timeStart,
                    timeEnd: ref.state.timeEnd,
                    isCheck: ref.state.isCheck
                }
            }
        });
        this.props.actions.app.merchantSetting({
            businessHour: objWorkingTime,
            webLink: webLink,
            latitude: latitude,
            longitude: longitude,
            taxService: profile.taxService,
            taxProduct: profile.taxProduct,
            timezone,
            autoLockscreen: "",
            autoCloseAt,
            turnAmount,
            staffColumn,
            signinAppStyle: getValueSignInAppDisplay(signinAppStyle),
            sendReviewLinkOption: getValueSendLinkGoogle(sendReviewLinkOption),
            isUsingTurn,
            giftForNewEnabled
        }, true, true);
    }

    switchTipOnPaxMachine = (visible) => {
        this.props.actions.dataLocal.switchTipOnPaxMachine(visible);
    }

    async componentDidUpdate(prevProps, prevState) {
        const { profile, refreshingGeneral, loading, isFocus, currentTab } = this.props;
        if (isFocus && currentTab === 0 && prevProps.refreshingGeneral !== refreshingGeneral && !refreshingGeneral) {
            await this.setState({
                webLink: profile?.webLink || '',
                timezone: profile?.timezone || '',
                autoCloseAt: profile?.autoCloseAt || '',
                turnAmount: profile?.turnAmount || 0,
                staffColumn: profile?.staffColumn || 8,
                signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
                sendReviewLinkOption: getTitleSendLinkGoogle(profile?.sendReviewLinkOption || ""),
                isUsingTurn: profile?.isUsingTurn || false,
                giftForNewEnabled: profile?.giftForNewEnabled || false
            });
            this.updateWorkTime();
        }
        if (isFocus && currentTab === 0 && prevProps.loading !== loading && prevProps.loading && !loading && this.state.isUpdateInternal) {
            // console.log("----- Internal 1 ------: ");
            await this.setState({
                webLink: profile?.webLink || '',
                timezone: profile?.timezone || '',
                autoCloseAt: profile?.autoCloseAt || '',
                turnAmount: profile?.turnAmount || 0,
                staffColumn: profile?.staffColumn || 8,
                isUpdateInternal: false,
                signinAppStyle: getTitleSignInAppDisplay(profile?.signinAppStyle || ""),
                sendReviewLinkOption: getTitleSendLinkGoogle(profile?.sendReviewLinkOption || ""),
                isUsingTurn: profile?.isUsingTurn || false,
                giftForNewEnabled: profile?.giftForNewEnabled || false
            });
            this.updateWorkTime();
        }
    }

    componentWillUnmount() {
        this.inputRefsTime = [];
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    autoCloseAt: state.dataLocal.autoCloseAt,
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
    stateCity: state.dataLocal.stateCity,
    refreshingGeneral: state.app.refreshingGeneral,
    loading: state.app.loading,
    versionApp: state.dataLocal.versionApp,
    isTipOnPaxMachine: state.dataLocal.isTipOnPaxMachine
})



export default connectRedux(mapStateToProps, TabGaneral);