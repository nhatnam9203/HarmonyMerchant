import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

import { PopupButton, TableList, ReportTabLayout } from "../../widget";
import GiftCardBarGroupChart from "./chart/GiftCardReportChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};
const FILTER_NAME_DEFAULT = "All Type";
const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

export default function GiftCardReportTab({
  style,
  onGoStatistics,
  titleRangeTime,
  urlRangeTime,
  showCalendar,
  onChangeFilterNames,
  onChangeFilterId,
  showExportFile,
  pathFileExport,
  handleTheDownloadedFile,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const giftCardReportList = useSelector(
    (state) => state.report.giftCardReportList
  );

  /**state */
  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST);
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);
  const [chartData, setChartData] = useState(null);

  /**function */
  const changeViewMode = (mode) => {
    if (!mode) return;
    setViewMode(mode);
  };

  const viewModeList = () => changeViewMode(VIEW_MODE.LIST);
  const viewModeChart = () => changeViewMode(VIEW_MODE.CHART);

  const bindChartData = async () => {
    // if (!giftCardReportList) return [];
    // console.log(overallPaymentMethodList);
    // const data = createChartObjectFromValues(
    //   marketingEfficiencyList,
    //   "method",
    //   "netPayment"
    // );
    await setChartData(giftCardReportList || []);
  };

  // create filter name data
  const bindFilterName = () => {
    if (!giftCardReportList) return [];

    let array = [];

    const arrMap = giftCardReportList.map((item) => ({
      value: item.type,
      ...item,
    }));
    array.push(...arrMap);

    setFilterNames(array);

    if (onChangeFilterNames) {
      onChangeFilterNames(array);
    }
  };

  // binding data list for name filter
  const filterDataTable = () => {
    return filterNameItem && filterNameItem !== FILTER_NAME_DEFAULT
      ? giftCardReportList.filter((item) => item.type === filterNameItem)
      : giftCardReportList;
  };

  // callback
  const onChangeFilterName = (filterName) => {
    setFilterNameItem(filterName);
    if (onChangeFilterId) {
      onChangeFilterId(filterName);
    }
  };

  const goStatistics = async (item) => {
    if (!item) return;
    // change to statistic tab

    await onGoStatistics(item);
  };

  /**effect */
  useEffect(() => {
    bindChartData();
    bindFilterName();
  }, [giftCardReportList]);

  /**render */
  //callback render action cell
  const renderActionCell = ({ key, row, column, item }) => {
    return (
      <View style={styles.cellAction}>
        <TouchableOpacity onPress={() => goStatistics(item)}>
          <View style={styles.btnInCell}>
            <Image style={styles.imgDetail} source={IMAGE.Report_Detail} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCell = ({ key, row, column, item }) => {
    return null;
  };

  return (
    <View style={style}>
      <ReportTabLayout
        style={styles.container}
        title={localize("Gift Card Sales", language)}
        onChangeFilterName={onChangeFilterName}
        isShowExportButton={viewMode === VIEW_MODE.LIST}
        isShowFilterButton={viewMode === VIEW_MODE.LIST}
        filterNames={filterNames}
        filterNameItem={filterNameItem}
        showCalendar={showCalendar}
        titleRangeTime={titleRangeTime}
        showExportFile={showExportFile}
        pathFileExport={pathFileExport}
        handleTheDownloadedFile={handleTheDownloadedFile}
        filterNameDefault={FILTER_NAME_DEFAULT}
        rightTooltip={
          <>
            <PopupButton
              imageSrc={IMAGE.Report_Chart}
              style={{ marginLeft: 20 }}
              imageStyle={{
                tintColor:
                  viewMode === VIEW_MODE.CHART ? ACTIVE_COLOR : INACTIVE_COLOR,
              }}
              onPress={viewModeChart}
            />

            <PopupButton
              imageSrc={IMAGE.Report_Grid}
              style={{ marginLeft: 10 }}
              imageStyle={{
                tintColor:
                  viewMode === VIEW_MODE.LIST ? ACTIVE_COLOR : INACTIVE_COLOR,
              }}
              onPress={viewModeList}
            />
          </>
        }
      >
        {viewMode === VIEW_MODE.LIST ? (
          <TableList
            tableData={filterDataTable()}
            tableHead={{
              type: localize("Type", language),
              quantity: localize("Qty Sold", language),
              sales: localize("Net Sales", language),
            }}
            whiteKeys={["type", "quantity", "sales", "action"]}
            primaryId="type"
            sumTotalKey="type"
            calcSumKeys={["quantity", "sales"]}
            priceKeys={["sales"]}
            sortKey="type"
            tableCellWidth={{
              type: 300,
              quantity: 200,
              sales: 200,
            }}
            renderCell={renderCell}
            renderActionCell={renderActionCell}
          />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              margin: 20,
            }}
          >
            <GiftCardBarGroupChart
              data={chartData}
              titleRangeTime={titleRangeTime}
              urlRangeTime={urlRangeTime}
            />
          </View>
        )}
      </ReportTabLayout>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cellAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    flex: 1,
  },
  txtSalary: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#6A6A6A",
    marginRight: 5,
  },
  imgDetail: {
    tintColor: "#6A6A6A",
    width: 20,
    height: 20,
  },
  btnInCell: {
    height: "100%",
    width: 35,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  chartDetail: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  chartDetailItem: {
    flexDirection: "row",
    margin: 10,
    paddingLeft: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
