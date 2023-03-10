import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import { CustomScrollTab } from "../../../widget";

import SalesByCategory from "./SalesByCategory";
import SalesByService from "./SalesByService";

function ServiceTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  /**refs */
  const salesByCategoryTabRef = useRef(null);
  const salesByServiceTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    salesByCategoryTabRef?.current?.goBack();
    salesByServiceTabRef?.current?.goBack();
    setCurrentTab(tabIndex);
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        salesByCategoryTabRef.current?.goBack();
        break;
      case 1:
        salesByServiceTabRef.current?.goBack();
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
      salesByCategoryTabRef?.current?.didBlur();
      salesByServiceTabRef?.current?.didBlur();
    },
    didFocus: () => {
      salesByCategoryTabRef?.current?.didFocus();
      salesByServiceTabRef?.current?.didFocus();
    },
  }));

  return (
    <View style={[style, { paddingTop: 10 }]}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab} showHeader={showHeader}>
        <SalesByCategory
          style={{ flex: 1 }}
          ref={salesByCategoryTabRef}
          tabLabel="Sales By Category"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />

        <SalesByService
          style={{ flex: 1 }}
          ref={salesByServiceTabRef}
          tabLabel="Sales By Service"
          showBackButton={showBackButton}
          showHeader={onShowHeader}
        />
      </CustomScrollTab>
    </View>
  );
}

export default ServiceTab = forwardRef(ServiceTab);
