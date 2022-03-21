import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import _ from "ramda";
import { PopupReceipt } from "@shared/components";

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

    const { appointment } = this.state;

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
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("WebView error: ", nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log(
              "WebView received error status code: ",
              nativeEvent.statusCode
            );
          }}
          onLoad={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log(nativeEvent.url);
          }}
          onContentProcessDidTerminate={this.reloadWebview}
        />

        <PopupReceipt
          ref={this.invoiceRef}
          doPrintClover={this.doPrintClover}
          cancelInvoicePrint={this.cancelInvoicePrint}
          appointment={appointment}
        />
      </View>
    );
  }
}

export default Layout;
