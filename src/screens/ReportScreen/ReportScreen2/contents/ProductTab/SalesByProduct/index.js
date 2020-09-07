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

import SalesByProduct from "./SalesByProduct";
import SalesByProductStatistic from "./SalesByProductStatistic";

const FILTER_NAME_DEFAULT_LIST = [
  { value: "All product", id: "all" },
  { value: "Top 5 product", id: "top5" },
  { value: "Top 10 product", id: "top10" },
];

const FILTER_NAME_DEFAULT = FILTER_NAME_DEFAULT_LIST[1]?.value;

const RANGE_TIME_DEFAULT = "This Week";

function SalesByProductTab({ style, showBackButton, showHeader }, ref) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const exportFilePath = useSelector(
    (state) => state.report.productSaleByProductExportPath
  );

  const statisticExportFilePath = useSelector(
    (state) => state.report.productSaleByProductDetailExportPath
  );

  const productSaleByProductList = useSelector(
    (state) => state.report.productSaleByProductList
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

  const getProductId = (filterId) => {
    let defaultFilterId = filterId ?? filterNameItem;
    const filterDefaultItem = FILTER_NAME_DEFAULT_LIST.find(
      (x) => x.value === defaultFilterId
    );
    return filterDefaultItem?.id;
  };

  const getProductSaleByProduct = async (filterId) => {
    await dispatch(
      actions.report.getProductByProductReportSales(
        true,
        layoutRef?.current?.getTimeUrl(),
        getProductId(filterId)
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
    await getProductSaleByProduct();
  };

  const onChangeFilterNames = (names) => {
    setFilterNames(names);
  };

  const onChangeFilterId = async (filterId) => {
    await setFilterNameItem(filterId);
    if (FILTER_NAME_DEFAULT_LIST.find((x) => x.value === filterId)) {
      await getProductSaleByProduct(filterId);
    }
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
    const filterItem = productSaleByProductList.find(
      (item) => item.name === filterNameItem
    );

    switch (currentTab) {
      case 0:
        dispatch(
          actions.report.exportProductSaleByProduct(
            getProductId() || filterItem?.productId,
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
          actions.report.exportProductSaleByProductDetail(
            filterItem.productId,
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
    getProductSaleByProduct();
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
        <SalesByProduct
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales by product"
          onGoStatistics={onGoStatistics}
          showCalendar={() => showCalendar(true)}
          titleRangeTime={titleRangeTime}
          onChangeFilterNames={onChangeFilterNames}
          showExportFile={() => onShowPopupExport("SalesByProduct")}
          pathFileExport={exportFilePath}
          handleTheDownloadedFile={onHandleTheDownloadedFile}
          onChangeFilterId={onChangeFilterId}
          defaultFilterList={FILTER_NAME_DEFAULT_LIST}
          defaultFilterName={FILTER_NAME_DEFAULT}
        />
        <SalesByProductStatistic
          style={{ flex: 1, paddingTop: 10 }}
          tabLabel="Sales by product Statistics"
          title="Sales by product Statistics"
          titleRangeTime={titleRangeTime}
          showCalendar={() => showCalendar(true)}
          dataFilters={filterNames}
          filterId={filterNameItem}
          onChangeFilter={onChangeFilterId}
          showExportFile={() => onShowPopupExport("SalesByProductStatistic")}
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

export default SalesByProductTab = forwardRef(SalesByProductTab);
