import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import actions from "@actions";

import { ReportLayout } from "../../widget";

import CustomerReportTab from "./CustomerReportTab";
import CustomerStatistic from "./CustomerStatistic";

const RANGE_TIME_DEFAULT = "This Week";

function CustomerTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const exportFilePath = useSelector((state) => state.report.exportFilePath);

  // const statisticExportFilePath = useSelector(
  //   (state) => state.report.statisticExportFilePath
  // );

  const customerReportList = useSelector(
    (state) => state.report.customerReportList
  );

  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getCustomerReportSales = async () => {
    await dispatch(
      actions.report.getCustomerSales(true, layoutRef?.current?.getTimeUrl())
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (titmeTitle) => {
    await setTitleRangeTime(titmeTitle);
    await getCustomerReportSales();

    // TODO: call reload list
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.name);
    layoutRef.current.goNext();
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportCustomerSalesSales(
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      case 1:
        // const filterItem = customerReportList.find(
        //   (item) => item.type === filterNameItem
        // );
        // if (!filterItem) return;
        // dispatch(
        //   actions.report.exportGiftCardReportSalesStatistics(
        //     filterItem.giftCardGeneralId,
        //     layoutRef?.current?.getTimeUrl(),
        //     true,
        //     "excel",
        //     titleExportFile
        //   )
        // );
        break;
      default:
        break;
    }
  };

  const onHandleTheDownloadedFile = (filePath) => {
    layoutRef.current.handleTheDownloadedFile(filePath);
  };

  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current.goBack();
    },
    didBlur: () => {
      // console.log("====> screen report -> customer didBlur");
      // getCustomerReportSales();
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  useEffect(() => {
    getCustomerReportSales();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    getCustomerReportSales();
  };

  React.useEffect(() => {
    setRefreshing(false);
  }, [customerReportList]);

  return (
    <View style={[styles.container, style]}>
      <ReportLayout
        ref={layoutRef}
        style={style}
        showBackButton={showBackButton}
        onChangeTimeTitle={onChangeTimeTitle}
        onRequestExportFileToServer={onRequestExportFileToServer}
        isDownloadReport={isDownloadReport}
      >
        <CustomerReportTab
          style={{ flex: 1 }}
          tabLabel="Customer"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("Customer")}
          pathFileExport={exportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
        />
        <CustomerStatistic
          style={{ flex: 1 }}
          tabLabel="Customer Statistics"
          title="Customer Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("CustomerStatistic")}
          // pathFileExport={statisticExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onRefresh={refreshData}
          isRefreshing={refreshing}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default CustomerTab = forwardRef(CustomerTab);
