import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

import { PopupButton, TableList, ReportTabLayout } from "../../../widget";
import MarketingBarGroupChart from "./chart/MarketingBarGroupChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};
const FILTER_NAME_DEFAULT = "All Promotion";
const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

export default function MarketingEfficiency({
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
  onSortWithKey
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);
  const marketingEfficiencyList = useSelector(
    (state) => state.report.marketingEfficiencyList
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
    if (!marketingEfficiencyList) return [];
    await setChartData(marketingEfficiencyList);
  };

  // create filter name data
  const bindFilterName = () => {
    if (!marketingEfficiencyList) return [];

    let array = [];

    const arrMap = marketingEfficiencyList.map((item) => ({
      value: item.name,
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
    return filterNameItem !== FILTER_NAME_DEFAULT
      ? marketingEfficiencyList.filter((item) => item.name === filterNameItem)
      : marketingEfficiencyList;
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
  }, [marketingEfficiencyList]);

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
              name: localize("Campaign Name", language),
              revenue: localize("Revenue", language),
              discount: localize("Discount", language),
            }}
            whiteKeys={["name", "revenue", "discount", "action"]}
            primaryId="promotionId"
            sumTotalKey="name"
            calcSumKeys={["revenue", "discount"]}
            priceKeys={["revenue", "discount"]}
            tableCellWidth={{
              name: 300,
              revenue: 200,
              discount: 200,
            }}
            renderCell={renderCell}
            renderActionCell={renderActionCell}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            sortKey='revenue'
            onSortWithKey={onSortWithKey}
          />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              margin: 20,
            }}
          >
            <MarketingBarGroupChart data={chartData} />
            <View style={{ flex: 1, paddingVertical: 20 }}>
              <View
                style={{
                  height: 60,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "row",
                }}
              >
                <LegendChart color="#80C6FF" label="Revenue" />
                <LegendChart color="#E5B960" label="Discount" />
              </View>
              <View style={styles.chartDetail}>
                {marketingEfficiencyList &&
                  marketingEfficiencyList.map((item) => (
                    <DetailChart
                      key={item.promotionId}
                      label={item.promotionId}
                      desc={item.name}
                    />
                  ))}
              </View>
            </View>
          </View>
        )}
      </ReportTabLayout>
    </View>
  );
}

const DetailChart = ({ label = "1", desc = "..." }) => (
  <View style={styles.chartDetailItem}>
    <View
      style={{
        padding: 5,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderRadius: 15,
        backgroundColor: "transparent",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: "#0764B0",
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
    </View>
    <Text style={{ fontSize: 15, flex: 1, color: "#404040" }}>{desc}</Text>
  </View>
);

const LegendChart = ({ color, label }) => (
  <View style={styles.chartDetailItem}>
    <View
      style={{
        width: 30,
        height: 30,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
    <Text
      style={{
        fontSize: 15,
        color: "#404040",
      }}
    >
      {label}
    </Text>
  </View>
);

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
