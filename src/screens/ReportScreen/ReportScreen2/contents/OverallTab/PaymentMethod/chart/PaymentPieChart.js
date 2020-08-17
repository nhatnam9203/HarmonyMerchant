import React, { useState, useEffect } from "react";
import { StyleSheet, processColor, View } from "react-native";
import { PieChart } from "react-native-charts-wrapper";
import { formatNumberFromCurrency } from "@utils";

const legend = {
    enabled: false,
    textSize: 16,
    form: "CIRCLE",
    horizontalAlignment: "CENTER",
    verticalAlignment: "BOTTOM",
    orientation: "HORIZONTAL",
    wordWrapEnabled: true,
    maxSizePercent: 1.0,
  },
  // highlights = [{ x: 2 }],
  description = {
    text: "",
    textSize: 14,
    textColor: processColor("darkgray"),
  };

const calcMaxPercent = (arr) => {
  if (!arr) return 0;

  const sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  return parseFloat(Math.max(...arr) / sum).toFixed(2) * 100;
};

const pickValuesForKey = (array, forKey, format) => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === forKey);
    const [key, value] = item[0];
    if (format === "float") return formatNumberFromCurrency(value);
    return value + "";
  });
};

export default function PaymentBarChart({ data }) {
  /**state */
  const [dataChart, setDataChart] = useState({});
  const [maxPercentsChart, setMaxPercentsChart] = useState(0);

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======

      let mapValues = [];
      let formatterValues = pickValuesForKey(data, "method", "string");
      let findMaxValues = [];

      // run object get value push in array mapValues
      pickValuesForKey(data, "netPayment", "float").forEach((d, index) => {
        let obj = Object.create({});
        const value = formatNumberFromCurrency(d);
        findMaxValues.push(value);
        obj.value = value;
        obj.label = formatterValues[index];
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
              valueTextColor: processColor("transparent"),
              sliceSpace: 0,
              selectionShift: 0,
              // xValuePosition: "OUTSIDE_SLICE",
              // yValuePosition: "OUTSIDE_SLICE",
              valueFormatter: "#'%'",
              valueLineColor: processColor("white"),
              valueLinePart1Length: 0.5,
            },
          },
        ],
      };

      setDataChart(createDataSet);

      const maxPercent = calcMaxPercent(findMaxValues);
      setMaxPercentsChart(maxPercent);
    } else {
      setDataChart(dataConfig);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {maxPercentsChart > 0 && (
        <PieChart
          touchEnabled={false}
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor("transparent")}
          chartDescription={description}
          data={dataChart}
          legend={legend}
          drawEntryLabels={false}
          rotationEnabled={false}
          rotationAngle={-90}
          usePercentValues={true}
          styledCenterText={{
            text: `${maxPercentsChart}%`,
            color: processColor("#003680"),
            size: 30,
          }}
          centerTextRadiusPercent={100}
          holeRadius={55}
          holeColor={processColor("#fff")}
          transparentCircleRadius={45}
          transparentCircleColor={processColor("#f0f0f088")}
          maxAngle={360}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  chart: {
    flex: 1,
  },
});
