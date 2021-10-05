import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import _ from "ramda";
import { PopupInvoicePrint } from "@components";

import styles from "./style";

class Layout extends React.Component {
  render() {
    const {visiblePrintInvoice} = this.state;

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

        <PopupInvoicePrint
          ref={this.invoicePrintRef}
          visiblePrintInvoice={visiblePrintInvoice}
          onRequestClose={this.cancelInvoicePrint}
        />
      </View>
    );
  }
}

export default Layout;
