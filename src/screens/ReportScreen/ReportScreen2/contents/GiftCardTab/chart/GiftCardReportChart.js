import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import _ from "ramda";

import { formatNumberFromCurrency } from "@utils";

/**chart info */
const legend = {
  enabled: true,
  textSize: 14,
  form: "SQUARE",
  formSize: 22,
  direction: "LEFT_TO_RIGHT",
  horizontalAlignment: "CENTER",
  verticalAlignment: "BOTTOM",
  orientation: "HORIZONTAL",
  yEntrySpace: 5,
  xEntrySpace: 25,
  wordWrapEnabled: true,
};

const yAxis = {
  left: {
    label: "Amount$",
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
    drawLabels: false,
    drawAxisLine: false,
    drawGridLines: false,
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

export default function GiftCardBarGroupChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = useState({});
  const [xAxis, setXAxis] = useState({});

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      const colors = [
        processColor("#FF7F00"),
        processColor("#CAB2D6"),
        processColor("#1F78B4"),
        processColor("#80C6FF"),
        processColor("#E5B960"),
      ];

      let dataSets = [];
      let formatValueSet = new Set();
      data.forEach((item, index) => {
        const giftCardStatistics = item.giftCardStatistics || [];
        const label = item.type || `${index}`;
        pickValuesForKey(
          giftCardStatistics,
          "dateString",
          "string"
        ).forEach((x) => formatValueSet.add(x));

        const dataSetValue = {
          values: pickValuesForKey(giftCardStatistics, "sales", "float"),
          label: label,
          config: {
            colors: [colors[index] || processColor("#80C6FF")],
            drawValues: true,
            valueTextSize: 14,
            valueTextColor: processColor("#0764B0"),
          },
        };

        dataSets.push(dataSetValue);
      });

      const createDataSet = {
        dataSets: dataSets,
        config: {
          // BarData
          barWidth: 0.5,
          group: {
            fromX: 0,
            groupSpace: 0.1,
            barSpace: 0.1,
          },
        },
      };

      setDataChart(createDataSet);

      const createXAxis = {
        valueFormatter: Array.from(formatValueSet),
        centerAxisLabels: true,
        position: "BOTTOM",
        granularityEnabled: true,
        granularity: 1,
        textSize: 14,
        formSize: 14,
        textColor: processColor("#0764B0"),
        drawAxisLine: true,
        drawGridLines: false,
        drawLabels: true,
        label: "Date",
        axisMinimum: 0,
        axisMaximum: 10,
      };

      setXAxis(createXAxis);
    } else {
      setDataChart({});
      setXAxis({});
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
  }

  return (
    <View style={styles.container}>
      {!_.isEmpty(xAxis) && !_.isEmpty(dataChart) && (
        <BarChart
          doubleTapToZoomEnabled={false}
          dragEnabled={true}
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
          // onChange={(event) => console.log(event.nativeEvent)}
        />
      )}
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
    paddingHorizontal: 20,
  },
});
