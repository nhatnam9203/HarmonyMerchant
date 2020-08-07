import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

import IMAGE from "@resources";

import { HeaderTabLayout } from "./widget";
import {
  StaffTab,
  GiftCardTab,
  CustomerTab,
  ServiceTab,
  ProductTab,
  OverallTab,
} from "./contents";
import styles from "./style";

function ReportScreen2({ showBackButton }, ref) {
  /**state */
  const [tabIndex, setTabIndex] = useState(0);

  /**refs */
  const staffRef = useRef(null);
  const giftCardRef = useRef(null);
  const customerRef = useRef(null);
  const overallRef = useRef(null);

  /**public function  */
  useImperativeHandle(ref, () => ({
    onBack: () => {
      switch (tabIndex) {
        case 0:
          staffRef.current.goBack();
          break;
        case 1:
          giftCardRef.current.goBack();
          break;
        case 2:
          customerRef.current.goBack();
          break;
        case 5:
          overallRef.current.goBack();
          break;
        default:
          break;
      }
    },
    didBlur: () => {
      switch (tabIndex) {
        case 0:
        default:
          staffRef.current.didBlur();
          break;
      }
    },
    didFocus: () => {
      switch (tabIndex) {
        case 0:
        default:
          staffRef.current.didFocus();
          break;
      }
    },
  }));

  const onTabChange = (taIndex) => {
    staffRef?.current?.goBack();
    giftCardRef?.current?.goBack();
    customerRef?.current?.goBack();
    overallRef?.current?.goBack();

    setTabIndex(taIndex);
    showBackButton(false);
  };

  const onShowBackButton = (bl) => {
    showBackButton(bl);
  };

  return (
    <View style={styles.container}>
      <HeaderTabLayout
        tabIcons={[
          IMAGE.Staff,
          IMAGE.giftcard,
          IMAGE.Customer,
          IMAGE.Services,
          IMAGE.Report_Product,
          IMAGE.Report_Overall,
        ]}
        onHeaderTabChanged={onTabChange}
      >
        <StaffTab
          style={styles.content}
          tabLabel="Staff salary"
          ref={staffRef}
          showBackButton={onShowBackButton}
        />
        <GiftCardTab
          style={styles.content}
          tabLabel="Gift card"
          ref={giftCardRef}
          showBackButton={onShowBackButton}
        />
        <CustomerTab
          style={styles.content}
          tabLabel="Customer"
          ref={customerRef}
          showBackButton={onShowBackButton}
        />
        <ServiceTab
          style={styles.content}
          tabLabel="Services"
          showBackButton={onShowBackButton}
        />
        <ProductTab
          style={styles.content}
          tabLabel="Product"
          showBackButton={onShowBackButton}
        />
        <OverallTab
          ref={overallRef}
          style={styles.content}
          tabLabel="Overall"
          showBackButton={onShowBackButton}
        />
      </HeaderTabLayout>
    </View>
  );
}

export default ReportScreen2 = forwardRef(ReportScreen2);
