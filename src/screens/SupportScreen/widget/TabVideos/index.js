import { Linking } from 'react-native'
import React from 'react';
import { YouTubeStandaloneIOS } from 'react-native-youtube';

import Layout from './layout';
import connectRedux from '@redux/ConnectRedux';
import { getNameLanguage, getPosotion } from '@utils';

class TabVideos extends Layout {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    showFullScreeen = (videoId) => {
        YouTubeStandaloneIOS.playVideo(videoId)
            .then(message => {})
            .catch(errorMessage => {});
    }

}

const mapStateToProps = state => ({
    profile: state.authMerchant.merchant,
    language: state.dataLocal.language,
})



export default connectRedux(mapStateToProps, TabVideos);