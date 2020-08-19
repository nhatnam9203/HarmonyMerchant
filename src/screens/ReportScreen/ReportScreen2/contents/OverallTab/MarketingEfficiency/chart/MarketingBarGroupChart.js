import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View, Text } from "react-native";
import { BarChart } from "react-native-charts-wrapper";

import { formatNumberFromCurrency } from "@utils";

/**chart info */
const legend = {
  enabled: false,
  textSize: 14,
  form: "SQUARE",
  formSize: 22,
  direction: "LEFT_TO_RIGHT",
  horizontalAlignment: "RIGHT",
  verticalAlignment: "TOP",
  orientation: "HORIZONTAL",
  yEntrySpace: 5,
  xEntrySpace: 20,
  wordWrapEnabled: true,
};

const yAxis = {
  left: {
    drawLabels: true,
    drawAxisLine: true,
    drawGridLines: true,
    axisMinimum: 0,
    // axisMaximum: 1500,
    textSize: 14,
    formSize: 14,
    textColor: processColor("#0764B0"),
    granularity: 10,
    labelCount: 10,
    valueFormatter: "#.# '$'",
  },
  right: {
    drawLabels: true,
    drawAxisLine: true,
    drawGridLines: false,
    axisMinimum: 0,
    // axisMaximum: 1500,
    textSize: 14,
    formSize: 14,
    textColor: processColor("#E5B960"),
    granularity: 10,
    labelCount: 10,
    valueFormatter: "#.# '$'",
  },
};

const pickValuesForKey = (array, forKey, format, unit = "") => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === forKey);
    const [key, value] = item[0];
    if (format === "float") {
      const ft = formatNumberFromCurrency(value);
      return parseFloat(ft.toFixed(2));
    }
    return value + unit;
  });
};

export default function MarketingBarGroupChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = useState({});
  const [xAxis, setXAxis] = useState({});

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      const formatterValues = pickValuesForKey(data, "promotionId", "string");
      const revenueValues = pickValuesForKey(data, "revenue", "float");
      const discountValues = pickValuesForKey(data, "discount", "float");

      const createDataSet = {
        dataSets: [
          {
            values: revenueValues,
            label: "revenue",
            config: {
              colors: [processColor("#80C6FF")],
              drawValues: true,
              valueTextSize: 12,
              valueTextColor: processColor("#404040"),
              valueFormatter: "0.00",
            },
          },
          {
            values: discountValues,
            label: "discount",
            config: {
              colors: [processColor("#E5B960")],
              drawValues: true,
              valueTextSize: 12,
              valueTextColor: processColor("#404040"),
              valueFormatter: "0.00",
            },
          },
        ],
        config: {
          // BarData
          barWidth: 0.4,
          group: {
            fromX: 0,
            groupSpace: 0.2,
            barSpace: 0,
          },
        },
      };

      setDataChart(createDataSet);

      const createXAxis = {
        valueFormatter: formatterValues,
        granularityEnabled: true,
        granularity: 1,
        centerAxisLabels: true,
        position: "BOTTOM",
        textSize: 20,
        formSize: 14,
        textColor: processColor("#0764B0"),
        fontWeight: "bold",
        drawAxisLine: true,
        drawGridLines: false,
        axisMaximum: 5,
        axisMinimum: 0,
      };

      setXAxis(createXAxis);
    } else {
      setDataChart(dataConfig);
      setXAxis(xAxisDefault);
    }

    // ======= map formatter =======
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.amountContent}>
        <Text style={styles.txtAmount}>Amount ($)</Text>
      </View>

      <BarChart
        doubleTapToZoomEnabled={false}
        touchEnabled={false}
        style={styles.chart}
        data={dataChart}
        xAxis={xAxis}
        yAxis={yAxis}
        animation={{ durationX: 500 }}
        legend={legend}
        gridBackgroundColor={processColor("transparent")}
        entryLabelTextSize={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    margin: 20,
  },
  chart: {
    flex: 1,
  },
  amountContent: {
    position: "absolute",
    top: -20,
    left: 0,
  },
  txtAmount: {
    color: "#205580",
    fontSize: 15,
  },
});
