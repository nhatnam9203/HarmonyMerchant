import React from 'react';
import {
    View,
    // WebView
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';
import apiConfigs from '@configs/api';


const url = 'http://api.harmonypayment.com/calendar/index.html?token=';

class Layout extends React.Component {

    render() {
        const { token, profile } = this.props;
        const injectedJavascript = `(function() {
            window.postMessage = function(data) {
              window.ReactNativeWebView.postMessage(data);
            };
          })() ; 
          window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}
          true
          `;
        //   console.log(`----phi : ${apiConfigs.CALENDAR_URL}?token=${token}&merchantid=${profile.merchantId}` )
        return (
            <View style={styles.container} >
                <WebView
                    ref={this.webviewRef}
                    source={{ uri: `${apiConfigs.CALENDAR_URL}?token=${token}&merchantid=${profile.merchantId}` }}
                    startInLoadingState={true}
                    shouldStartLoad={true}
                    onLoadStart={this.onLoadStartWebview}
                    onLoadEnd={this.onLoadEndWebview}
                    injectedJavaScript={injectedJavascript}
                    onMessage={this.onMessageFromWebview}
                />
            </View>
        );
    }

}

export default Layout;

