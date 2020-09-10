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

import { ReportLayout } from "../../../widget";
import PaymentMethod from "./PaymentMethod";
import PaymentStatistic from "./PaymentStatistic";

const RANGE_TIME_DEFAULT = "This Week";

function PaymentMethodTab({ style, showBackButton, showHeader }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );

  const overallPMExportFilePath = useSelector(
    (state) => state.report.overallPMExportFilePath
  );

  const overallPMStatisticExportFilePath = useSelector(
    (state) => state.report.overallPMStatisticExportFilePath
  );

  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [resetTab, setResetTab] = useState(false);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getOverallPaymentMethod = async () => {
    await dispatch(
      actions.report.getOverallPaymentMethod(
        true,
        layoutRef?.current?.getTimeUrl()
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (titmeTitle) => {
    await setTitleRangeTime(titmeTitle);
    await getOverallPaymentMethod();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    setResetTab(false);
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.displayMethod);
    layoutRef.current.goNext();
    showHeader(false);
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    const item = overallPaymentMethodList.find(
      (item) => item.displayMethod === filterNameItem
    );
    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportPaymentMethod(
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile,
            item?.method
          )
        );
        break;
      case 1:
        if (!item) return;
        dispatch(
          actions.report.exportPaymentMethodStatistics(
            item.method,
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      default:
        break;
    }
  };

  const onHandleTheDownloadedFile = (filePath) => {
    layoutRef.current.handleTheDownloadedFile(filePath);
  };

  const onChangeTab = (tabIndex) => {
    if (tabIndex === 0) {
      setResetTab(true);
    }
  };

  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current.goBack();
    },
    didBlur: () => {
      // setTitleRangeTime("This week");
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  useEffect(() => {
    getOverallPaymentMethod();
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    getOverallPaymentMethod();
  };

  React.useEffect(() => {
    setRefreshing(false);
  }, [overallPaymentMethodList]);

  return (
    <View style={[styles.container, style]}>
      <ReportLayout
        ref={layoutRef}
        style={style}
        showBackButton={showBackButton}
        onChangeTimeTitle={onChangeTimeTitle}
        onRequestExportFileToServer={onRequestExportFileToServer}
        isDownloadReport={isDownloadReport}
        tabChange={onChangeTab}

      >
        <PaymentMethod
          style={{ flex: 1 }}
          tabLabel="Payment Method"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("PaymentMethod")}
          pathFileExport={overallPMExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onChangeFilterId={onChangeFilterId}
          onRefresh={refreshData}
          resetTab={resetTab}
          isRefreshing={refreshing}
        />
        <PaymentStatistic
          style={{ flex: 1 }}
          tabLabel="Payment Method Statistics"
          title="Payment Method Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("PaymentMethodStatistic")}
          pathFileExport={overallPMStatisticExportFilePath}
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

export default PaymentMethodTab = forwardRef(PaymentMethodTab);
