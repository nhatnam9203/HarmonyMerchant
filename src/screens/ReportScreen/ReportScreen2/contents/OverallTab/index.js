import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import { CustomScrollTab } from "../../widget";

import MarketingEfficiencyTab from "./MarketingEfficiency";
import PaymentMethodTab from "./PaymentMethod";

function OverallTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);

  /**refs */
  const paymentTabRef = useRef(null);
  const efficiencyTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    paymentTabRef?.current?.goBack();
    efficiencyTabRef?.current?.goBack();
    setCurrentTab(tabIndex);
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        paymentTabRef.current.goBack();
        break;
      case 1:
        efficiencyTabRef.current.goBack();
        break;
      default:
        break;
    }
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
  }));

  return (
    <View style={[style, {paddingTop: 10}]}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab}>
        <PaymentMethodTab
          style={{ flex: 1, }}
          ref={paymentTabRef}
          tabLabel="Payment Method"
          showBackButton={showBackButton}
        />

        <MarketingEfficiencyTab
          style={{ flex: 1 }}
          ref={efficiencyTabRef}
          tabLabel="Marketing Efficiency"
          showBackButton={showBackButton}
        />
      </CustomScrollTab>
    </View>
  );
}

export default OverallTab = forwardRef(OverallTab);
