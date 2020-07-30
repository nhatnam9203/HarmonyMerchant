import React, { useEffect, useState } from "react";
import { StyleSheet, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";

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

const dataConfig = {
  dataSets: [
    {
      values: [{ y: 1000 }, { y: 1200 }, { y: 900 }, { y: 1200 }],
      label: "",
      config: {
        colors: [
          processColor("#003680"),
          processColor("#3E70B3"),
          processColor("#BFDAFF"),
          processColor("#8FA3BF"),
        ],
      },
    },
  ],
  config: {
    barWidth: 0.6,
  },
};
const highlights = [{ x: 3 }, { x: 6 }];
const xAxisDefault = {
  valueFormatter: ["Cash", "Credit Card", "Harmony Pay", "Other-Check"],
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
    drawLabels: false,
    drawAxisLine: false,
    drawGridLines: false,
  },
};

export default function PaymentBarChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = useState(dataConfig);
  const [xAxis, setXAxis] = useState(xAxisDefault);

  /**useEffect */
  // add listener data change, map to chart data set
  useEffect(() => {
    if (data) {
      // ======= map values =======
      let mapValues = [];
      let formatterValues = [];

      // run object get value push in array mapValues
      data.forEach((d) => {
        let obj = Object.create({});
        obj.y = parseFloat(Object.values(d)[0]);
        mapValues.push(obj);
        formatterValues.push(Object.keys(d)[0]);
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
              ],
            },
          },
        ],
        config: {
          barWidth: 0.6,
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
        animation={{ durationX: 2000 }}
        legend={legend}
        gridBackgroundColor={processColor("transparent")}
        // visibleRange={{ x: { min: 5, max: 5 } }}
        drawBarShadow={false}
        // drawValueAboveBar={true}
        drawHighlightArrow={true}
        onSelect={handleSelect}
        // highlights={highlights}
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
