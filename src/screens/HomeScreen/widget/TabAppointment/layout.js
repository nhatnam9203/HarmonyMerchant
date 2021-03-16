import React from 'react';
import {
    View,
    ScrollView,
    Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import _ from 'ramda';

import { PopupConfirm, PopupCheckStaffPermission } from '@components';
import styles from './style';
import { localize, } from '@utils';


class Layout extends React.Component {

    render() {
        const injectedJavascript = `(function() {
            window.postMessage = function(data) {
              window.ReactNativeWebView.postMessage(data);
            };
          })() ; 
          window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}
          true
          `;
        return (
            <View style={styles.container} >
                <WebView
                    ref={this.webviewRef}
                    source={{ uri: this.state.calendarLink }}
                    startInLoadingState={true}
                    injectedJavaScript={injectedJavascript}
                    onMessage={this.onMessageFromWebview}
                    cacheEnabled={false}
                    useWebKit={true}
                />
            </View>
        );
    }

}


const ShadowLine = ({ style }) => {
    return (
        <View style={[styles.shadowLine, style]} />
    )
}

export default Layout;

