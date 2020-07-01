import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion, gotoSettingsDevice, BusinessWorkingTime } from '@utils';


class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        const { profile, autoCloseAt, autoLockScreenAfter } = this.props;

        this.state = {
            languageApp: getNameLanguage(this.props.language),
            longitude: profile.longitude ? profile.longitude : '',
            latitude: profile.latitude ? profile.latitude : '',
            webLink: profile.webLink ? profile.webLink : '',
            businessHour: profile.businessHour ? profile.businessHour : '',
            autoCloseAt: autoCloseAt,
            autoLockScreenAfter: autoLockScreenAfter,
            timezone: profile.timezone ? profile.timezone : '',
            isUpdateInternal: false,
            businessHour: profile.businessHour ? profile.businessHour : BusinessWorkingTime
        };
        this.inputRefsTime = [];
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }
    };


    setStateFromParent = async (webLink,timezone) => {
        await this.setState({
            webLink,
            timezone,
            isUpdateInternal: false,
        });
        this.updateWorkTime();
    }

    updateWorkTime = () =>{
        const {profile} = this.props;
        const businessHour = profile.businessHour ? profile.businessHour : BusinessWorkingTime;
        for(let i = 0; i< this.inputRefsTime.length; i++ ){
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

    changeAutoLockTime =(value) =>{
       this.props.actions.dataLocal.updateAutoLockTime(value);
    }

    saveSettngApp = async () => {
        const { languageApp, longitude, latitude, webLink,
            autoCloseAt, autoLockScreenAfter, timezone
        } = this.state;
        const { profile } = this.props;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeSettingLocal(temptLanguage, autoLockScreenAfter, autoCloseAt);
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
            businessHour:objWorkingTime,
            webLink: webLink,
            latitude: latitude,
            longitude: longitude,
            taxService: profile.taxService,
            taxProduct: profile.taxProduct,
            timezone,
            autoLockscreen: ""
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        const { profile, refreshingGeneral, loading } = this.props;
        if (prevProps.refreshingGeneral !== refreshingGeneral && !refreshingGeneral) {
            // console.log("----- Internal ------");
            await this.setState({
                webLink: profile.webLink ? profile.webLink : '',
                timezone: profile.timezone ? profile.timezone : '',
            });
            this.updateWorkTime();
        }
        if (prevProps.loading !== loading && prevProps.loading && !loading && this.state.isUpdateInternal) {
            // console.log("----- Internal 1 ------");
            await this.setState({
                webLink: profile.webLink ? profile.webLink : '',
                timezone: profile.timezone ? profile.timezone : '',
                isUpdateInternal: false
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
    versionApp: state.dataLocal.versionApp
})



export default connectRedux(mapStateToProps, TabGaneral);