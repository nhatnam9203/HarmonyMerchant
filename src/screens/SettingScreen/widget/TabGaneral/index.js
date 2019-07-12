import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage } from '@utils';


class TabGaneral extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            languageApp: getNameLanguage(this.props.language)
        };
    }

    saveSettngApp = () => {
        const { languageApp } = this.state;
        const temptLanguage = languageApp === 'English' ? 'en' : 'vi';
        this.props.actions.dataLocal.changeLanguageApp(temptLanguage);
    }

}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabGaneral);