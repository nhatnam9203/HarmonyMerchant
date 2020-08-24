import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

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
  const language = useSelector((state) => state.dataLocal.language);

  const reportTabPermission = useSelector(
    (state) => state.staff.reportTabPermission
  );
  const reportTabPermissionSuccess = useSelector(
    (state) => state.staff.reportTabPermissionSuccess
  );
  /**state */
  const [tabIndex, setTabIndex] = useState(0);
  const [isMount, setIsMount] = useState(false);

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
          // case 1:
          //   giftCardRef.current.goBack();
          break;
        case 1:
          customerRef.current.goBack();
          break;
        case 2:
          overallRef.current.goBack();
          break;
        default:
          break;
      }
    },
    didBlur: () => {
      console.log("====> screen report -> didBlur");
      setIsMount(false);
      switch (tabIndex) {
        case 0:
        default:
          staffRef?.current?.didBlur();
          // giftCardRef?.current?.didBlur();
          customerRef?.current?.didBlur();
          overallRef?.current?.didBlur();

          break;
      }
    },
    didFocus: () => {},
  }));

  const onTabChange = (taIndex) => {
    staffRef?.current?.goBack();
    // giftCardRef?.current?.goBack();
    customerRef?.current?.goBack();
    overallRef?.current?.goBack();

    setTabIndex(taIndex);
    showBackButton(false);
  };

  const onShowBackButton = (bl) => {
    showBackButton(bl);
  };

  //
  useEffect(() => {
    if (reportTabPermissionSuccess === true && isMount) {
      switch (tabIndex) {
        case 0:
          staffRef?.current.didFocus();
          break;
          // case 1:
          //   giftCardRef.current.goBack();
          break;
        case 1:
          customerRef?.current.didFocus();
          break;
        case 2:
          overallRef?.current.didFocus();
          break;
        default:
          break;
      }
    }

    if (reportTabPermission === true && isMount === false) {
      setIsMount(true);
    }
  }, [reportTabPermission, reportTabPermissionSuccess]);

  return (
    <View style={styles.container}>
      <HeaderTabLayout
        tabIcons={[
          IMAGE.Staff,
          // IMAGE.giftcard,
          IMAGE.Customer,
          // IMAGE.Services,
          // IMAGE.Report_Product,
          IMAGE.Report_Overall,
        ]}
        onHeaderTabChanged={onTabChange}
      >
        <StaffTab
          style={styles.content}
          tabLabel={localize("Staff Salary", language)}
          ref={staffRef}
          showBackButton={onShowBackButton}
        />
        {/* <GiftCardTab
          style={styles.content}
          tabLabel={localize("Gift Card", language)}
          ref={giftCardRef}
          showBackButton={onShowBackButton}
        /> */}
        <CustomerTab
          style={styles.content}
          tabLabel={localize("Customer", language)}
          ref={customerRef}
          showBackButton={onShowBackButton}
        />
        {/*<ServiceTab
          style={styles.content}
          tabLabel="Services"
          showBackButton={onShowBackButton}
        />
        <ProductTab
          style={styles.content}
          tabLabel="Product"
          showBackButton={onShowBackButton}
        /> */}
        <OverallTab
          ref={overallRef}
          style={styles.content}
          tabLabel={localize("Overall", language)}
          showBackButton={onShowBackButton}
        />
      </HeaderTabLayout>
    </View>
  );
}

export default ReportScreen2 = forwardRef(ReportScreen2);
