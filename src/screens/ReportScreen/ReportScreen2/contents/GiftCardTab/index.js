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

function GiftCardTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const giftCardReportList = useSelector(
    (state) => state.report.giftCardReportList
  );

  const meExportFilePath = useSelector(
    (state) => state.report.meExportFilePath
  );

  const meStatisticExportFilePath = useSelector(
    (state) => state.report.meStatisticExportFilePath
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState("This week");
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
    // TODO: call reload list
    await getGiftCardReportSales();
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
          actions.report.exportMarketingEfficiency(
            layoutRef?.current?.getTimeUrl(),
            true,
            "excel",
            titleExportFile
          )
        );
        break;
      case 1:
        const promotion = marketingEfficiencyList.find(
          (item) => item.name === filterNameItem
        );
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
      setTitleRangeTime("This week");
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
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
      >
        <GiftCardReportTab
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Gift Card"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("Gift Card ")}
          pathFileExport={meExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
        <GiftCardStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Gift Card Statistics"
          title="Gift Card Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("Gift Card Statistic ")}
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

export default GiftCardTab = forwardRef(GiftCardTab);
