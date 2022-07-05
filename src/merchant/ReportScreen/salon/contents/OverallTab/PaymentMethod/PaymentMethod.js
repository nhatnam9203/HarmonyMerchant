import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

import { PopupButton, TableList, ReportTabLayout } from "../../../../widget";
import PaymentBarChart from "./chart/PaymentBarChart";
import PaymentPieChart from "./chart/PaymentPieChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};
const FILTER_NAME_DEFAULT = "All Method";
const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

export default function PaymentMethod({
  style,
  onGoStatistics,
  titleRangeTime,
  showCalendar,
  onChangeFilterNames,
  onChangeFilterId,
  showExportFile,
  pathFileExport,
  handleTheDownloadedFile,
  onRefresh,
  isRefreshing,
  resetTab,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const overallPaymentMethodList = useSelector(
    (state) => state.report.overallPaymentMethodList
  );

  /**state */
  const [viewMode, setViewMode] = useState(VIEW_MODE.LIST);
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);
  const [chartData, setChartData] = useState([]);

  /**function */
  const changeViewMode = (mode) => {
    if (!mode) return;
    setViewMode(mode);
  };

  const viewModeList = () => changeViewMode(VIEW_MODE.LIST);
  const viewModeChart = () => changeViewMode(VIEW_MODE.CHART);

  const bindChartData = async () => {
    await setChartData(overallPaymentMethodList || []);
  };

  // create filter name data
  const bindFilterName = () => {
    let array = [];

    const arrMap = overallPaymentMethodList?.map((item) => ({
      value: item.displayMethod,
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
      ? overallPaymentMethodList.filter(
          (item) => item.displayMethod === filterNameItem
        )
      : overallPaymentMethodList;
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
  }, [overallPaymentMethodList]);

  React.useEffect(() => {
    if (resetTab) {
      if (onChangeFilterId) {
        onChangeFilterId(filterNameItem);
      }
    }
  }, [resetTab]);

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
              displayMethod: localize("Payment", language),
              transactions: localize("Transactions", language),
              grossPayment: localize("Gross Payments", language),
              refund: localize("Refunds", language),
              return: localize("Return", language),
              netPayment: localize("Net Payments", language),
            }}
            whiteKeys={[
              "displayMethod",
              "transactions",
              "grossPayment",
              "refund",
              "return",
              "netPayment",
              "action",
            ]}
            primaryId="method"
            sumTotalKey="displayMethod"
            calcSumKeys={[
              "transactions",
              "grossPayment",
              "refund",
              "return",
              "netPayment",
            ]}
            priceKeys={["grossPayment", "refund", "return", "netPayment"]}
            tableCellWidth={{
              displayMethod: 180,
              transactions: 150,
              grossPayment: 160,
              refund: 160,
              return: 160,
              netPayment: 160,
            }}
            renderCell={renderCell}
            renderActionCell={renderActionCell}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
          />
        ) : (
          <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
            <PaymentBarChart data={chartData} />
            <PaymentPieChart data={chartData} />
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
