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

function SalesByCategoryTab({ style, showBackButton }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const customerExportFilePath = useSelector(
    (state) => state.report.customerExportFilePath
  );

  const customerStatisticExportFilePath = useSelector(
    (state) => state.report.customerStatisticExportFilePath
  );

  const productSaleByCategoryList = useSelector(
    (state) => state.report.productSaleByCategoryList
  );

  const isDownloadReport = useSelector(
    (state) => state.report.isDownloadReport
  );

  /**state */
  const [titleRangeTime, setTitleRangeTime] = useState("This week");
  const [filterNameItem, setFilterNameItem] = useState(undefined);
  const [filterNames, setFilterNames] = useState([]);

  /**ref */
  const layoutRef = useRef(null);

  /**function */
  const getProductSaleByCategory = async () => {
    await dispatch(
      actions.report.getProductByCategoryReportSales(
        true,
        layoutRef?.current?.getTimeUrl(),
        filterNameItem
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
    await getProductSaleByCategory();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
  };

  const onGoStatistics = async (item) => {
    await setFilterNameItem(item.categoryName);
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
        const filterItem = productSaleByCategoryList.find(
          (item) => item.categoryName === filterNameItem
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
      setTitleRangeTime("This week");
    },
    didFocus: () => {
      // console.log("====> screen report -> staff didFocus");
    },
  }));

  /**effect */
  useEffect(() => {
    getProductSaleByCategory();
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
        <SalesByCategory
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales By Category"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("SalesByCategory")}
          pathFileExport={customerExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
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
          showExportFile={() => onShowPopupExport("SalesByCategoryStatistic")}
          pathFileExport={customerStatisticExportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
        />
      </ReportLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SalesByCategoryTab = forwardRef(SalesByCategoryTab);
