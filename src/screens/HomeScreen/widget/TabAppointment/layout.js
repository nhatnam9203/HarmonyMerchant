import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import _ from "ramda";
import { PopupInvoice } from "@shared/components/payment";

import styles from "./style";

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
      <View style={styles.container}>
        <WebView
          ref={this.webviewRef}
          source={{ uri: this.state.calendarLink }}
          startInLoadingState={true}
          injectedJavaScript={injectedJavascript}
          onMessage={this.onMessageFromWebview}
          cacheEnabled={false}
          useWebKit={true}
        />

        <PopupInvoice ref={this.invoiceRef} 
        doPrintClover={(imageUri) => this.doPrintClover(imageUri)}/>
      </View>
    );
  }
}

export default Layout;
