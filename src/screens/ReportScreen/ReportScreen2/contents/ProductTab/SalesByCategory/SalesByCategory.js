import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import IMAGE from "@resources";
import { localize } from "@utils";

import { TableList, ReportTabLayout } from "../../../widget";

export default function SalesByCategory({
  style,
  onGoStatistics,
  titleRangeTime,
  showCalendar,
  onChangeFilterNames,
  onChangeFilterId,
  showExportFile,
  pathFileExport,
  handleTheDownloadedFile,
  defaultFilterList,
  defaultFilterName,
  onRefresh,
  isRefreshing,
}) {
  /**redux store*/
  const dispatch = useDispatch();
  const language = useSelector((state) => state.dataLocal.language);

  const productSaleByCategoryList = useSelector(
    (state) => state.report.productSaleByCategoryList
  );

  /**state */
  const [filterNameItem, setFilterNameItem] = useState(defaultFilterName);
  const [filterNames, setFilterNames] = useState([]);

  /**function */

  // create filter name data
  const bindFilterName = () => {
    if (!productSaleByCategoryList) return [];

    let array = [];

    const arrMap = productSaleByCategoryList.map((item) => ({
      value: item.categoryName,
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
    return filterNameItem &&
      !defaultFilterList?.find((x) => x.value === filterNameItem)
      ? productSaleByCategoryList.filter(
          (item) => item.categoryName === filterNameItem
        )
      : productSaleByCategoryList;
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
  }, [productSaleByCategoryList]);

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
        isShowExportButton={true}
        isShowFilterButton={true}
        filterNames={filterNames}
        filterNameItem={filterNameItem}
        showCalendar={showCalendar}
        titleRangeTime={titleRangeTime}
        showExportFile={showExportFile}
        pathFileExport={pathFileExport}
        handleTheDownloadedFile={handleTheDownloadedFile}
        filterNameDefaultList={defaultFilterList}
        rightTooltip={<></>}
      >
        <TableList
          tableData={filterDataTable()}
          tableHead={{
            categoryName: localize("Category", language),
            quantity: localize("Qty Sold", language),
            avgPrice: localize("Av. Price", language),
            totalSales: localize("Total Sales", language),
          }}
          whiteKeys={[
            "categoryName",
            "quantity",
            "avgPrice",
            "totalSales",
            "action",
          ]}
          primaryId="categoryId"
          sumTotalKey="categoryName"
          calcSumKeys={["quantity", "totalSales"]}
          calcAvgKeys={["avgPrice"]}
          priceKeys={["avgPrice", "totalSales"]}
          tableCellWidth={{
            categoryName: 180,
            totalSales: 200,
          }}
          sortKey="categoryName"
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
