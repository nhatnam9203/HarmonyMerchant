import { Linking } from 'react-native'
import React from 'react';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';

class TabVideos extends Layout {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            status: '',
            quality: '',
            error: ''
        };
    }


}

const mapStateToProps = state => ({
    profile: state.dataLocal.profile,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabVideos);