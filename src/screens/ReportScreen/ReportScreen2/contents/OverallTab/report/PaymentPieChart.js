import React, { useState, useEffect } from "react";
import { StyleSheet, processColor, View } from "react-native";
import { PieChart } from "react-native-charts-wrapper";
import { localize, formatMoney, formatNumberFromCurrency } from "@utils";

const legend = {
    enabled: true,
    textSize: 16,
    form: "CIRCLE",
    horizontalAlignment: "CENTER",
    verticalAlignment: "BOTTOM",
    orientation: "HORIZONTAL",
    wordWrapEnabled: true,
    maxSizePercent: 1.0,
  },
  dataConfig = {
    dataSets: [
      {
        values: [
          { value: 1000, label: "Cash" },
          { value: 1200, label: "Credit Card" },
          { value: 900, label: "Harmony Pay" },
          { value: 1200, label: "Other" },
        ],
        label: "",
        config: {
          colors: [
            processColor("#003680"),
            processColor("#3E70B3"),
            processColor("#BFDAFF"),
            processColor("#8FA3BF"),
          ],
          valueTextSize: 14,
          valueTextColor: processColor("white"),
          sliceSpace: 1,
          selectionShift: 0,
          // xValuePosition: "OUTSIDE_SLICE",
          // yValuePosition: "OUTSIDE_SLICE",
          valueFormatter: "#'%'",
          valueLineColor: processColor("white"),
          valueLinePart1Length: 0,
        },
      },
    ],
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

export default function PaymentBarChart({ data }) {
  /**state */
  const [dataChart, setDataChart] = useState(dataConfig);
  const [maxPercentsChart, setMaxPercentsChart] = useState(0);

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      let mapValues = [];
      let findMaxValues = [];
      // run object get value push in array mapValues
      data.forEach((d) => {
        let obj = Object.create({});
        const value = formatNumberFromCurrency(Object.values(d)[0]);
        findMaxValues.push(value);
        obj.value = value;
        obj.label = Object.keys(d)[0];
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
      {maxPercentsChart > 0 && (
        <PieChart
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor("transparent")}
          chartDescription={description}
          data={dataChart}
          legend={legend}
          // highlights={highlights}
          // entryLabelColor={processColor("#fff")}
          // entryLabelTextSize={14}
          drawEntryLabels={false}
          rotationEnabled={false}
          rotationAngle={45}
          usePercentValues={true}
          styledCenterText={{
            text: `${maxPercentsChart}%`,
            color: processColor("#003680"),
            size: 45,
          }}
          centerTextRadiusPercent={100}
          holeRadius={55}
          holeColor={processColor("#fff")}
          transparentCircleRadius={45}
          transparentCircleColor={processColor("#f0f0f088")}
          maxAngle={360}
          onSelect={handleSelect}
          onChange={(event) => console.log(event.nativeEvent)}
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
