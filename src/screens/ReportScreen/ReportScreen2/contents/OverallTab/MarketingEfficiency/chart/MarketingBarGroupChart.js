import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View } from "react-native";
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

const dataConfig = {
  dataSets: [
    {
      values: [5, 40, 77, 81, 43],
      label: "Company A",
      config: {
        drawValues: false,
        colors: [processColor("red")],
      },
    },
    {
      values: [40, 5, 50, 23, 79],
      label: "Company B",
      config: {
        drawValues: false,
        colors: [processColor("blue")],
      },
    },
    {
      values: [10, 55, 35, 90, 82],
      label: "Company C",
      config: {
        drawValues: false,
        colors: [processColor("green")],
      },
    },
  ],
  config: {
    barWidth: 0.4,
    group: {
      fromX: 0,
      groupSpace: 0.1,
      barSpace: 0.1,
    },
  },
};
const xAxisDefault = {
  valueFormatter: ["1990", "1991", "1992", "1993", "1994"],
  granularityEnabled: true,
  granularity: 1,
  axisMaximum: 5,
  axisMinimum: 0,
  centerAxisLabels: true,
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
    granularity: 100,
    labelCount: 10,
  },
  right: {
    drawLabels: true,
    drawAxisLine: true,
    drawGridLines: true,
    axisMinimum: 0,
    // axisMaximum: 1500,
    textSize: 14,
    formSize: 14,
    textColor: processColor("#E5B960"),
    granularity: 100,
    labelCount: 10,
  },
};

const pickValuesForKey = (array, forKey, format) => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === forKey);
    const [key, value] = item[0];
    if (format === "float") return formatNumberFromCurrency(value);
    return value + "";
  });
};

export default function MarketingBarGroupChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = useState(dataConfig);
  const [xAxis, setXAxis] = useState(xAxisDefault);

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      let mapValues = [];
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
              drawValues: false,
              valueTextSize: 14,
              valueTextColor: processColor("#0764B0"),
            },
          },
          {
            values: discountValues,
            label: "discount",
            config: {
              colors: [processColor("#E5B960")],
              drawValues: false,
              valueTextSize: 14,
              valueTextColor: processColor("#0764B0"),
            },
          },
        ],
        config: {
          // BarData
          barWidth: 0.4,
          group: {
            fromX: 0,
            groupSpace: 0.1,
            barSpace: 0.1,
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
      };

      setXAxis(createXAxis);
    } else {
      setDataChart(dataConfig);
      setXAxis(xAxisDefault);
    }

    // ======= map formatter =======
  }, [data]);

  function handleSelect(event) {
    let entry = event.nativeEvent;
    if (entry == null) {
      //   this.setState({ ...this.state, selectedEntry: null });
    } else {
      //   this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) });
    }

    console.log(event.nativeEvent);
  }

  return (
    <View style={styles.container}>
      <BarChart
        doubleTapToZoomEnabled={false}
        style={styles.chart}
        data={dataChart}
        xAxis={xAxis}
        yAxis={yAxis}
        animation={{ durationX: 500 }}
        legend={legend}
        gridBackgroundColor={processColor("transparent")}
        // visibleRange={{ x: { min: 5, max: 5 } }}
        drawBarShadow={false}
        drawHighlightArrow={true}
        onSelect={handleSelect}
        // highlights={highlights}
        entryLabelTextSize={14}
        onChange={(event) => console.log(event.nativeEvent)}
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
});
