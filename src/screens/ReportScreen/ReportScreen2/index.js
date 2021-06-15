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
  const serviceRef = useRef(null);
  const productRef = useRef(null);
  const overallRef = useRef(null);
  const scrollTabRef = useRef(null);

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
        case 3:
          serviceRef.current.goBack();
          break;
        case 4:
          productRef.current.goBack();
          break;
        case 5:
          overallRef.current.goBack();
          break;
        default:
          break;
      }
    },
    didBlur: () => {
      setIsMount(false);
      switch (tabIndex) {
        case 0:
        default:
          staffRef?.current?.didBlur();
          giftCardRef?.current?.didBlur();
          customerRef?.current?.didBlur();
          serviceRef?.current?.didBlur();
          productRef?.current?.didBlur();
          overallRef?.current?.didBlur();

          break;
      }
      scrollTabRef?.current?.goToFirstTab();
    },
    didFocus: () => {
      switch (tabIndex) {
        case 0:
          staffRef.current.didFocus();
          break;
        case 1:
          giftCardRef.current.didFocus();
          break;
        case 2:
          customerRef.current.didFocus();
          break;
        case 3:
          serviceRef.current.didFocus();
          break;
        case 4:
          productRef.current.didFocus();
          break;
        case 5:
          overallRef.current.didFocus();
          break;
        default:
          break;
      }
    },
  }));

  const onTabChange = (index) => {
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
      case 3:
        serviceRef.current.goBack();
        break;
      case 4:
        productRef.current.goBack();
        break;
      case 5:
        overallRef.current.goBack();
        break;
      default:
        break;
    }

    setTabIndex(index);
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
          staffRef.current.didFocus();
          break;
        case 1:
          giftCardRef.current.didFocus();
          break;
        case 2:
          customerRef.current.didFocus();
          break;
        case 3:
          serviceRef.current.didFocus();
          break;
        case 4:
          productRef.current.didFocus();
          break;
        case 5:
          overallRef.current.didFocus();
          break;
        default:
          break;
      }
    }

    if (reportTabPermission === true && isMount === false) {
      setIsMount(true);
    }
  }, [reportTabPermission, reportTabPermissionSuccess]);

  // ------------- New Code ---------------

  handleOnChangeTab = (i) => {
    // switch (i) {
    //   case 0:
    //     staffRef.current.didFocus();
    //     break;
    //   case 1:
    //     giftCardRef.current.didFocus();
    //     break;
    //   case 2:
    //     customerRef.current.didFocus();
    //     break;
    //   case 3:
    //     serviceRef.current.didFocus();
    //     break;
    //   case 4:
    //     productRef.current.didFocus();
    //     break;
    //   case 5:
    //     overallRef.current.didFocus();
    //     break;
    //   default:
    //     break;
    // }
    switch (i) {
      case 0:
        staffRef?.current?.getListStaffsSalaryTop();
        break;
      case 1:
        giftCardRef?.current?.getGiftCardReportSales();
        break;
      case 2:
        customerRef?.current?.getCustomerReportSales();
        break;
      case 5:
        overallRef?.current?.callAPIForTwoTabs();
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderTabLayout
        ref={scrollTabRef}
        tabIcons={[
          IMAGE.Staff,
          IMAGE.giftcard,
          IMAGE.Customer,
          IMAGE.Services,
          IMAGE.Report_Product,
          IMAGE.Report_Overall,
        ]}
        onHeaderTabChanged={onTabChange}
        handleOnChangeTab={handleOnChangeTab}
      >
        <StaffTab
          ref={staffRef}
          style={styles.content}
          tabLabel={localize("Staff Salary", language)}
          showBackButton={onShowBackButton}
        />
        <GiftCardTab
          ref={giftCardRef}
          style={styles.content}
          tabLabel={localize("Gift Card", language)}
          showBackButton={onShowBackButton}
        />
        <CustomerTab
          ref={customerRef}
          style={styles.content}
          tabLabel={localize("Customer", language)}
          showBackButton={onShowBackButton}
        />
        <ServiceTab
          ref={serviceRef}
          style={styles.content}
          tabLabel={localize("Services", language)}
          showBackButton={onShowBackButton}
        />
        <ProductTab
          style={styles.content}
          tabLabel={localize("Product", language)}
          ref={productRef}
          showBackButton={onShowBackButton}
        />
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
