import React from "react";
import { StyleSheet, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";

const legend = {
  enabled: true,
  textSize: 14,
  form: "SQUARE",
  formSize: 14,
  xEntrySpace: 10,
  yEntrySpace: 5,
  formToTextSpace: 5,
  wordWrapEnabled: true,
  maxSizePercent: 0.5,
};

const data = {
  dataSets: [
    {
      values: [
        { y: 100 },
        { y: 105 },
        { y: 102 },
        { y: 110 },
        { y: 114 },
        { y: 109 },
        { y: 105 },
        { y: 99 },
        { y: 95 },
      ],
      label: "Bar dataSet",
      config: {
        color: processColor("teal"),
        barShadowColor: processColor("lightgrey"),
        highlightAlpha: 90,
        highlightColor: processColor("red"),
      },
    },
  ],

  config: {
    barWidth: 0.7,
  },
};
const highlights = [{ x: 3 }, { x: 6 }];
const xAxis = {
  valueFormatter: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
  ],
  granularityEnabled: true,
  granularity: 1,
};

export default function PaymentBarChart({}) {
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
        style={styles.chart}
        data={data}
        xAxis={xAxis}
        animation={{ durationX: 2000 }}
        legend={legend}
        gridBackgroundColor={processColor("#ffffff")}
        visibleRange={{ x: { min: 5, max: 5 } }}
        drawBarShadow={false}
        drawValueAboveBar={true}
        drawHighlightArrow={true}
        onSelect={handleSelect}
        highlights={highlights}
        onChange={(event) => console.log(event.nativeEvent)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1,
  },
});
