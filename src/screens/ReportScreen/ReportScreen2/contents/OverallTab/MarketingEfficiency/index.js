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
import MarketingEfficiency from "./MarketingEfficiency";
import MarketingEfficiencyStatistic from "./MarketingEfficiencyStatistic";

const RANGE_TIME_DEFAULT = "This Week";

function MarketingEfficiencyTab({ style, showBackButton, showHeader }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const marketingEfficiencyList = useSelector(
    (state) => state.report.marketingEfficiencyList
  );

  const meExportFilePath = useSelector(
    (state) => state.report.meExportFilePath
  );

  const meStatisticExportFilePath = useSelector(
    (state) => state.report.meStatisticExportFilePath
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
  const getMarketingEfficiencyMethod = async () => {
    await dispatch(
      actions.report.getOverallMarketingEfficiency(
        true,
        layoutRef?.current?.getTimeUrl()
      )
    );
  };

  const showCalendar = (isShow) => {
    layoutRef?.current?.showCalendar(isShow);
  };

  //callback
  const onChangeTimeTitle = async (timeTitle) => {
    await setTitleRangeTime(timeTitle);
    // TODO: call reload list
    await getMarketingEfficiencyMethod();
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
    showHeader(false);
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    const promotion = marketingEfficiencyList.find(
      (item) => item.name === filterNameItem
    );

    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportMarketingEfficiency(
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile,
            promotion?.promotionId
          )
        );
        break;
      case 1:
        if (!promotion) return;
        dispatch(
          actions.report.exportMarketingEfficiencyStatistics(
            promotion.promotionId,
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
      // console.log("====> screen report -> staff didFocus");
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);
    },
  }));

  /**effect */
  useEffect(() => {
    getMarketingEfficiencyMethod();
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
        <MarketingEfficiency
          style={{ flex: 1 }}
          tabLabel="Marketing Efficiency"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("MarketingEfficiency")}
          pathFileExport={meExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onChangeFilterId={onChangeFilterId}
        />
        <MarketingEfficiencyStatistic
          style={{ flex: 1 }}
          tabLabel="Marketing Efficiency Statistics"
          title="Marketing Efficiency Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() =>
            onShowPopupExport("MarketingEfficiencyStatistic")
          }
          pathFileExport={meStatisticExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default MarketingEfficiencyTab = forwardRef(MarketingEfficiencyTab);
