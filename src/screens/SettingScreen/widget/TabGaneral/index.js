import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion, gotoSettingsDevice } from '@utils';


class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        const { profile, autoCloseAt, autoLockScreenAfter } = this.props;

        const businessHourStart = profile.businessHourStart ? profile.businessHourStart : '';
        const businessHourEnd = profile.businessHourEnd ? profile.businessHourEnd : '';

        this.state = {
            languageApp: getNameLanguage(this.props.language),
            longitude: profile.longitude ? profile.longitude : '',
            latitude: profile.latitude ? profile.latitude : '',
            webLink: profile.webLink ? profile.webLink : '',
            businessHour: profile.businessHour ? profile.businessHour : '',
            autoCloseAt: autoCloseAt,
            autoLockScreenAfter: autoLockScreenAfter,
            businessHourStart: businessHourStart,
            businessHourEnd: businessHourEnd,
            timezone: profile.timezone ? profile.timezone : '',
            isUpdateInternal: false,

            businessWorkingTime: {
                Monday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Tuesday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Wednesday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Thursday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Friday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Saturday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                },
                Sunday: {
                    timeStart: businessHourStart,
                    timeEnd: businessHourEnd,
                    isCheck: true
                }
            }
        };
        this.inputRefsTime = [];
    }

    setRefTimeWorking = (ref) => {
        if (ref) {
            this.inputRefsTime.push(ref);
        }
    };

    setStateFromParent = async (webLink, businessHourStart, businessHourEnd, timezone) => {
        await this.setState({
            webLink,
            businessHourStart,
            businessHourEnd,
            timezone,
            isUpdateInternal: false,

        })
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

    saveSettngApp = async () => {
        const { languageApp, longitude, latitude, webLink,
            autoCloseAt, autoLockScreenAfter,
            businessHourStart, businessHourEnd, timezone
        } = this.state;
        const { profile } = this.props;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeSettingLocal(temptLanguage, autoLockScreenAfter, autoCloseAt);
        await this.setState({
            isUpdateInternal: true
        })
        this.props.actions.app.merchantSetting({
            businessHourStart: businessHourStart,
            businessHourEnd: businessHourEnd,
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
                businessHourStart: profile.businessHourStart ? profile.businessHourStart : '',
                businessHourEnd: profile.businessHourEnd ? profile.businessHourEnd : '',
                timezone: profile.timezone ? profile.timezone : '',
            })
        }
        if (prevProps.loading !== loading && prevProps.loading && !loading && this.state.isUpdateInternal) {
            // console.log("----- Internal 1 ------");
            await this.setState({
                webLink: profile.webLink ? profile.webLink : '',
                businessHourStart: profile.businessHourStart ? profile.businessHourStart : '',
                businessHourEnd: profile.businessHourEnd ? profile.businessHourEnd : '',
                timezone: profile.timezone ? profile.timezone : '',
                isUpdateInternal: false
            })
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