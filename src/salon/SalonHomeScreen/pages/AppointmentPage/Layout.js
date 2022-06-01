import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { WebView } from "react-native-webview";
import { PopupReceipt } from "@shared/components";
import _ from "ramda";

const injectedJavascript = `(function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
})() ;
window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}
true
`;

export const Layout = ({
  webviewRef,
  calendarLink,
  onMessageFromWebview,
  reloadWebview,
  invoiceRef,
  doPrintClover,
  cancelInvoicePrint,
  appointment,
}) => {
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: calendarLink }}
        startInLoadingState={true}
        injectedJavaScript={injectedJavascript}
        onMessage={onMessageFromWebview}
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
        onContentProcessDidTerminate={reloadWebview}
      />

      <PopupReceipt
        ref={invoiceRef}
        doPrintClover={doPrintClover}
        cancelInvoicePrint={cancelInvoicePrint}
        appointment={appointment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
