import { useFocusEffect } from "@react-navigation/native";
import IMAGE from "@resources";
import {
  ButtonCalendarFilter,
  ExportModal,
  TableListExtended,
} from "@shared/components";
import {
  useExportRetailerSaleOverall,
  useReportSaleOverall,
} from "@shared/services/api/retailer";
import { layouts } from "@shared/themes";
import {
  dateToString,
  DATE_SHOW_FORMAT_STRING,
  getTimeTitleFile,
  statusSuccess,
} from "@shared/utils";
import { getQuickFilterTimeRange } from "@utils";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { PopupButton } from "../../../../widget";
import SalesLineChart from "./chart/SalesLineChart";

const VIEW_MODE = {
  LIST: "LIST",
  CHART: "CHART",
};

const ACTIVE_COLOR = "#0764B0";
const INACTIVE_COLOR = "#6A6A6A";

export const SalesOverall = () => {
  const { t } = useTranslation();
  const exportRef = React.useRef(null);

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

  const callExportSalesOverall = (values) => {
    const params = Object.assign({}, values, {
      ...timeVal,
    });

    exportRef.current?.onSetFileName(getTimeTitleFile("SaleOverall", params));

    exportRetailerSaleOverall(params);
  };

  const [saleOverallExport, exportRetailerSaleOverall] =
    useExportRetailerSaleOverall();

  /**
  |--------------------------------------------------
  | useEffect
  |--------------------------------------------------
  */

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
    const { codeStatus, message, data, summary } = saleOverallExport || {};
    if (statusSuccess(codeStatus)) {
      exportRef.current?.onCreateFile(data);
    }
  }, [saleOverallExport]);

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

  const _renderCell = () => {
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
            renderCell={_renderCell}
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

      <View style={styles.rowContent}>
        <ButtonCalendarFilter
          onChangeTimeValue={onChangeTimeValue}
          defaultValue={"This Week"}
          paddingLeft={scaleWidth(15)}
          paddingTop={scaleHeight(120)}
        />
        <View style={layouts.fill} />
        <View style={[layouts.horizontal, { alignItems: "flex-end" }]}>
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
          <View style={{ width: scaleWidth(10) }} />
          <ExportModal ref={exportRef} onExportFile={callExportSalesOverall} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
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
