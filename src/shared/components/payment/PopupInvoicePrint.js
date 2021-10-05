import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { StarPRNT } from "react-native-star-prnt";
import { captureRef, releaseCapture } from "react-native-view-shot";
import Dash from "react-native-dash";
import { getFullName } from "@shared/utils";

import ButtonCustom from "./ButtonCustom";
import {
  scaleSize,
  localize,
  getPaymentString,
  formatMoney,
  formatWithMoment,
  getStaffNameForInvoice,
  getInfoFromModelNameOfPrinter,
  checkIsTablet,
  formatNumberFromCurrency,
} from "../utils";
import connectRedux from "@redux/ConnectRedux";
import PrintManager from "@lib/PrintManager";

export const PopupInvoicePrint = () => {
  const viewShotRef = React.useRef(null);

  const tempHeight = checkIsTablet() ? scaleSize(400) : scaleSize(450);

  return (
    <Modal
      visible={visiblePrintInvoice}
      onRequestClose={() => {}}
      transparent={true}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{ height: tempHeight }}>
            <ScrollView
              style={{ flex: 1 }}
              automaticallyAdjustContentInsets={true}
              keyboardShouldPersistTaps="always"
            >



            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  content: {
    backgroundColor: "#fff",
    width: scaleWidth(290),
  },
});
