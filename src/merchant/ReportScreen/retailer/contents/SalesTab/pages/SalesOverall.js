import { useFocusEffect } from "@react-navigation/native";
import { ButtonCalendarFilter, TableListExtended } from "@shared/components";
import { useReportSaleOverall } from "@shared/services/api/retailer";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  statusSuccess,
} from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { PopupButton } from "../../../../widget";
import SalesLineChart from "./chart/SalesLineChart";
import IMAGE from "@resources";
import { layouts } from "@shared/themes";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

export const SalesOverall = () => {
  const { t } = useTranslation();

  const [timeVal, setTimeVal] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [summary, setSummary] = React.useState(0);
  const [viewMode, setViewMode] = React.useState(VIEW_MODE.LIST);
  const tokenReportServer = useSelector(
    (state) => state.dataLocal.tokenReportServer
  );
  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSalesOverall, getReportSalesOverall] = useReportSaleOverall();
  const callGetReportSalesOverall = React.useCallback(() => {
    if (!tokenReportServer) return;
    getReportSalesOverall({
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

  //   React.useEffect(() => {
  //     callGetReportSalesOverall();
  //   }, []);

  // React.useEffect(() => {
  //   callGetReportSalesOverall();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [timeVal]);

  useFocusEffect(
    React.useCallback(() => {
      callGetReportSalesOverall();
    }, [timeVal])
  );

  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSalesOverall || {};
    if (statusSuccess(codeStatus)) {
      setData(data ?? []);
      setSummary(summary);
    }
  }, [reportSalesOverall]);

  React.useEffect(() => {
    if (tokenReportServer) {
      getReportSalesOverall({
        ...timeVal,
        sort: {},
      });
    }
  }, [tokenReportServer]);

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

  const renderCell = () => {
    return null;
  };

  const onRefresh = () => {
    callGetReportSalesOverall();
  };

  const viewModeChart = () => {
    setViewMode(VIEW_MODE.CHART);
  };

  const viewModeList = () => {
    setViewMode(VIEW_MODE.LIST);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <ButtonCalendarFilter
          onChangeTimeValue={onChangeTimeValue}
          defaultValue={"This Week"}
          paddingLeft={scaleWidth(15)}
          paddingTop={scaleHeight(120)}
        />
        <View style={layouts.fill} />
        <View style={layouts.horizontal}>
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
        </View>
      </View>

      {/* <View style={styles.rowContent}>
        <ButtonOverall
          label={t("total orders").toUpperCase()}
          amount={summary?.totalOrder}
        />
        <ButtonOverall
          label={t("total gross sales").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.grossSales)}
        />
        <ButtonOverall
          label={t("total cost").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.cost)}
        />
        <ButtonOverall
          label={t("total tax").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.tax)}
        />
        <ButtonOverall
          label={t("total end day").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.totalEndDay)}
        />
        <ButtonOverall
          label={t("average order").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.averageOrder)}
        />
      </View> */}
      <View style={styles.content}>
        {viewMode === VIEW_MODE.LIST ? (
          <TableListExtended
            tableData={data}
            tableHead={{
              date: t("Date"),
              costOfProduct: t("Cost of product"),
              grossSales: t("Gross Sales"),
              returns: t("Returns"),
              discount: t("Discounts & Comps"),
              netSales: t("Net Sales"),
              giftCardSales: t("Gift Card"),
              tax: t("Tax"),
              tip: t("Tip"),
              totalEndDay: t("Total End Day"),
              profit: t("Profit"),
            }}
            whiteKeys={[
              "date",
              "costOfProduct",
              "grossSales",
              "returns",
              "discount",
              "netSales",
              "giftCardSales",
              "tax",
              "tip",
              "totalEndDay",
              "profit",
            ]}
            primaryId="date"
            // sumTotalKey="date"
            // calcSumKeys={[]}
            priceKeys={[
              "costOfProduct",
              "grossSales",
              "returns",
              "discount",
              "netSales",
              "giftCardSales",
              "tax",
              "tip",
              "totalEndDay",
              "profit",
            ]}
            unitKeys={{ date: "hrs" }}
            sortDefault="NONE"
            sortKey="name"
            tableCellWidth={{
              date: scaleWidth(150),
              costOfProduct: scaleWidth(150),
              grossSales: scaleWidth(150),
              returns: scaleWidth(150),
              discount: scaleWidth(150),
              netSales: scaleWidth(150),
              giftCardSales: scaleWidth(150),
              tax: scaleWidth(150),
              tip: scaleWidth(150),
              totalEndDay: scaleWidth(150),
              profit: scaleWidth(150),
            }}
            renderCell={renderCell}
            formatFunctionKeys={{
              date: (value) => dateToString(value, DATE_SHOW_FORMAT_STRING),
            }}
            //   totalRevenue: (value) => `${formatMoneyWithUnit(value)}`,
            //   totalCost: (value) => `${formatMoneyWithUnit(value)}`,
            //   totalTax: (value) => `${formatMoneyWithUnit(value)}`,
            //   totalProfit: (value) => `${formatMoneyWithUnit(value)}`,
            // }}
            // renderActionCell={renderActionCell}
            // onRowPress={onRowPress}
            onRefresh={onRefresh}
            // isRefreshing={isRefreshing}
            // onLoadMore={onLoadMore}
            // endLoadMore={endLoadMore}
          />
        ) : (
          <SalesLineChart data={data} />
        )}
      </View>
    </View>
  );
};

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
});
