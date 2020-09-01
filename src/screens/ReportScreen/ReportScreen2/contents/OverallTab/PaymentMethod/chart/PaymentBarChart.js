import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View, Text } from "react-native";
import { BarChart } from "react-native-charts-wrapper";

import { formatNumberFromCurrency } from "@utils";

/**chart info */
const legend = {
  enabled: false,
  textSize: 14,
  form: "SQUARE",
  formSize: 14,
  xEntrySpace: 10,
  yEntrySpace: 5,
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
    valueFormatter: "###,###,###.##",
  },
  right: {
    drawLabels: false,
    drawAxisLine: false,
    drawGridLines: false,
  },
};

const pickValuesForKey = (array, forKey, format) => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === forKey);
    if (item && item.length > 0) {
      const [key, value] = item[0];
      if (format === "float" && value) return formatNumberFromCurrency(value);
      return value + "";
    }
    return format === "float" ? 0 : "";
  });
};

export default function PaymentBarChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = useState({});
  const [xAxis, setXAxis] = useState({});

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      let mapValues = [];
      let formatterValues = pickValuesForKey(data, "displayMethod", "string");

      // run object get value push in array mapValues
      pickValuesForKey(data, "netPayment", "float").forEach((d) => {
        let obj = Object.create({});
        obj.y = d;
        mapValues.push(obj);
      });

      const createDataSet = {
        dataSets: [
          {
            values: mapValues,
            label: "",
            config: {
              colors: [
                processColor("#003680"),
                processColor("#3E70B3"),
                processColor("#BFDAFF"),
                processColor("#8FA3BF"),
                processColor("#194a8c"),
                processColor("#ccd6e5"),
              ],
              valueTextSize: 14,
              valueTextColor: processColor("#0764B0"),
              valueFormatter: "###,###,##0.00",
            },
          },
        ],
        config: {
          // BarData
          barWidth: 0.5,
        },
      };

      setDataChart(createDataSet);

      const createXAxis = {
        valueFormatter: formatterValues,
        granularityEnabled: true,
        granularity: 1,
        centerAxisLabels: false,
        position: "BOTTOM",
        textSize: 14,
        formSize: 14,
        textColor: processColor("#0764B0"),
        drawAxisLine: true,
        drawGridLines: false,
      };

      setXAxis(createXAxis);
    } else {
      setDataChart({});
      setXAxis({});
    }

    // ======= map formatter =======
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.amountContent}>
        <Text style={styles.txtAmount}>Amount ($)</Text>
      </View>
      <View style={styles.methodContent}>
        <Text style={styles.txtAmount}>Method</Text>
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
  methodContent: {
    position: "absolute",
    right: -50,
    bottom: 25,
  },
  txtAmount: {
    color: "#205580",
    fontSize: 15,
  },
});
