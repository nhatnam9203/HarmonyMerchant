import React from "react";
import { View } from "react-native";

import IMAGE from "@resources";
import { localize } from "@utils";

import { HeaderTabLayout } from "./widget";
import {
  StaffSalaryTab,
  GiftCardTab,
  CustomerTab,
  ServicesTab,
  ProductTab,
  OverallTab,
} from "./contents";
import styles from "./style";

export default function ReportScreen2({}) {
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
      >
        <StaffSalaryTab style={styles.content} tabLabel="Staff salary" />
        <GiftCardTab style={styles.content} tabLabel="Gift card" />
        <CustomerTab style={styles.content} tabLabel="Customer" />
        <ServicesTab style={styles.content} tabLabel="Services" />
        <ProductTab style={styles.content} tabLabel="Product" />
        <OverallTab style={styles.content} tabLabel="Overall" />
      </HeaderTabLayout>
    </View>
  );
}
