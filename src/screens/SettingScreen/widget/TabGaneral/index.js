import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';


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
        };
    }

    getCurrentPosition = async () => {
        const position = await getPosotion();
        const { latitude, longitude } = position.coords;
        await this.setState({
            latitude: `${latitude}`,
            longitude: `${longitude}`,
        })
    }

    saveSettngApp = () => {
        const { languageApp, longitude, latitude, webLink,
            autoCloseAt, autoLockScreenAfter,
            businessHourStart, businessHourEnd
        } = this.state;
        const { profile } = this.props;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeSettingLocal(temptLanguage, autoLockScreenAfter, autoCloseAt);
        this.props.actions.app.merchantSetting({
            businessHourStart: businessHourStart,
            businessHourEnd: businessHourEnd,
            webLink: webLink,
            latitude: latitude,
            longitude: longitude,
        });
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    autoCloseAt: state.dataLocal.autoCloseAt,
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter,
    stateCity : state.dataLocal.stateCity
})



export default connectRedux(mapStateToProps, TabGaneral);