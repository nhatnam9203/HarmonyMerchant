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
  ServicesTab,
  ProductTab,
  OverallTab,
} from "./contents";
import styles from "./style";

function ReportScreen2({showBackButton }, ref) {
  const [tabIndex, setTabIndex] = useState(0);
  const staffRef = useRef(null);
  /**create ref, share function to public */
  useImperativeHandle(ref, () => ({
    onBack: () => {
      switch (tabIndex) {
        case 0:
          staffRef.current.goBack();
          break;

        default:
          break;
      }
    },
  }));

  const onTabChange = (taIndex) => {
    console.log("onTabChange", taIndex);
    setTabIndex(taIndex);
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
          showBackButton={showBackButton}
        />
        <GiftCardTab style={styles.content} tabLabel="Gift card" />
        <CustomerTab style={styles.content} tabLabel="Customer" />
        <ServicesTab style={styles.content} tabLabel="Services" />
        <ProductTab style={styles.content} tabLabel="Product" />
        <OverallTab style={styles.content} tabLabel="Overall" />
      </HeaderTabLayout>
    </View>
  );
}

export default ReportScreen2 = forwardRef(ReportScreen2);
