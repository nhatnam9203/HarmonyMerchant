import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion, gotoSettingsDevice } from '@utils';


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
            businessHourStart: profile.businessHourStart ? profile.businessHourStart : '',
            businessHourEnd: profile.businessHourEnd ? profile.businessHourEnd : '',

            isUpdateInternal: false
        };
    }

    setStateFromParent = async (webLink, businessHourStart, businessHourEnd) => {
        console.log("webLink : ", webLink);
        console.log("businessHourStart : ", businessHourStart);
        console.log("businessHourEnd : ", businessHourEnd);

        await this.setState({
            webLink,
            businessHourStart,
            businessHourEnd,
            isUpdateInternal: false
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
            businessHourStart, businessHourEnd
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
        });
    }

    async  componentDidUpdate(prevProps, prevState) {
        const { profile, refreshingGeneral, loading } = this.props;
        if (prevProps.refreshingGeneral !== refreshingGeneral && !refreshingGeneral) {
            // console.log("----- Internal ------");
            await this.setState({
                webLink: profile.webLink ? profile.webLink : '',
                businessHourStart: profile.businessHourStart ? profile.businessHourStart : '',
                businessHourEnd: profile.businessHourEnd ? profile.businessHourEnd : '',
            })
        }
        if (prevProps.loading !== loading && prevProps.loading && !loading && this.state.isUpdateInternal) {
            // console.log("----- Internal 1 ------");
            await this.setState({
                webLink: profile.webLink ? profile.webLink : '',
                businessHourStart: profile.businessHourStart ? profile.businessHourStart : '',
                businessHourEnd: profile.businessHourEnd ? profile.businessHourEnd : '',
                isUpdateInternal: false
            })
        }


    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    autoCloseAt: state.dataLocal.autoCloseAt,
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
    stateCity: state.dataLocal.stateCity,
    refreshingGeneral: state.app.refreshingGeneral,
    loading: state.app.loading
})



export default connectRedux(mapStateToProps, TabGaneral);