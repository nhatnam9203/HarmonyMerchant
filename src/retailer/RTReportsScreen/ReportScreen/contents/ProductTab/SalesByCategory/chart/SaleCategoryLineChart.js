import { colors } from "@shared/themes";
import { dateToString } from "@shared/utils";
import { formatNumberFromCurrency } from "@utils";
import React from "react";
import { processColor, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-charts-wrapper";
import { fonts } from "@shared/themes";

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
  drawAxisLine: false,
  drawGridLines: true,
  fontFamily: fonts.REGULAR,
  fontWeight: "normal",
  textSize: scaleFont(12),
  textColor: processColor(colors.GREYISH_BROWN),
  granularityEnabled: true,
  axisMinimum: 0,
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

    if (format === "date") {
      const ft = dateToString(value, "DD MMM");
      return ft;
    }
    return value + unit;
  });
};

export default function SalesCategoryLineChart({ data }) {
  /**state store */
  const [dataChart, setDataChart] = React.useState({ dataSets: null });
  const [xAxis, setXAxis] = React.useState(xAxisDefault);

  /**useEffect */
  // add listener data change, map to chart data set
  React.useEffect(() => {
    if (data?.length > 0) {
      // ======= map values =======
      const formatterValues = pickValuesForKey(data, "date", "date");
      const revenueValues = formatValuesForKey(data, "totalRevenue");
      const profitValues = formatValuesForKey(data, "totalProfit");

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
              valueTextSize: 15,
            },
          },
          {
            values: profitValues,
            label: "profit",
            config: {
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
        },
      };
      setDataChart(createDataSet);
      setXAxis(
        Object.assign({}, xAxis, {
          valueFormatter: formatterValues,
        })
      );
    } else {
      setDataChart({ dataSets: null });
    }

    // ======= map formatter =======
  }, [data]);

  return (
    <View style={styles.container}>
      <LineChart
        style={styles.chart}
        data={dataChart}
        chartDescription={{ text: "" }}
        legend={legend}
        marker={marker}
        xAxis={xAxis}
        yAxis={yAxis}
        touchEnabled={true}
        dragEnabled={true}
        scaleEnabled={true}
        scaleXEnabled={true}
        scaleYEnabled={true}
        autoScaleMinMaxEnabled={true}
        pinchZoom={true}
        doubleTapToZoomEnabled={false}
        highlightPerTapEnabled={true}
        highlightPerDragEnabled={false}
        dragDecelerationEnabled={true}
        dragDecelerationFrictionCoef={0.99}
        keepPositionOnRotation={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  chart: {
    flex: 1,
    paddingHorizontal: scaleWidth(16),
  },
});
