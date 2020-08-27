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

import SalesByService from "./SalesByService";
import SalesByServiceStatistic from "./SalesByServiceStatistic";

const FILTER_NAME_DEFAULT_LIST = [
  { value: "All service", id: "all" },
  { value: "Top 5 service", id: "top5" },
  { value: "Top 10 service", id: "top10" },
];

const FILTER_NAME_DEFAULT = FILTER_NAME_DEFAULT_LIST[1]?.value;

const RANGE_TIME_DEFAULT = "This Week";

function SalesByServiceTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const exportFilePath = useSelector(
    (state) => state.report.serviceSaleByServiceExportPath
  );

  const statisticExportFilePath = useSelector(
    (state) => state.report.serviceSaleByServiceDetailExportPath
  );

  const serviceSaleByServiceList = useSelector(
    (state) => state.report.serviceSaleByServiceList
  );

  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);

  /**ref */
  const layoutRef = useRef(null);

  /**function */

  const getServiceId = (filterId) => {
    let defaultFilterId = filterId ?? filterNameItem;
    const filterDefaultItem = FILTER_NAME_DEFAULT_LIST.find(
      (x) => x.value === defaultFilterId
    );
    return filterDefaultItem?.id;
  };

  const getServiceSaleByService = async (filterId) => {
    await dispatch(
      actions.report.getServiceByServiceReportSales(
        true,
        layoutRef?.current?.getTimeUrl(),
        getServiceId(filterId)
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
    await getServiceSaleByService();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
    if (FILTER_NAME_DEFAULT_LIST.find((x) => x.value === filterId)) {
      await getServiceSaleByService(filterId);
    }
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.name);
    layoutRef.current.goNext();
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    const filterItem = serviceSaleByServiceList.find(
      (item) => item.name === filterNameItem
    );
    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportServiceSaleByService(
            getServiceId() || filterItem?.serviceId,
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
          actions.report.exportServiceSaleByServiceDetail(
            filterItem.serviceId,
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

  // public function
  useImperativeHandle(ref, () => ({
    goBack: () => {
      layoutRef.current.goBack();
    },
    didBlur: () => {
      // setTitleRangeTime("This week");
    },
    didFocus: () => {
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  useEffect(() => {
    getServiceSaleByService();
  }, []);

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
        <SalesByService
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales by service"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("SalesByService")}
          pathFileExport={exportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onChangeFilterId={onChangeFilterId}
          defaultFilterList={FILTER_NAME_DEFAULT_LIST}
          defaultFilterName={FILTER_NAME_DEFAULT}
        />
        <SalesByServiceStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales by service Statistics"
          title="Sales by service Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("SalesByServiceDetail")}
          pathFileExport={statisticExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SalesByServiceTab = forwardRef(SalesByServiceTab);
