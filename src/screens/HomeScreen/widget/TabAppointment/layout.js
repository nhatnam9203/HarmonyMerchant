import React from 'react';
import {
    View,
    // WebView
} from 'react-native';
import { WebView } from 'react-native-webview';

import styles from './style';

const url = 'https://hpcalendar.levincidemo.com/?token=';

class Layout extends React.Component {

    render() {
        const { token } = this.props;
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
                    source={{ uri: `${url}${token}` }}
                    startInLoadingState={true}
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

