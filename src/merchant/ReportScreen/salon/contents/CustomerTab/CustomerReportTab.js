import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

import { TableList, ReportTabLayout } from "../../../widget";

const FILTER_NAME_DEFAULT = "Select All";

export default function CustomerReportTab({
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
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const customerReportList = useSelector(
    (state) => state.report.customerReportList
  );

  /**state */
  const [filterNameItem, setFilterNameItem] = useState(FILTER_NAME_DEFAULT);
  const [filterNames, setFilterNames] = useState([]);

  /**function */

  // create filter name data
  const bindFilterName = () => {
    if (!customerReportList) return [];

    let array = [];

    const arrMap = customerReportList.map((item) => ({
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
    return filterNameItem && filterNameItem !== FILTER_NAME_DEFAULT
      ? customerReportList.filter((item) => item.name === filterNameItem)
      : customerReportList;
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
    bindFilterName();
  }, [customerReportList]);

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
        title={localize("Customer Report", language)}
        onChangeFilterName={onChangeFilterName}
        isShowExportButton={true}
        isShowFilterButton={false}
        filterNames={filterNames}
        filterNameItem={filterNameItem}
        showCalendar={showCalendar}
        titleRangeTime={titleRangeTime}
        showExportFile={showExportFile}
        pathFileExport={pathFileExport}
        handleTheDownloadedFile={handleTheDownloadedFile}
        filterNameDefault={FILTER_NAME_DEFAULT}
      >
        <TableList
          tableData={filterDataTable()}
          tableHead={{
            name: localize("Name", language),
            appointmentCount: localize("Appointments", language),
            lastVisitDateString: localize("Last Visit", language),
            lastVisitSale: localize("Last Visit Sales", language),
            total: localize("Total Sales", language),
          }}
          whiteKeys={[
            "name",
            "appointmentCount",
            "lastVisitDateString",
            "lastVisitSale",
            "total",
            "action",
          ]}
          primaryId="customerId"
          sumTotalKey="name"
          calcSumKeys={["appointmentCount", "lastVisitSale", "total"]}
          priceKeys={["lastVisitSale", "total"]}
          sortKey="name"
          tableCellWidth={{
            name: 160,
            lastVisitSale: 200,
          }}
          renderCell={renderCell}
          renderActionCell={renderActionCell}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
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
