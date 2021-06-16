import {
  ButtonCalendarFilter,
  FormTitle,
  ExportModal,
} from "@shared/components";
import { useReportSaleCategory } from "@shared/services/api/retailer";
import { getQuickFilterTimeRange } from "@utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useDispatch } from "react-redux";
import { Table } from "@shared/components/CustomTable";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from "@shared/utils";
import { layouts } from "@shared/themes";
import { DropdownMenu } from "@shared/components";
import NavigationServices from "@navigators/NavigatorServices";

const filterItems = [
  { label: "Top categories", value: "all" },
  { label: "All categories", value: "top" },
];

export default function SalesByCategory({}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [timeVal, setTimeVal] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [filterCategory, setFilterCategory] = React.useState({});

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSaleCategory, getReportSaleCategory] = useReportSaleCategory();
  const callGetReportSaleCategory = React.useCallback(() => {
    console.log(timeVal);
    getReportSaleCategory({
      ...timeVal,
      sort: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

  React.useEffect(() => {
    callGetReportSaleCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  // React.useEffect(() => {
  //   if (resetTab) {
  //     if (onChangeFilterId) {
  //       onChangeFilterId(filterNameItem);
  //     }
  //   }
  // }, [resetTab]);

  // create filter name data
  // const bindFilterName = () => {
  //   if (!productSaleByCategoryList) return [];

  //   let array = [];

  //   const arrMap = productSaleByCategoryList.map((item) => ({
  //     value: item.categoryName,
  //     ...item,
  //   }));
  //   array.push(...arrMap);

  //   setFilterNames(array);

  //   if (onChangeFilterNames) {
  //     onChangeFilterNames(array);
  //   }
  // };

  // binding data list for name filter
  // const filterDataTable = () => {
  //   return filterNameItem &&
  //     !defaultFilterList?.find((x) => x.value === filterNameItem)
  //     ? productSaleByCategoryList.filter(
  //         (item) => item.categoryName === filterNameItem
  //       )
  //     : productSaleByCategoryList;
  // };

  // callback
  // const onChangeFilterName = (filterName) => {
  //   setFilterNameItem(filterName);
  //   if (onChangeFilterId) {
  //     onChangeFilterId(filterName);
  //   }
  // };

  // const goStatistics = async (item) => {
  //   if (!item) return;
  //   // change to statistic tab

  //   await onGoStatistics(item);
  // };

  /**effect */
  useEffect(() => {
    const { codeStatus, message, data, summary } = reportSaleCategory || {};
    if (statusSuccess(codeStatus)) {
      setData(data);
    }
  }, [reportSaleCategory]);

  const onChangeTimeValue = (quickFilter, timeState) => {
    if (quickFilter === "Customize Date") {
      setTimeVal({
        quickFilter: "custom",
        timeStart: timeState.startDate,
        timeEnd: timeState.endDate,
      });
    } else {
      setTimeVal({ quickFilter: getQuickFilterTimeRange(quickFilter) });
    }
  };

  const onSelectRow = ({ item }) => {
    NavigationServices.navigate("ReportSaleCategory_Detail", {
      detailName: item?.name,
      details: item.details,
      timeVal,
      setTimeVal,
    });
  };

  const onRenderCell = ({ columnKey, rowIndex, columnIndex, item }) => {
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <View style={layouts.horizontal}>
          <ButtonCalendarFilter
            onChangeTimeValue={onChangeTimeValue}
            paddingLeft={scaleWidth(105)}
            paddingTop={scaleHeight(170)}
          />
          <View style={layouts.marginHorizontal} />
          <DropdownMenu
            items={filterItems}
            onChangeValue={setFilterCategory}
            defaultIndex={0}
            width={scaleWidth(208)}
            height={scaleHeight(40)}
            placeholder={t("Select Category")}
          />
        </View>
      </View>
      <View style={styles.rowContent}>
        <Text style={layouts.title}>{t("Top Performing Categories")}</Text>
        <ExportModal />
      </View>
      <View style={styles.content}>
        <Table
          items={data}
          headerKeyLabels={{
            name: t("Category name"),
            quantity: t("Qty sold"),
            totalRevenue: t("Total revenue"),
            totalCost: t("Total cost"),
            totalTax: t("Total tax"),
            totalProfit: t("Total profit"),
          }}
          whiteListKeys={[
            "name",
            "quantity",
            "totalRevenue",
            "totalCost",
            "totalTax",
            "totalProfit",
          ]}
          //   sortedKeys={{ customerName: sortName, phone: sortPhoneNumber }}
          primaryKey="name"
          //   unitKeys={{ totalDuration: "hrs" }}
          widthForKeys={{
            name: scaleWidth(250),
            quantity: scaleWidth(120),
            totalRevenue: scaleWidth(180),
            totalCost: scaleWidth(180),
            totalTax: scaleWidth(180),
          }}
          emptyDescription={t("No Report Data")}
          //   styleTextKeys={{ customerName: styles.textName }}
          //   onSortWithKey={onSortWithKey}
          formatFunctionKeys={
            {
              // date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            }
          }
          renderCell={onRenderCell}
          onRowPress={onSelectRow}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    marginTop: scaleHeight(20),
  },

  rowContent: {
    marginTop: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },

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
