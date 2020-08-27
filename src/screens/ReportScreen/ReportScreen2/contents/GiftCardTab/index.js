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
import GiftCardReportTab from "./GiftCardReportTab";
import GiftCardStatistic from "./GiftCardStatistic";

const RANGE_TIME_DEFAULT = "This Week";

function GiftCardTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const giftCardExportFilePath = useSelector(
    (state) => state.report.giftCardExportFilePath
  );

  const giftCardStatisticExportFilePath = useSelector(
    (state) => state.report.giftCardStatisticExportFilePath
  );

  const giftCardReportList = useSelector(
    (state) => state.report.giftCardReportList
  );

  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState(RANGE_TIME_DEFAULT);
  const [urlRangeTime, setUrlRangeTime] = useState(null);
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getGiftCardReportSales = async () => {
    await dispatch(
      actions.report.getGiftCardReportSales(
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
    await getGiftCardReportSales();
    setUrlRangeTime(layoutRef?.current?.getTimeUrl());
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.type);
    layoutRef.current.goNext();
  };

  const onShowPopupExport = (title) => {
    layoutRef?.current?.showPopupExport(title);
  };

  const onRequestExportFileToServer = (currentTab, titleExportFile) => {
    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportGiftCardReportSales(
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      case 1:
        const filterItem = giftCardReportList.find(
          (item) => item.type === filterNameItem
        );
        if (!filterItem) return;
        dispatch(
          actions.report.exportGiftCardReportSalesStatistics(
            filterItem.giftCardGeneralId,
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
      // console.log("====> screen report -> giftcard didBlur");
      // getGiftCardReportSales();
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
      layoutRef?.current?.setTimeFilter(RANGE_TIME_DEFAULT);

    },
  }));

  /**effect */
  useEffect(() => {
    getGiftCardReportSales();
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
        <GiftCardReportTab
          style={{ flex: 1 }}
          tabLabel="Gift Card"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          urlRangeTime={urlRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("GiftCard")}
          pathFileExport={giftCardExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
        <GiftCardStatistic
          style={{ flex: 1 }}
          tabLabel="Gift Card Statistics"
          title="Gift Card Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("GiftCardStatistic")}
          pathFileExport={giftCardStatisticExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default GiftCardTab = forwardRef(GiftCardTab);
