import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { CustomScrollTab } from "../../../widget";
import SalesByCategory from "./SalesByCategory";
import SalesByProduct from "./SalesByProduct";
import { colors } from "@shared/themes";

function ProductTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);
  const [showHeader, setShowHeader] = useState(true);

  /**refs */
  const salesByCategoryTabRef = useRef(null);
  const salesByProductTabRef = useRef(null);

  /**function */
  const onChangeTab = (tabIndex) => {
    salesByCategoryTabRef?.current?.goBack();
    salesByProductTabRef?.current?.goBack();
    setCurrentTab(tabIndex);
  };

  const onGoBack = () => {
    switch (currentTab) {
      case 0:
        salesByCategoryTabRef.current?.goBack();
        break;
      case 1:
        salesByProductTabRef.current?.goBack();
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
      salesByProductTabRef?.current?.didBlur();
    },
    didFocus: () => {
      salesByCategoryTabRef?.current?.didFocus();
      salesByProductTabRef?.current?.didFocus();
    },
  }));

  const onShowBackButton = (bl) => {
    if (showBackButton && typeof showBackButton === "function") {
      showBackButton(bl);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 10 }]}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab} showHeader={showHeader}>
        <SalesByCategory
          style={{ flex: 1 }}
          ref={salesByCategoryTabRef}
          tabLabel="Sales By Category"
          showBackButton={onShowBackButton}
          showHeader={onShowHeader}
        />

        <SalesByProduct
          style={{ flex: 1 }}
          ref={salesByProductTabRef}
          tabLabel="Sales By Product"
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

export default ProductTab = forwardRef(ProductTab);
