import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { CustomScrollTab } from "../../../widget";
import MarketingEfficiencyTab from "./MarketingEfficiency";
import PaymentMethodTab from "./PaymentMethod";
import { colors } from "@shared/themes";

function OverallTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  /**refs */
  const paymentTabRef = useRef(null);
  const efficiencyTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    paymentTabRef?.current?.goBack();
    efficiencyTabRef?.current?.goBack();
    setCurrentTab(tabIndex);

    switch (tabIndex) {
      case 0:
        paymentTabRef.current?.getOverallPaymentMethod();
        break;
      case 1:
        efficiencyTabRef.current?.getMarketingEfficiencyMethod();
        break;
      default:
        break;
    }
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        paymentTabRef.current?.goBack();
        break;
      case 1:
        efficiencyTabRef.current?.goBack();
        break;
      default:
        break;
    }

    setShowHeader(true);
  };

  const onShowHeader = (bl) => {
    setShowHeader(bl);
  };

  // public func
  useImperativeHandle(ref, () => ({
    goBack: onGoBack,
    didBlur: () => {
      // setTitleRangeTime("This week");
      paymentTabRef?.current?.didBlur();
      efficiencyTabRef?.current?.didBlur();
    },
    didFocus: () => {
      paymentTabRef?.current?.didFocus();
      efficiencyTabRef?.current?.didFocus();
    },
    callAPIForTwoTabs: () => {
      paymentTabRef?.current?.getOverallPaymentMethod();
      efficiencyTabRef?.current?.getMarketingEfficiencyMethod();
    },
  }));

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab} showHeader={showHeader}>
        <PaymentMethodTab
          style={{ flex: 1 }}
          ref={paymentTabRef}
          tabLabel="Payment Method"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />

        <MarketingEfficiencyTab
          style={{ flex: 1 }}
          ref={efficiencyTabRef}
          tabLabel="Marketing Efficiency"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />
      </CustomScrollTab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.WHITE, flex: 1 },
});

export default OverallTab = forwardRef(OverallTab);
