import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage } from '@utils';


class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        const { profile ,autoCloseAt,autoLockScreenAfter} = this.props;
        this.state = {
            languageApp: getNameLanguage(this.props.language),
            longitude: profile.longitude ? profile.longitude : '',
            latitude: profile.latitude ? profile.latitude : '',
            webLink: profile.webLink ? profile.webLink : '',
            businessHour: profile.businessHour ? profile.businessHour : '',
            autoCloseAt: autoCloseAt,
            autoLockScreenAfter: autoLockScreenAfter
        };
    }

    saveSettngApp = () => {
        const { languageApp, longitude, latitude, webLink,
        autoCloseAt,autoLockScreenAfter } = this.state;
        const { profile } = this.props;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeSettingLocal(temptLanguage,autoLockScreenAfter,autoCloseAt);
        this.props.actions.app.merchantSetting({
            businessHour: "",
            webLink: webLink,
            latitude: latitude,
            longitude: longitude,
        }, profile.merchantId);
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
    autoCloseAt: state.dataLocal.autoCloseAt,
    autoLockScreenAfter: state.dataLocal.autoLockScreenAfter
})



export default connectRedux(mapStateToProps, TabGaneral);