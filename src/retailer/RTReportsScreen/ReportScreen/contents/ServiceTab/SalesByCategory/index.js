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

import SalesByCategory from "./SalesByCategory";
import SalesByCategoryStatistic from "./SalesByCategoryStatistic";

const FILTER_NAME_DEFAULT_LIST = [
  { value: "All Category", id: "all" },
  { value: "Top 5 category", id: "top5" },
  { value: "Top 10 category", id: "top10" },
];

const FILTER_NAME_DEFAULT = FILTER_NAME_DEFAULT_LIST[1]?.value;
const RANGE_TIME_DEFAULT = "This Week";

function SalesByCategoryTab({ style, showBackButton, showHeader }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const exportFilePath = useSelector(
    (state) => state.report.serviceSaleByCategoryExportPath
  );

  const statisticExportFilePath = useSelector(
    (state) => state.report.serviceSaleByCategoryDetailExportPath
  );

  const serviceSaleByCategoryList = useSelector(
    (state) => state.report.serviceSaleByCategoryList
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

  const getCategoryId = (filterId) => {
    let defaultFilterId = filterId ?? filterNameItem;
    const filterDefaultItem = FILTER_NAME_DEFAULT_LIST.find(
      (x) => x.value === defaultFilterId || x.id === defaultFilterId
    );
    return filterDefaultItem?.id;
  };

  const getServiceSalesByCategory = async (filterId) => {
    await dispatch(
      actions.report.getServiceByCategoryReportSales(
        true,
        layoutRef?.current?.getTimeUrl(),
        getCategoryId(filterId) ?? filterId
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (titmeTitle) => {
    await setTitleRangeTime(titmeTitle);
    // TODO: call reload list
    await getServiceSalesByCategory();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    setResetTab(false);

    await setFilterNameItem(filterId);
    if (FILTER_NAME_DEFAULT_LIST.find((x) => x.value === filterId)) {
      await getServiceSalesByCategory(filterId);
    }
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.categoryName);
    layoutRef.current?.goNext();
    showHeader(false);
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    const filterItem = serviceSaleByCategoryList.find(
      (item) => item.categoryName === filterNameItem
    );

    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportServiceSaleByCategory(
            getCategoryId() || filterItem?.categoryId,
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      case 1:
        if (!filterItem) return;
        dispatch(
          actions.report.exportServiceSaleByCategoryDetail(
            filterItem.categoryId,
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
    layoutRef.current?.handleTheDownloadedFile(filePath);
  };

  const onChangeTab = (tabIndex) => {
    if (tabIndex === 0) {
      setResetTab(true);
    }
  };
  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current?.goBack();
    },
    didBlur: () => {
    },
    didFocus: () => {
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  useEffect(() => {
    getServiceSalesByCategory();
  }, []);

  const refreshData = () => {
    setRefreshing(true);

    const filterItem = serviceSaleByCategoryList.find(
      (item) => item.categoryName === filterNameItem
    );

    getServiceSalesByCategory(getCategoryId() || filterItem?.categoryId);
  };

  React.useEffect(() => {
    setRefreshing(false);
  }, [serviceSaleByCategoryList]);

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
        <SalesByCategory
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Category"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("SalesByCategory")}
          pathFileExport={exportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onChangeFilterId={onChangeFilterId}
          defaultFilterList={FILTER_NAME_DEFAULT_LIST}
          defaultFilterName={FILTER_NAME_DEFAULT}
          onRefresh={refreshData}
          resetTab={resetTab}
          isRefreshing={refreshing}
        />
        <SalesByCategoryStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Category Statistics"
          title="Sales By Category Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("SalesByCategoryDetail")}
          pathFileExport={statisticExportFilePath}
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

export default SalesByCategoryTab = forwardRef(SalesByCategoryTab);
