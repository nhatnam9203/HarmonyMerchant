import React from "react";
import { StyleSheet, processColor, View, Text } from "react-native";
import { LineChart } from "react-native-charts-wrapper";
import { formatNumberFromCurrency } from "@utils";
import {
  dateToString,
  DATE_TIME_SHOW_FORMAT_STRING,
  PURCHASE_POINTS,
  PAYMENTS,
  ORDER_STATUS,
} from "@shared/utils";

/**chart info */
const legend = {
  enabled: true,
  textSize: 14,
  form: "LINE",
  formSize: 22,
  direction: "LEFT_TO_RIGHT",
  horizontalAlignment: "RIGHT",
  verticalAlignment: "TOP",
  orientation: "HORIZONTAL",
  yEntrySpace: 5,
  xEntrySpace: 20,
  wordWrapEnabled: true,
};

const marker = {
  enabled: true,
  digits: 2,
  backgroundTint: processColor("teal"),
  markerColor: processColor("gray"),
  textColor: processColor("white"),
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
    granularityEnabled: true,
    granularity: 1,
    labelCount: 10,
    valueFormatter: "###,###,###.##",
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
    granularityEnabled: true,
    granularity: 1,
    labelCount: 10,
    // valueFormatter: "###,###,###.##",
  },
};

const xAxisDefault = {
  enabled: true,
  granularity: 1,
  drawLabels: true,
  position: "BOTTOM",
  drawAxisLine: false,
  drawGridLines: true,
  fontFamily: "HelveticaNeue-Medium",
  fontWeight: "bold",
  textSize: 12,
  textColor: processColor("gray"),
  granularityEnabled: true,
  // centerAxisLabels: true,
  axisMaximum: 5,
  axisMinimum: 0,
  yOffset: 30,
};

const formatValuesForKey = (array, pickKey) => {
  return array.map((obj) => {
    const item = Object.entries(obj).filter(([key, value]) => key === pickKey);
    const itemDate = Object.entries(obj).filter(
      ([key, value]) => key === "date"
    );
    let result = {};
    if (itemDate) {
      const [key, value] = itemDate[0];
      result = Object.assign({}, result, { x: dateToString(value, "DD, MMM") });
    }

    if (item) {
      const [key, value] = item[0];
      const ft = formatNumberFromCurrency(value);
      result = Object.assign({}, result, { y: parseFloat(ft.toFixed(2)) });
    }

    return result;
  });
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

export default function SalesLineChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = React.useState({});
  const [xAxis, setXAxis] = React.useState(xAxisDefault);

  /**useEffect */
  // add listener data change, map to chart data set
  React.useEffect(() => {
    if (data) {
      // ======= map values =======
      const formatterValues = pickValuesForKey(data, "date", "string");
      const revenueValues = formatValuesForKey(data, "revenue");
      const profitValues = formatValuesForKey(data, "profit");

      const createDataSet = {
        dataSets: [
          {
            values: revenueValues,
            label: "revenue",
            config: {
              // mode: "CUBIC_BEZIER",
              drawValues: false,
              lineWidth: scaleWidth(3),
              drawCircles: true,
              circleColor: processColor("red"),
              drawCircleHole: true,
              circleRadius: scaleWidth(7),
              highlightColor: processColor("transparent"),
              color: processColor("red"),
              // drawFilled: true,
              // fillGradient: {
              //   colors: [processColor("red"), processColor("yellow")],
              //   positions: [0, 0.5],
              //   angle: 90,
              //   orientation: "TOP_BOTTOM",
              // },
              // fillAlpha: 1000,
              valueTextSize: 15,
            },
          },
          {
            values: profitValues,
            label: "profit",
            config: {
              // mode: "CUBIC_BEZIER",
              drawValues: false,
              lineWidth: scaleWidth(3),
              drawCircles: true,
              circleColor: processColor("#0090ff"),
              drawCircleHole: true,
              circleRadius: scaleWidth(7),
              highlightColor: processColor("white"),
              color: processColor("#0090ff"),
              valueTextSize: 15,
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
        ...xAxis,
      };

      setXAxis(createXAxis);
    }

    // ======= map formatter =======
  }, [data]);

  return (
    <View style={styles.container}>
      {/* <Button onPress={() => {}} title="Press to load more" /> */}

      <LineChart
        style={styles.chart}
        data={dataChart}
        chartDescription={{ text: "" }}
        legend={legend}
        marker={marker}
        xAxis={xAxis}
        yAxis={yAxis}
        // drawGridBackground={false}
        //   borderColor={processColor("teal")}
        // borderWidth={1}
        // drawBorders={true}
        autoScaleMinMaxEnabled={false}
        touchEnabled={true}
        dragEnabled={true}
        scaleEnabled={true}
        scaleXEnabled={true}
        scaleYEnabled={true}
        pinchZoom={true}
        doubleTapToZoomEnabled={true}
        highlightPerTapEnabled={true}
        highlightPerDragEnabled={false}
        // visibleRange={this.state.visibleRange}
        dragDecelerationEnabled={true}
        dragDecelerationFrictionCoef={0.99}
        //   ref="chart"
        keepPositionOnRotation={false}
        //   onSelect={this.handleSelect.bind(this)}
        //   onChange={(event) => console.log(event.nativeEvent)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  chart: {
    flex: 1,
  },
});
