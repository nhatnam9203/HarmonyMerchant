import { colors, fonts } from "@shared/themes";
import { dateToString } from "@shared/utils";
import { formatNumberFromCurrency } from "@utils";
import React from "react";
import { processColor, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-charts-wrapper";

/**chart info */
const legend = {
  enabled: true,
  textSize: scaleFont(14),
  form: "LINE",
  formSize: 22,
  direction: "LEFT_TO_RIGHT",
  horizontalAlignment: "RIGHT",
  verticalAlignment: "TOP",
  orientation: "HORIZONTAL",
  yEntrySpace: 5,
  xEntrySpace: 15,
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
    color: colors.WHITE_TWO,
  },
  right: {
    enabled: false,
  },
};

const xAxisDefault = {
  enabled: true,
  granularity: 1,
  drawLabels: true,
  position: "BOTTOM",
  drawAxisLine: true,
  drawGridLines: true,
  fontFamily: fonts.REGULAR,
  fontWeight: "normal",
  textSize: scaleFont(12),
  textColor: processColor(colors.GREYISH_BROWN),
  granularityEnabled: true,
  // centerAxisLabels: true,
  axisMaximum: 30,
  axisMinimum: 0,
  yOffset: 30,
  color: colors.WHITE_TWO,
  axisLineWidth: 1,
};

const log = (obj, message = "") => {
  Logger.log(`[ SalesLineChart] ${message}`, obj);
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
      result = Object.assign({}, result, { x: dateToString(value, "DD MMM") });
    }

    if (item?.length > 0) {
      const [key, value] = item[0];
      const ft = formatNumberFromCurrency(value);
      result = Object.assign({}, result, { y: parseFloat(ft.toFixed(2)) });
    } else {
      result = Object.assign({}, result, { y: 0 });
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

    if (format === "date") {
      const ft = dateToString(value, "DD MMM");
      return ft;
    }
    return value + unit;
  });
};

export default function SalesLineChart({ data = [] }) {
  /**state store */
  const [dataChart, setDataChart] = React.useState({ dataSets: [] });
  const [xAxis, setXAxis] = React.useState(xAxisDefault);

  /**useEffect */
  // add listener data change, map to chart data set
  React.useEffect(() => {
    if (data?.length > 0) {
      // ======= map values =======
      const formatterValues = pickValuesForKey(data, "date", "date");

      const revenueValues = formatValuesForKey(data, "grossSales");

      const profitValues = formatValuesForKey(data, "totalEndDay");

      const createDataSet = {
        dataSets: [
          {
            values: revenueValues,
            label: "grossSales",
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
            label: "totalEndDay",
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
        backgroundColor: "transparent",
        config: {
          // BarData
          // barWidth: 0.4,
          // group: {
          //   fromX: 0,
          //   groupSpace: 0.2,
          //   barSpace: 0,
          // },
        },
      };

      setDataChart(createDataSet);
      setXAxis(
        Object.assign({}, xAxis, {
          valueFormatter: formatterValues,
          axisMaximum: formatterValues?.length - 1 + 0.1 ?? undefined,
          labelCount: Math.min(formatterValues?.length - 1, 30),
        })
      );
    } else {
      setDataChart({ dataSets: [] });
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
        autoScaleMinMaxEnabled={true}
        touchEnabled={true}
        dragEnabled={true}
        scaleEnabled={true}
        scaleXEnabled={true}
        scaleYEnabled={true}
        pinchZoom={true}
        doubleTapToZoomEnabled={false}
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
    backgroundColor: "white",
    padding: scaleWidth(10),
  },
  chart: {
    flex: 1,
    padding: scaleWidth(16),
  },
});
