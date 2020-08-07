import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import { CustomScrollTab } from "../../widget";

import SalesByCategory from "./SalesByCategory";
import SalesByProduct from "./SalesByProduct";

function ProductTab({ style, showBackButton }, ref) {
  /**redux store */
  const language = useSelector((state) => state.dataLocal.language);

  /**state store */
  const [currentTab, setCurrentTab] = useState(0);

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
        salesByCategoryTabRef.current.goBack();
        break;
      case 1:
        salesByProductTabRef.current.goBack();
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
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
    },
  }));

  return (
    <View style={style}>
      <CustomScrollTab onHeaderTabChanged={onChangeTab}>
        <SalesByCategory
          style={{ flex: 1 }}
          ref={salesByCategoryTabRef}
          tabLabel="Sales by category"
          showBackButton={showBackButton}
        />

        <SalesByProduct
          style={{ flex: 1 }}
          ref={salesByProductTabRef}
          tabLabel="Sales by product"
          showBackButton={showBackButton}
        />
      </CustomScrollTab>
    </View>
  );
}

export default ProductTab = forwardRef(ProductTab);
