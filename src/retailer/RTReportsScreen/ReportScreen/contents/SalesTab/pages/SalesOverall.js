import React from "react";
import { View, StyleSheet } from "react-native";
import { ButtonOverall } from "../../../widget";
import {
  ButtonGradient,
  ButtonGradientWhite,
  ExportModal,
  ButtonCalendarFilter,
  ButtonRightPanelFilter,
  FormSelect,
} from "@shared/components";
import { useReportSaleOverall } from "@shared/services/api/retailer";
import {
  BIRTH_DAY_DATE_FORMAT_STRING,
  statusSuccess,
  dateToString,
} from "@shared/utils";
import { getQuickFilterTimeRange, formatMoneyWithUnit } from "@utils";
import { useTranslation } from "react-i18next";
import SalesLineChart from "./chart/SalesLineChart";

const log = (obj, message = "") => {
  Logger.log(`[SalesOverall] ${message}`, obj);
};

export const SalesOverall = () => {
  const { t } = useTranslation();

  const [timeVal, setTimeVal] = React.useState();
  const [data, setData] = React.useState();
  const [summary, setSummary] = React.useState();

  /**
  |--------------------------------------------------
  | CALL API
  |--------------------------------------------------
  */
  const [reportSalesOverall, getReportSalesOverall] = useReportSaleOverall();
  const callGetReportSalesOverall = React.useCallback(() => {
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

  React.useEffect(() => {
    callGetReportSalesOverall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeVal]);

  React.useEffect(() => {
    const { codeStatus, message, data, summary } = reportSalesOverall || {};
    if (statusSuccess(codeStatus)) {
      log(data, "response data");
      setData(data);
      setSummary(summary);
    }
  }, [reportSalesOverall]);

  const onChangeTimeValue = (quickFilter, timeState) => {
    if (timeState === "Customize Date") {
      setTimeVal({
        quickFilter: "custom",
        timeStart: timeState.startDate,
        timeEnd: timeState.endDate,
      });
    } else {
      setTimeVal({ quickFilter: getQuickFilterTimeRange(quickFilter) });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <ButtonCalendarFilter onChangeTimeValue={onChangeTimeValue} />
      </View>
      <View style={styles.rowContent}>
        <ButtonOverall
          label={t("total orders").toUpperCase()}
          amount={summary?.totalOrder}
        />
        <ButtonOverall
          label={t("total revenue").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.revenue)}
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
          label={t("total profit").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.profit)}
        />
        <ButtonOverall
          label={t("average order").toUpperCase()}
          amount={formatMoneyWithUnit(summary?.averageOrder)}
        />
      </View>
      <View style={styles.content}>
        <SalesLineChart data={data} />
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
